# Test Log

Record RED/GREEN evidence and TDD exceptions here.

## 2026-06-06

- Phase: design-only.
- TDD exception: no product behavior has been implemented yet.
- Future TDD targets: fixture report generation, Markdown renderer, policy classification, VS Code command registration.

## 2026-06-08

- Phase: implementation Slice 1 metadata scaffold.
- TDD exception: no product behavior was implemented; this slice only added workspace metadata and placeholders.
- Validation passed: `npm run check`.
- Validation passed: `npm run smoke`.
- Validation passed: `scripts/agent-harness.sh`.

## 2026-06-08 Slice 2

- RED: updated `scripts/validate-project.mjs` to require `packages/shared/src/report.ts`; `npm run check` failed with the expected missing-file error.
- GREEN: added `packages/shared/src/report.ts` and exported it from `packages/shared/src/index.ts`; `npm run check` passed.
- Validation passed: `npm run smoke`.
- Validation passed: `scripts/agent-harness.sh`.
- TDD exception: no runtime behavior yet; this slice defines the shared TypeScript contract for future behavior.

## 2026-06-08 Slice 3

- RED: updated validation to require collector fixture and generator files; `npm run check` failed with the expected missing-fixture error.
- GREEN: added fixture data and `scripts/generate-fixture-report.mjs`; `npm run check` and `npm run smoke` passed.
- Generated `.agent-estate/report.json` from fixture data.

## 2026-06-08 Slice 4

- Added `scripts/render-markdown-report.mjs`.
- Updated smoke flow to generate fixture report and verify Markdown rendering.
- Validation passed: `npm run check`.
- Validation passed: `npm run smoke`.
- Validation passed: `scripts/agent-harness.sh`.
- Generated `.agent-estate/report.md` from `.agent-estate/report.json`.

## 2026-06-10 Slice 5

- RED: updated `scripts/validate-project.mjs` to require VS Code command shell registration and report command tokens; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-command error.
- GREEN: implemented `apps/vscode-extension/src/extension.ts` command registration for scan, open report, and export Markdown report; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- TDD note: command shell remains fixture-only. Real local read-only discovery is intentionally deferred to Slice 6.

## 2026-06-10 Slice 6

- RED: added validation requirements for `scripts/generate-readonly-report.mjs`, collector read-only discovery tokens, and the `discovery:report` smoke step; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-file error.
- GREEN: added read-only discovery report generation, updated VS Code scan command to use it, and confirmed `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Generated `.agent-estate/report.json` and `.agent-estate/report.md` from live read-only metadata for local verification.
- Safety note: discovery records path and executable metadata only; it does not read config values or include evidence excerpts.
