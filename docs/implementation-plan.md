# Implementation Plan

## Approach

Use the Superpowers-lite flow: brainstorm, design, define acceptance tests, then implement in small verified slices.

This phase is design-only. Do not implement scanning behavior yet. The immediate work is to turn the feasibility report into a buildable MVP plan for a VS Code-first product.

## Milestones

- [x] Bootstrap project harness with `superpowers-lite`
- [x] Create initial product and strategy docs
- [x] Define first buildable feature slice
- [x] Define acceptance tests for the design phase
- [x] Scaffold TypeScript monorepo metadata
- [x] Define report schema in `packages/shared`
- [x] Add fixture-based collector prototype
- [x] Add Markdown report renderer
- [ ] Add VS Code command shell
- [ ] Run harness after each slice

## Planned Build Slices

### Slice 1: Project Metadata

Create package metadata and workspace tooling without implementing product behavior.

Expected files:

- root `package.json`
- root `tsconfig.base.json`
- package-level placeholders
- VS Code extension manifest draft

Status: completed as metadata and placeholders only. Real scanner behavior remains deferred to later slices.

### Slice 2: Report Schema

Define shared TypeScript types for:

- report metadata
- agent and CLI findings
- MCP server findings
- package/plugin findings
- permission and risk findings
- recommendations

Status: completed with `packages/shared/src/report.ts` and `docs/report-schema.md`.

### Slice 3: Fixture Collector

Build a collector that reads fixture JSON and emits a normalized report. This proves the data model before scanning the real machine.

Status: completed with `packages/collector/fixtures/sample-environment.json`, `scripts/generate-fixture-report.mjs`, and `.agent-estate/report.json`.

### Slice 4: Markdown Renderer

Render report JSON into audit-ready Markdown.

Status: completed with `scripts/render-markdown-report.mjs` and `.agent-estate/report.md`.

### Slice 5: VS Code Command Shell

Add command registration for:

- `Agent Estate: Scan Environment`
- `Agent Estate: Open Report`
- `Agent Estate: Export Markdown Report`

### Slice 6: Real Read-Only Discovery

Only after fixtures and schema are stable, add read-only discovery for selected config paths.

Initial discovery order:

1. workspace `.agent-estate` settings
2. OpenClaw config surfaces
3. known MCP client config paths
4. agent CLI path discovery
5. package inventory

## Design Constraints

- Local-first.
- No secret collection.
- No external upload.
- No mutation/removal/disabling in MVP.
- No admin privilege requirement.
- eGovFrame support is a workflow and checklist first, not a claim of official certification.
