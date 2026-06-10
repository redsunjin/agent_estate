import { execFile } from "node:child_process";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import * as vscode from "vscode";

const execFileAsync = promisify(execFile);

const REPORT_DIRECTORY = ".agent-estate";
const REPORT_JSON_PATH = ".agent-estate/report.json";
const REPORT_MARKDOWN_PATH = ".agent-estate/report.md";

interface ScanSummary {
  readonly totalFindings: number;
  readonly ok: number;
  readonly review: number;
  readonly risky: number;
  readonly unknown: number;
}

interface CommandShell {
  scanEnvironment(): Promise<void>;
  openReport(): Promise<void>;
  exportMarkdownReport(): Promise<void>;
}

export function activate(context: vscode.ExtensionContext): void {
  const shell = createCommandShell(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("agentEstate.scanEnvironment", () => shell.scanEnvironment()),
    vscode.commands.registerCommand("agentEstate.openReport", () => shell.openReport()),
    vscode.commands.registerCommand("agentEstate.exportMarkdownReport", () => shell.exportMarkdownReport())
  );
}

export function deactivate(): void {}

function createCommandShell(context: vscode.ExtensionContext): CommandShell {
  const extensionRoot = context.extensionUri.fsPath;
  const repositoryRoot = path.resolve(extensionRoot, "../..");
  const reportDirectory = path.join(repositoryRoot, REPORT_DIRECTORY);
  const jsonReportPath = path.join(repositoryRoot, REPORT_JSON_PATH);
  const markdownReportPath = path.join(repositoryRoot, REPORT_MARKDOWN_PATH);

  async function runScript(scriptName: string, args: string[] = []): Promise<void> {
    const scriptPath = path.join(repositoryRoot, "scripts", scriptName);
    await execFileAsync(process.execPath, [scriptPath, ...args], { cwd: repositoryRoot });
  }

  async function renderReadOnlyReport(): Promise<void> {
    await runScript("generate-readonly-report.mjs");
    await runScript("render-markdown-report.mjs");
  }

  async function readReportSummary(): Promise<ScanSummary> {
    const report = JSON.parse(await readFile(jsonReportPath, "utf8"));
    const byLevel = report.policyClassificationSummary?.byLevel ?? {};
    const findings = [
      ...(report.agents ?? []),
      ...(report.mcpServers ?? []),
      ...(report.plugins ?? []),
      ...(report.packages ?? [])
    ];

    return {
      totalFindings: report.policyClassificationSummary?.totalFindings ?? findings.length,
      ok: byLevel.ok ?? findings.filter((finding) => finding.riskLevel === "ok").length,
      review: byLevel.review ?? findings.filter((finding) => finding.riskLevel === "review").length,
      risky: byLevel.risky ?? findings.filter((finding) => finding.riskLevel === "risky").length,
      unknown: byLevel.unknown ?? findings.filter((finding) => finding.riskLevel === "unknown").length
    };
  }

  function formatScanCompleteMessage(summary: ScanSummary): string {
    return [
      "Agent Estate read-only scan complete.",
      `Report: ${REPORT_MARKDOWN_PATH}`,
      `Review: ${summary.review}`,
      `Risky: ${summary.risky}`,
      `Unknown: ${summary.unknown}`
    ].join(" ");
  }

  async function openReport(): Promise<void> {
    const document = await vscode.workspace.openTextDocument(markdownReportPath);
    await vscode.window.showTextDocument(document, { preview: false });
  }

  return {
    async scanEnvironment(): Promise<void> {
      await renderReadOnlyReport();
      const summary = await readReportSummary();
      await vscode.window.showInformationMessage(formatScanCompleteMessage(summary));
      await openReport();
    },

    async openReport(): Promise<void> {
      await renderReadOnlyReport();
      await openReport();
    },

    async exportMarkdownReport(): Promise<void> {
      await renderReadOnlyReport();
      const destination = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(repositoryRoot, "agent-estate-report.md")),
        filters: {
          Markdown: ["md"]
        },
        saveLabel: "Export Report"
      });

      if (!destination) {
        return;
      }

      await mkdir(reportDirectory, { recursive: true });
      await copyFile(markdownReportPath, destination.fsPath);
      await vscode.window.showInformationMessage(`Agent Estate report exported to ${destination.fsPath}`);
    }
  };
}
