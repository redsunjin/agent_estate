#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFile(relativePath) {
  assert(existsSync(path.join(root, relativePath)), `Missing required file: ${relativePath}`);
}

const requiredFiles = [
  "package.json",
  "tsconfig.base.json",
  "apps/vscode-extension/package.json",
  "apps/vscode-extension/src/extension.ts",
  "packages/shared/package.json",
  "packages/shared/src/index.ts",
  "packages/shared/src/report.ts",
  "packages/collector/package.json",
  "packages/collector/src/index.ts",
  "packages/collector/fixtures/sample-environment.json",
  "scripts/generate-fixture-report.mjs",
  "scripts/render-markdown-report.mjs",
  "packages/policy/package.json",
  "packages/policy/src/index.ts"
];

for (const file of requiredFiles) {
  assertFile(file);
}

const rootPackage = readJson("package.json");
assert(rootPackage.private === true, "Root package must stay private.");
assert(Array.isArray(rootPackage.workspaces), "Root package must define workspaces.");
assert(rootPackage.workspaces.includes("apps/*"), "Root workspaces must include apps/*.");
assert(rootPackage.workspaces.includes("packages/*"), "Root workspaces must include packages/*.");
assert(rootPackage.scripts?.check === "node scripts/validate-project.mjs", "Root check script must run project validation.");

const extensionPackage = readJson("apps/vscode-extension/package.json");
const commands = extensionPackage.contributes?.commands ?? [];
const commandIds = commands.map((command) => command.command);

for (const commandId of [
  "agentEstate.scanEnvironment",
  "agentEstate.openReport",
  "agentEstate.exportMarkdownReport"
]) {
  assert(commandIds.includes(commandId), `VS Code manifest missing command: ${commandId}`);
}

for (const packagePath of [
  "packages/shared/package.json",
  "packages/collector/package.json",
  "packages/policy/package.json"
]) {
  const packageJson = readJson(packagePath);
  assert(packageJson.name?.startsWith("@agent-estate/"), `${packagePath} must use the @agent-estate scope.`);
}

const sharedIndexSource = readFileSync(path.join(root, "packages/shared/src/index.ts"), "utf8");
assert(sharedIndexSource.includes("./report"), "Shared index must export the report schema module.");

const reportSchemaSource = readFileSync(path.join(root, "packages/shared/src/report.ts"), "utf8");
for (const requiredToken of [
  "AgentEstateReport",
  "ReportMetadata",
  "EnvironmentSummary",
  "AgentFinding",
  "McpServerFinding",
  "PackageFinding",
  "PermissionFinding",
  "RiskFinding",
  "Recommendation",
  "EGOVFRAME_CHECKLIST_ITEM_IDS",
  "RISK_LEVELS",
  "RISK_SURFACES"
]) {
  assert(reportSchemaSource.includes(requiredToken), `Report schema missing required token: ${requiredToken}`);
}

if (args.has("--smoke")) {
  const extensionSource = readFileSync(path.join(root, "apps/vscode-extension/src/extension.ts"), "utf8");
  assert(extensionSource.includes("activate"), "VS Code extension placeholder must export activate.");
  assert(extensionSource.includes("deactivate"), "VS Code extension placeholder must export deactivate.");
}

console.log("Agent Estate project metadata validation passed.");
