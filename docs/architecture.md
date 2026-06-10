# Architecture

## Shape

Agent Estate should be a small monorepo with a VS Code app and shared packages.

```text
apps/vscode-extension
packages/collector
packages/policy
packages/shared
examples/egovframe5
docs
reports
```

## Components

### VS Code Extension

Role:

- command surface
- report viewer
- workspace-aware scan trigger
- eGovFrame checklist panel

Initial commands:

- `Agent Estate: Scan Environment`
- `Agent Estate: Open Report`
- `Agent Estate: Export Markdown Report`

### Collector

Role:

- discover configs and installed tools
- normalize findings into a report model
- avoid secrets and avoid destructive actions

Collector modules:

- agent CLI discovery
- MCP config discovery
- package inventory
- local process and port inventory
- OS permission indicators
- report writer

### Policy

Role:

- define allowed/disallowed tool patterns
- classify risk surfaces
- produce findings such as `ok`, `review`, `risky`, `unknown`

Policy examples:

- eGovFrame public-sector default
- local-first development default
- strict external-send review default

### Shared

Role:

- report types
- risk enums
- path utilities
- Markdown rendering helpers

## Report Model Draft

```text
Report
├── metadata
├── environment
├── agents[]
├── mcpServers[]
├── plugins[]
├── packages[]
├── permissions[]
├── riskFindings[]
└── recommendations[]
```

## Risk Surfaces

Initial surfaces:

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

## Design Principles

- Local-first by default.
- Read-only scans first.
- No secret collection.
- No admin privilege requirement for MVP.
- Explicitly separate inventory from enforcement.
- Keep original feasibility research outside the project repo and link to it.

