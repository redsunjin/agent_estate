# Feature Design

## Design Goal

Define the first buildable feature slice for Agent Estate without starting implementation yet.

The initial feature is:

`Scan local AI/MCP developer tooling and generate an audit-ready report that can later be shown in VS Code.`

## MVP User Story

As an eGovFrame 5.0 developer or project lead, I want to run an Agent Estate scan from VS Code so I can see which AI coding tools, MCP servers, plugins, packages, and risky capability surfaces exist in my development environment before I approve or document AI tool usage.

## Primary Flow

1. User opens an eGovFrame or general workspace in VS Code.
2. User runs `Agent Estate: Scan Environment`.
3. VS Code extension calls the local collector.
4. Collector performs read-only discovery.
5. Collector writes `.agent-estate/report.json` and `.agent-estate/report.md`.
6. VS Code opens a report summary.
7. User can export the Markdown report for review.

## First Feature Slice

Build this before any dashboard or enforcement feature:

- define the report schema
- implement collector discovery interfaces
- implement static/mock discovery fixtures
- implement Markdown report rendering
- expose a VS Code command that runs the collector

The first slice can use fixtures before real machine scanning. This keeps the extension workflow testable before touching sensitive local paths.

## Report Sections

- environment metadata
- detected agents and CLIs
- detected MCP servers
- detected plugins and packages
- detected permission/risk surfaces
- eGovFrame checklist status
- recommendations

## Risk Classification

Initial finding levels:

- `ok`: expected and low-risk
- `review`: human should inspect
- `risky`: high-impact permission or external action path
- `unknown`: found but not classified

Initial risk surfaces:

- filesystem
- shell
- GitHub
- database
- browser
- external_send
- network
- admin_permission
- secrets
- unknown

## Safety Rules

- Never collect secrets.
- Never modify tool configuration in MVP.
- Never remove or disable tools in MVP.
- Never require administrator privileges in MVP.
- Prefer fixtures and read-only scans.
- Make skipped checks explicit in the report.

## Open Questions

- Should real scanning start with OpenClaw config first, or generic MCP client configs first?
- Should package inventory be collected by shelling out to package managers, or by reading known metadata files?
- Should the VS Code extension use a Node/TypeScript collector first, or call a separate CLI package?
- What is the minimum eGovFrame project signal: `pom.xml`, eGovFrame dependency, or template marker?
