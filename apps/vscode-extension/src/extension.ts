import { execFile } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import * as vscode from "vscode";

const execFileAsync = promisify(execFile);

const REPORT_DIRECTORY = ".agent-estate";
const REPORT_MARKDOWN_PATH = ".agent-estate/report.md";

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
  const markdownReportPath = path.join(repositoryRoot, REPORT_MARKDOWN_PATH);

  async function runScript(scriptName: string, args: string[] = []): Promise<void> {
    const scriptPath = path.join(repositoryRoot, "scripts", scriptName);
    await execFileAsync(process.execPath, [scriptPath, ...args], { cwd: repositoryRoot });
  }

  async function renderFixtureReport(): Promise<void> {
    await runScript("generate-fixture-report.mjs");
    await runScript("render-markdown-report.mjs");
  }

  async function openReport(): Promise<void> {
    const document = await vscode.workspace.openTextDocument(markdownReportPath);
    await vscode.window.showTextDocument(document, { preview: false });
  }

  return {
    async scanEnvironment(): Promise<void> {
      await renderFixtureReport();
      await vscode.window.showInformationMessage("Agent Estate fixture scan complete.");
      await openReport();
    },

    async openReport(): Promise<void> {
      await renderFixtureReport();
      await openReport();
    },

    async exportMarkdownReport(): Promise<void> {
      await renderFixtureReport();
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
