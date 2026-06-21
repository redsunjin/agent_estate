#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = path.join("examples", "egovframe5", "sample-project");

const result = spawnSync(
  process.execPath,
  ["scripts/generate-readonly-report.mjs", "--check", "--expect-egovframe"],
  {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      AGENT_ESTATE_DISCOVERY_ROOT: fixtureRoot
    }
  }
);

if (result.stdout) {
  process.stdout.write(result.stdout);
}
if (result.stderr) {
  process.stderr.write(result.stderr);
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("eGovFrame fixture report validation passed.");
