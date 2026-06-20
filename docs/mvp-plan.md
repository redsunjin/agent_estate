# MVP Plan

## MVP Goal

Build a local, non-invasive inventory reporter that can support a future VS Code extension.

The MVP should prove that Agent Estate can inspect a developer environment and produce a practical governance report without needing official eGovFrame participation yet.

## MVP 1: Local Inventory Reporter

### Scope

Start with macOS and the current OpenClaw/Codex development machine.

Scan:

- OpenClaw config and plugin/skill surfaces where safely readable
- Codex, Claude Code, Cursor, OpenCode, Gemini CLI, and similar CLI/config locations
- MCP server configs in known client config files
- package sources: brew, npm, pipx, uv, Docker, local Git repos
- open local processes/ports relevant to agent runtimes
- macOS permission indicators where available without unsafe escalation

Outputs:

- `agent-estate-report.json`
- `agent-estate-report.md`

### Non-Goals

- Do not mutate or remove installed tools.
- Do not request administrator privileges by default.
- Do not collect secrets.
- Do not upload reports externally.
- Do not claim eGovFrame official certification.

## MVP 2: VS Code Panel

Show the generated report inside VS Code.

Core views:

- Overview
- Agents and CLIs
- MCP servers
- Plugins and packages
- Risk surfaces
- eGovFrame checklist

## MVP 3: Policy File

Add a simple policy schema.

Example policy questions:

- Which MCP servers are allowed for this workspace?
- Which tools may call shell commands?
- Which external send tools are disabled?
- Which packages require review?
- Which report fields are required for public-sector project documentation?

## MVP 4: eGovFrame Example

Add an `examples/egovframe5` workflow that shows how a public-sector project can keep an AI/MCP governance report alongside development artifacts.

Status: completed as a workflow documentation pack with review checklist and report-location guidance. Project detection and policy templates remain later goals.

## Practical Next Steps

1. Create a collector package skeleton.
2. Define the report JSON shape.
3. Implement config path discovery.
4. Generate a Markdown report.
5. Add a VS Code command: `Agent Estate: Scan Environment`. Done for fixture-based scan flow.
6. Add read-only local discovery for selected safe config surfaces. Done for path/executable metadata.
7. Add policy classification for discovered surfaces. Done for rule-based read-only metadata classification.
8. Improve Markdown report quality. Done for review-first summary and audit checklist wording.
9. Add minimal VS Code scan result UX. Done for report path and review/risky/unknown counts.
10. Add an eGovFrame checklist document. Done for the initial workflow pack.
