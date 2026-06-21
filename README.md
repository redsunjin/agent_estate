# Agent Estate

Agent Estate is a VS Code-first developer environment governance project for AI agents, MCP servers, plugins, local permissions, and audit-ready inventory.

The first target is an eGovFrame 5.0-compatible workflow: a developer can open a public-sector project in VS Code and see which AI coding tools, MCP servers, plugins, and risky permissions are present on the machine or workspace.

## Why This Exists

AI coding tools are moving from single-agent experiments to multi-agent developer environments. Once Codex, Claude Code, Cursor, Copilot, OpenCode, Gemini CLI, OpenClaw, MCP servers, shell tools, and local plugins coexist, teams need a single place to answer:

- What is installed?
- Which agents can call which tools?
- Which MCP servers and plugins are stale, duplicated, or risky?
- Which tools may touch files, GitHub, databases, browsers, shell, or external messaging surfaces?
- What should be reported for public-sector review, audit, or compatibility checks?

## Product Direction

Start as an independent open-source VS Code extension and collector, then add optional eGovFrame 5.0 examples and compatibility materials.

The project should not rush into official eGovFrame contribution. The preferred route is:

1. Build a working local MVP.
2. Publish as open source.
3. Prepare eGovFrame 5.0-compatible sample docs.
4. Join eGovFrame contribution only when the tool has practical evidence.
5. Later consider official repository reference, contribution recognition, or compatibility confirmation.

## Initial Structure

```text
agent-estate/
├── apps/
│   └── vscode-extension/
├── packages/
│   ├── collector/
│   ├── policy/
│   └── shared/
├── examples/
│   └── egovframe5/
├── docs/
└── reports/
```

## Starting Documents

- [Product Brief](docs/product-brief.md)
- [MVP Plan](docs/mvp-plan.md)
- [Architecture](docs/architecture.md)
- [eGovFrame Strategy](docs/egovframe-strategy.md)
- [eGovFrame 5.0 Baseline](docs/egovframe5-baseline.md)
- [Contribution Readiness](docs/contribution-readiness.md)
- [Compatibility Readiness](docs/compatibility-readiness.md)
- [Source Report](docs/source-report.md)

## Source Report

The original feasibility report remains outside this project as a cross-project research archive:

`/Users/Agent/ps-workspace/reports/public-sector/egovframe5-agent-estate-manager-contribution-feasibility-2026-06-06.md`
