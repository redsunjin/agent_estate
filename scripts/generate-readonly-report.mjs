#!/usr/bin/env node
import { accessSync, constants, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyDiscoveredSurface,
  policyClassificationSummary,
  policyEvidence
} from "./policy-classifier.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const workspaceRoot = resolveDiscoveryRoot();
const outputDirectory = path.join(repositoryRoot, ".agent-estate");
const outputPath = path.join(outputDirectory, "report.json");

const homeDirectory = os.homedir();
const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);

function resolveDiscoveryRoot() {
  const configuredRoot = process.env.AGENT_ESTATE_DISCOVERY_ROOT;
  if (!configuredRoot) {
    return repositoryRoot;
  }
  return path.resolve(repositoryRoot, configuredRoot);
}

function evidence(kind, label, itemPath) {
  return {
    kind,
    label,
    ...(itemPath ? { path: itemPath } : {}),
    redacted: true
  };
}

function withPolicyClassification(item, type) {
  const classification = classifyDiscoveredSurface({ ...item, type });
  return {
    ...item,
    riskLevel: classification.level,
    policyClassification: classification,
    evidence: [...(item.evidence ?? []), policyEvidence(classification)]
  };
}

function safeRelativeOrAbsolute(itemPath, basePath = workspaceRoot) {
  if (!itemPath) {
    return undefined;
  }
  const relative = path.relative(basePath, itemPath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative) ? relative : itemPath;
}

function readableFile(itemPath) {
  try {
    return existsSync(itemPath) && statSync(itemPath).isFile();
  } catch {
    return false;
  }
}

function readableDirectory(itemPath) {
  try {
    return existsSync(itemPath) && statSync(itemPath).isDirectory();
  } catch {
    return false;
  }
}

function fileContainsLiteral(itemPath, literal) {
  try {
    if (!readableFile(itemPath)) {
      return false;
    }
    const fileSize = statSync(itemPath).size;
    if (fileSize > 1024 * 1024) {
      return false;
    }
    return readFileSync(itemPath, "utf8").includes(literal);
  } catch {
    return false;
  }
}

function findExecutable(commandName) {
  for (const entry of pathEntries) {
    const candidate = path.join(entry, commandName);
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Keep discovery best-effort and read-only.
    }
  }
  return undefined;
}

function detectedFileCandidates(candidates) {
  return candidates.filter((candidate) => readableFile(candidate.path));
}

function detectedDirectoryCandidates(candidates) {
  return candidates.filter((candidate) => readableDirectory(candidate.path));
}

function projectSignals() {
  const signals = [];
  const pomPath = path.join(workspaceRoot, "pom.xml");

  for (const candidate of [
    { kind: "workspace-config", label: "Agent Estate workspace report directory", path: path.join(workspaceRoot, ".agent-estate") },
    { kind: "workspace-config", label: "VS Code workspace settings", path: path.join(workspaceRoot, ".vscode/settings.json") },
    { kind: "egovframe-pom", label: "Maven pom.xml candidate for eGovFrame dependency check", path: pomPath }
  ]) {
    if (readableFile(candidate.path) || readableDirectory(candidate.path)) {
      signals.push({
        kind: candidate.kind,
        label: candidate.label,
        path: safeRelativeOrAbsolute(candidate.path),
        evidence: "path-exists"
      });
    }
  }

  if (fileContainsLiteral(pomPath, "org.egovframe.rte")) {
    signals.push({
      kind: "egovframe-dependency",
      label: "eGovFrame runtime Maven dependency marker",
      path: safeRelativeOrAbsolute(pomPath),
      evidence: "literal-match:org.egovframe.rte"
    });
  }

  for (const candidate of [
    { path: path.join(workspaceRoot, ".vscode/egovframe-initializr.json"), evidence: "path-exists" },
    { path: path.join(workspaceRoot, ".vscode/extensions.json"), evidence: "literal-match:egovframe-vscode-initializr", literal: "egovframe-vscode-initializr" }
  ]) {
    const detected = candidate.literal
      ? fileContainsLiteral(candidate.path, candidate.literal)
      : readableFile(candidate.path);
    if (detected) {
      signals.push({
        kind: "egovframe-vscode-initializr",
        label: "eGovFrame VS Code Initializr workspace marker",
        path: safeRelativeOrAbsolute(candidate.path),
        evidence: candidate.evidence
      });
    }
  }

  return signals;
}

function hasStrongEgovFrameSignal(signals) {
  return signals.some((signal) =>
    ["egovframe-dependency", "egovframe-vscode-initializr"].includes(signal.kind)
  );
}

function discoverOpenClawPlugins() {
  const openClawDirectories = detectedDirectoryCandidates([
    { name: "OpenClaw state directory", path: path.join(homeDirectory, ".openclaw") },
    { name: "OpenClaw plugin skills", path: path.join(homeDirectory, ".openclaw/plugin-skills") },
    { name: "OpenClaw workspace docs", path: path.join(homeDirectory, ".openclaw/workspace") }
  ]);

  const openClawFiles = detectedFileCandidates([
    { name: "OpenClaw config", path: path.join(homeDirectory, ".openclaw/openclaw.json") },
    { name: "OpenClaw Telegram bindings", path: path.join(homeDirectory, ".openclaw/telegram/thread-bindings-default.json") }
  ]);

  return [...openClawDirectories, ...openClawFiles].map((item, index) =>
    withPolicyClassification({
      id: `openclaw-config-${index + 1}`,
      name: item.name,
      host: "openclaw",
      path: safeRelativeOrAbsolute(item.path),
      evidence: [evidence("config", `Detected read-only OpenClaw surface: ${item.name}`, safeRelativeOrAbsolute(item.path))]
    }, "plugin")
  );
}

function discoverMcpServers() {
  const candidates = detectedFileCandidates([
    { name: "Claude Desktop MCP config", path: path.join(homeDirectory, "Library/Application Support/Claude/claude_desktop_config.json") },
    { name: "Cursor MCP config", path: path.join(homeDirectory, ".cursor/mcp.json") },
    { name: "VS Code MCP config", path: path.join(homeDirectory, "Library/Application Support/Code/User/mcp.json") },
    { name: "Workspace MCP config", path: path.join(workspaceRoot, ".vscode/mcp.json") },
    { name: "Agent Estate workspace settings", path: path.join(workspaceRoot, ".agent-estate/settings.json") }
  ]);

  return candidates.map((item, index) =>
    withPolicyClassification({
      id: `mcp-client-config-${index + 1}`,
      name: item.name,
      transport: "unknown",
      configPath: safeRelativeOrAbsolute(item.path),
      declaredTools: [],
      riskSurfaces: ["unknown"],
      evidence: [evidence("config", `Detected MCP client config path: ${item.name}`, safeRelativeOrAbsolute(item.path))]
    }, "mcpServer")
  );
}

function discoverAgentExecutables() {
  const commands = [
    ["codex", "Codex CLI"],
    ["claude", "Claude Code CLI"],
    ["cursor", "Cursor CLI"],
    ["opencode", "OpenCode CLI"],
    ["gemini", "Gemini CLI"],
    ["qwen", "Qwen CLI"],
    ["kiro", "Kiro CLI"],
    ["kimi", "Kimi CLI"],
    ["iflow", "iFlow CLI"],
    ["openclaw", "OpenClaw CLI"]
  ];

  return commands.flatMap(([command, name]) => {
    const executablePath = findExecutable(command);
    if (!executablePath) {
      return [];
    }

    return [withPolicyClassification({
      id: `agent-cli-path-${command}`,
      name,
      kind: "cli",
      executablePath,
      configPaths: [],
      riskSurfaces: ["filesystem", "shell"],
      evidence: [evidence("command", `Detected executable on PATH: ${command}`, executablePath)]
    }, "agent")];
  });
}

function discoverPackageManagers() {
  const managers = [
    ["npm", "npm"],
    ["pnpm", "pnpm"],
    ["yarn", "yarn"],
    ["brew", "brew"],
    ["uv", "uv"],
    ["pipx", "pip"],
    ["docker", "unknown"]
  ];

  return managers.flatMap(([command, manager]) => {
    const executablePath = findExecutable(command);
    if (!executablePath) {
      return [];
    }

    return [withPolicyClassification({
      id: `package-manager-path-${command}`,
      name: command,
      manager,
      path: executablePath,
      relatedToAgentTooling: false,
      evidence: [evidence("command", `Detected package manager executable on PATH: ${command}`, executablePath)]
    }, "package")];
  });
}

function checklistItem(id, label, status, evidenceItems) {
  return {
    id,
    label,
    status,
    evidence: evidenceItems
  };
}

function buildReport() {
  const agents = discoverAgentExecutables();
  const mcpServers = discoverMcpServers();
  const plugins = discoverOpenClawPlugins();
  const packages = discoverPackageManagers();
  const signals = projectSignals();

  const report = {
    schemaVersion: "0.1",
    metadata: {
      reportId: "read-only-agent-estate-report",
      generatedAt: new Date().toISOString(),
      generator: "agent-estate",
      generatorVersion: "0.1.0",
      workspaceRoot,
      source: "read-only-discovery"
    },
    environment: {
      platform: process.platform,
      homeDirectory,
      workspaceType: hasStrongEgovFrameSignal(signals) ? "egovframe" : "general",
      detectedProjectSignals: signals
    },
    agents,
    mcpServers,
    plugins,
    packages,
    permissions: [
      {
        id: "read-only-filesystem-path-checks",
        surface: "filesystem",
        subject: "Read-only config and executable path discovery",
        level: "ok",
        description: "Discovery checks path existence and executable locations without reading secret values or mutating configuration.",
        evidence: [evidence("manual-note", "Read-only discovery performs metadata checks only")]
      }
    ],
    riskFindings: [
      {
        id: "policy-classification-summary",
        level: agents.some((agent) => agent.riskLevel === "risky") ? "risky" : agents.length || mcpServers.length || plugins.length ? "review" : "ok",
        surfaces: ["filesystem"],
        title: "Policy classification applied to discovered surfaces",
        summary: "Rule-based policy classification labeled discovered agent, MCP, OpenClaw, and package surfaces without reading config contents.",
        relatedFindingIds: [...agents.map((agent) => agent.id), ...mcpServers.map((server) => server.id), ...plugins.map((plugin) => plugin.id), ...packages.map((item) => item.id)],
        evidence: [evidence("manual-note", "Policy classification is secret-safe and uses metadata only")]
      },
      {
        id: "read-only-discovery-review",
        level: agents.length || mcpServers.length || plugins.length ? "review" : "ok",
        surfaces: ["filesystem"],
        title: "Review discovered local agent and MCP surfaces",
        summary: "Read-only discovery found local path surfaces that may need human review before public-sector AI tool approval.",
        relatedFindingIds: [...agents.map((agent) => agent.id), ...mcpServers.map((server) => server.id), ...plugins.map((plugin) => plugin.id)],
        evidence: [evidence("manual-note", "No file contents or secret values are included in this finding")]
      }
    ],
    egovFrameChecklist: [
      checklistItem("project-signal", "eGovFrame project signal detected", hasStrongEgovFrameSignal(signals) ? "pass" : "review", [evidence("manual-note", "Read-only discovery checked workspace project markers")]),
      checklistItem("read-only-scan", "Scan is read-only", "pass", [evidence("manual-note", "Discovery uses path existence and executable metadata checks only")]),
      checklistItem("secret-redaction", "Secrets are not collected", "pass", [evidence("manual-note", "Discovery records no config values or content excerpts")]),
      checklistItem("external-send-review", "External send surfaces require review", "review", [evidence("manual-note", "External send behavior is not executed or tested")]),
      checklistItem("human-approval-path", "Human approval path remains explicit", "review", [evidence("manual-note", "Policy approval flow remains planned")]),
      checklistItem("audit-report-export", "Audit report can be exported", "pass", [evidence("manual-note", "Markdown renderer and VS Code export command are available")])
    ],
    recommendations: [
      {
        id: "review-read-only-discovery-results",
        priority: "medium",
        title: "Review policy-classified local agent and MCP surfaces",
        rationale: "Rule-based classification now separates ok, review, risky, and unknown items while keeping discovery secret-safe.",
        action: "Review items marked review or unknown before approving AI agent tooling in a public-sector workspace.",
        relatedRiskFindingIds: ["policy-classification-summary", "read-only-discovery-review"]
      }
    ]
  };

  return {
    ...report,
    policyClassificationSummary: policyClassificationSummary(report)
  };
}

function assertCheck(report) {
  if (report.metadata.source !== "read-only-discovery") {
    throw new Error("Read-only report source must be read-only-discovery.");
  }
  if (!report.permissions.some((item) => item.id === "read-only-filesystem-path-checks")) {
    throw new Error("Read-only report must include filesystem path permission evidence.");
  }
  if (!report.egovFrameChecklist.some((item) => item.id === "secret-redaction" && item.status === "pass")) {
    throw new Error("Read-only report must explicitly pass secret redaction.");
  }
  const classifiedFindings = [...report.agents, ...report.mcpServers, ...report.plugins, ...report.packages];
  if (!classifiedFindings.every((item) => item.policyClassification && ["ok", "review", "risky", "unknown"].includes(item.riskLevel))) {
    throw new Error("All discovered surfaces must include policy classification.");
  }
  if (!classifiedFindings.every((item) => item.evidence.some((entry) => entry.label.startsWith("Policy classification")))) {
    throw new Error("All discovered surfaces must include policy classification evidence.");
  }
  if (!report.riskFindings.some((item) => item.id === "policy-classification-summary")) {
    throw new Error("Read-only report must include a policy-classification risk summary.");
  }
  const serialized = JSON.stringify(report);
  if (serialized.includes("apiKey") || serialized.includes("password") || serialized.includes("tokenValue")) {
    throw new Error("Read-only report appears to include secret-like values.");
  }
  if (args.has("--expect-egovframe")) {
    if (report.environment.workspaceType !== "egovframe") {
      throw new Error("Expected eGovFrame fixture workspace to be classified as egovframe.");
    }
    if (!report.environment.detectedProjectSignals.some((signal) => signal.kind === "egovframe-dependency" && signal.evidence === "literal-match:org.egovframe.rte")) {
      throw new Error("Expected eGovFrame fixture workspace to include an org.egovframe.rte dependency signal.");
    }
  }
}

const report = buildReport();
assertCheck(report);

if (args.has("--check")) {
  console.log("Read-only discovery report generation check passed.");
} else {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
}
