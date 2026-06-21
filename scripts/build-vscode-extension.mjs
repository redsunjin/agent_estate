#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import moduleApi from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "apps/vscode-extension/src/extension.ts");
const outputPath = path.join(root, "apps/vscode-extension/dist/extension.js");

function stripSimpleExtensionTypes(source) {
  return source
    .replace(/interface\s+\w+\s*\{[\s\S]*?\n\}/g, "")
    .replace(/: vscode\.ExtensionContext/g, "")
    .replace(/: Promise<void>/g, "")
    .replace(/: Promise<ScanSummary>/g, "")
    .replace(/: void/g, "")
    .replace(/: CommandShell/g, "")
    .replace(/: ScanSummary/g, "")
    .replace(/: string\[\]/g, "")
    .replace(/: string/g, "")
    .replace(/\breadonly\s+/g, "");
}

function stripTypes(source) {
  const { stripTypeScriptTypes } = moduleApi;
  if (process.env.AGENT_ESTATE_FORCE_SIMPLE_TS_STRIP !== "1" && typeof stripTypeScriptTypes === "function") {
    return stripTypeScriptTypes(source, { mode: "strip" });
  }

  return stripSimpleExtensionTypes(source);
}

function checkSyntax(outputFilePath) {
  const result = spawnSync(process.execPath, ["--check", outputFilePath], {
    cwd: root,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`VS Code extension build output failed syntax check:\n${result.stderr || result.stdout}`);
  }
}

const source = await readFile(sourcePath, "utf8");
const output = [
  "// Generated from apps/vscode-extension/src/extension.ts by scripts/build-vscode-extension.mjs.",
  stripTypes(source).trim(),
  ""
].join("\n");

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, output);
checkSyntax(outputPath);

console.log(`Build completed: ${path.relative(root, outputPath)}`);
