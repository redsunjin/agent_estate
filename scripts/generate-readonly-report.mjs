#!/usr/bin/env node
import { accessSync, constants, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const outputDirectory = path.join(root, ".agent-estate");
const outputPath = path.join(outputDirectory, "report.json");

const homeDirectory = os.homedir();
const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);

function evidence(kind, label, itemPath) {
  return {
    kind,
    label,
    ...(itemPath ? { path: itemPath } : {}),
    redacted: true
  };
}

function safeRelativeOrAbsolute(itemPath) {
  if (!itemPath) {
    return undefined;
  }
  const relative = path.relative(root, itemPath);
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

  for (const candidate of [
    { kind: "workspace-config", label: "Agent Estate workspace report directory", path: path.join(root, ".agent-estate") },
    { kind: "workspace-config", label: "VS Code workspace settings", path: path.join(root, ".vscode/settings.json") },
    { kind: "pom.xml", label: "Maven project descriptor", path: path.join(root, "pom.xml") }
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

  return signals;
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

  return [...openClawDirectories, ...openClawFiles].map((item, index) => ({
    id: `openclaw-config-${index + 1}`,
    name: item.name,
    host: "openclaw",
    path: safeRelativeOrAbsolute(item.path),
    riskLevel: "review",
    evidence: [evidence("config", `Detected read-only OpenClaw surface: ${item.name}`, safeRelativeOrAbsolute(item.path))]
  }));
}

function discoverMcpServers() {
  const candidates = detectedFileCandidates([
    { name: "Claude Desktop MCP config", path: path.join(homeDirectory, "Library/Application Support/Claude/claude_desktop_config.json") },
    { name: "Cursor MCP config", path: path.join(homeDirectory, ".cursor/mcp.json") },
    { name: "VS Code MCP config", path: path.join(homeDirectory, "Library/Application Support/Code/User/mcp.json") },
    { name: "Workspace MCP config", path: path.join(root, ".vscode/mcp.json") },
    { name: "Agent Estate workspace settings", path: path.join(root, ".agent-estate/settings.json") }
  ]);

  return candidates.map((item, index) => ({
    id: `mcp-client-config-${index + 1}`,
    name: item.name,
    transport: "unknown",
    configPath: safeRelativeOrAbsolute(item.path),
    declaredTools: [],
    riskLevel: "review",
    riskSurfaces: ["unknown"],
    evidence: [evidence("config", `Detected MCP client config path: ${item.name}`, safeRelativeOrAbsolute(item.path))]
  }));
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

    return [{
      id: `agent-cli-path-${command}`,
      name,
      kind: "cli",
      executablePath,
      configPaths: [],
      riskLevel: "review",
      riskSurfaces: ["filesystem", "shell"],
      evidence: [evidence("command", `Detected executable on PATH: ${command}`, executablePath)]
    }];
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

    return [{
      id: `package-manager-path-${command}`,
      name: command,
      manager,
      path: executablePath,
      relatedToAgentTooling: false,
      riskLevel: "ok",
      evidence: [evidence("command", `Detected package manager executable on PATH: ${command}`, executablePath)]
    }];
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

  return {
    schemaVersion: "0.1",
    metadata: {
      reportId: "read-only-agent-estate-report",
      generatedAt: new Date().toISOString(),
      generator: "agent-estate",
      generatorVersion: "0.1.0",
      workspaceRoot: root,
      source: "read-only-discovery"
    },
    environment: {
      platform: process.platform,
      homeDirectory,
      workspaceType: signals.some((signal) => signal.kind === "pom.xml" || signal.kind === "egovframe-dependency") ? "egovframe" : "general",
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
      checklistItem("project-signal", "eGovFrame project signal detected", signals.some((signal) => signal.kind === "pom.xml" || signal.kind === "egovframe-dependency") ? "pass" : "review", [evidence("manual-note", "Read-only discovery checked workspace project markers")]),
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
        title: "Review read-only discovery results before enabling real policy checks",
        rationale: "The initial real discovery slice only identifies local path surfaces and does not classify detailed tool behavior.",
        action: "Confirm which discovered config and CLI surfaces should be included in Slice 7 policy classification.",
        relatedRiskFindingIds: ["read-only-discovery-review"]
      }
    ]
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
  const serialized = JSON.stringify(report);
  if (serialized.includes("apiKey") || serialized.includes("password") || serialized.includes("tokenValue")) {
    throw new Error("Read-only report appears to include secret-like values.");
  }
}

const report = buildReport();
assertCheck(report);

if (args.has("--check")) {
  console.log("Read-only discovery report generation check passed.");
} else {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}
