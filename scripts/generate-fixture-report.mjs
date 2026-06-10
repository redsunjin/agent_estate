#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const fixturePath = path.join(root, "packages/collector/fixtures/sample-environment.json");
const outputDirectory = path.join(root, ".agent-estate");
const outputPath = path.join(outputDirectory, "report.json");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function evidence(kind, label, itemPath, excerpt) {
  return {
    kind,
    label,
    ...(itemPath ? { path: itemPath } : {}),
    ...(excerpt ? { excerpt } : {}),
    redacted: true
  };
}

function withFixtureEvidence(item, label) {
  return {
    ...item,
    evidence: [evidence("fixture", label, "packages/collector/fixtures/sample-environment.json", "fixture data")]
  };
}

const fixture = readJson(fixturePath);

const report = {
  schemaVersion: "0.1",
  metadata: {
    reportId: "fixture-agent-estate-report",
    generatedAt: "2026-06-08T00:00:00.000Z",
    generator: "agent-estate",
    generatorVersion: "0.1.0",
    workspaceRoot: fixture.workspaceRoot,
    source: "fixture"
  },
  environment: {
    platform: fixture.platform,
    workspaceType: fixture.workspaceType,
    detectedProjectSignals: fixture.projectSignals
  },
  agents: fixture.agents.map((item) => withFixtureEvidence(item, `Fixture agent: ${item.name}`)),
  mcpServers: fixture.mcpServers.map((item) => withFixtureEvidence(item, `Fixture MCP server: ${item.name}`)),
  plugins: fixture.plugins.map((item) => withFixtureEvidence(item, `Fixture plugin: ${item.name}`)),
  packages: fixture.packages.map((item) => withFixtureEvidence(item, `Fixture package: ${item.name}`)),
  permissions: fixture.permissions.map((item) => withFixtureEvidence(item, `Fixture permission: ${item.subject}`)),
  riskFindings: [
    {
      id: "fixture-agent-shell-filesystem-review",
      level: "review",
      surfaces: ["filesystem", "shell"],
      title: "Review local agent file and shell surfaces",
      summary: "Fixture data includes a CLI agent with filesystem and shell surfaces for audit workflow testing.",
      relatedFindingIds: ["codex-cli"],
      evidence: [evidence("fixture", "Fixture risk finding", "packages/collector/fixtures/sample-environment.json")]
    }
  ],
  egovFrameChecklist: [
    {
      id: "project-signal",
      label: "eGovFrame project signal detected",
      status: "pass",
      evidence: [evidence("fixture", "eGovFrame dependency marker", "pom.xml", "org.egovframe.rte")]
    },
    {
      id: "read-only-scan",
      label: "Scan is read-only",
      status: "pass",
      evidence: [evidence("manual-note", "Fixture collector performs no local discovery")]
    },
    {
      id: "secret-redaction",
      label: "Secrets are not collected",
      status: "pass",
      evidence: [evidence("manual-note", "Fixture output contains no secret values")]
    },
    {
      id: "external-send-review",
      label: "External send surfaces require review",
      status: "review",
      evidence: [evidence("manual-note", "No external send surface in fixture")]
    },
    {
      id: "human-approval-path",
      label: "Human approval path remains explicit",
      status: "review",
      evidence: [evidence("manual-note", "Policy approval flow is planned for later slices")]
    },
    {
      id: "audit-report-export",
      label: "Audit report can be exported",
      status: "review",
      evidence: [evidence("manual-note", "Markdown export is planned for Slice 4")]
    }
  ],
  recommendations: [
    {
      id: "review-cli-surfaces",
      priority: "medium",
      title: "Review CLI agent filesystem and shell access",
      rationale: "The fixture agent advertises surfaces that should be visible in an audit report.",
      action: "Confirm whether these surfaces are acceptable for the target eGovFrame workspace.",
      relatedRiskFindingIds: ["fixture-agent-shell-filesystem-review"]
    }
  ]
};

if (!args.has("--check")) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
} else {
  if (report.schemaVersion !== "0.1") {
    throw new Error("Fixture report schema version mismatch.");
  }
  if (report.metadata.source !== "fixture") {
    throw new Error("Fixture report source must be fixture.");
  }
  if (report.agents.length === 0 || report.mcpServers.length === 0) {
    throw new Error("Fixture report must include agent and MCP findings.");
  }
  console.log("Fixture report generation check passed.");
}
