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

## 2026-06-10 Slice 7

- RED: updated `scripts/validate-project.mjs` to require `scripts/policy-classifier.mjs` and policy classification tokens; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-file error.
- GREEN: added policy classifier rules, wired read-only discovery findings through classification, and confirmed `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Generated `.agent-estate/report.json` and `.agent-estate/report.md` from live read-only metadata for local verification.
- Safety note: policy classification remains metadata-only and does not read config values or secret contents.

## 2026-06-10 Slice 8

- RED: updated `scripts/validate-project.mjs` to require review-first Markdown report quality tokens; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-renderer-token error.
- GREEN: added risk summary table, review queue table, and audit checklist wording; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Generated `.agent-estate/report.md` from live read-only metadata and confirmed review items are shown near the top.
- Safety note: report quality changes only reorganize existing metadata; no deeper config reads were added.

## 2026-06-10 Slice 9

- RED: updated `scripts/validate-project.mjs` to require VS Code scan summary UX tokens; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-extension-token error.
- GREEN: added report summary parsing and scan completion message with report path, review count, risky count, and unknown count; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Safety note: VS Code UX reads only the generated local report JSON and does not read additional config files.

## 2026-06-20 Goal 1 eGovFrame Workflow Pack

- Phase: documentation-only workflow pack.
- TDD exception: no runtime behavior or validation logic changed in this goal.
- Validation target: `scripts/agent-harness.sh`.
- Validation passed: `scripts/agent-harness.sh`.

## 2026-06-20 Goal 2 eGovFrame 5.0 Baseline

- Phase: documentation-only official baseline.
- TDD exception: no runtime behavior or validation logic changed in this goal.
- Validation target: `scripts/agent-harness.sh`.
- Validation passed: `scripts/agent-harness.sh`.

## 2026-06-20 Goal 3 eGovFrame Project Detection Metadata

- RED: updated `scripts/validate-project.mjs` to require `egovframe-pom`, `org.egovframe.rte`, and `egovframe-vscode-initializr`; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-token error.
- GREEN: added metadata-only eGovFrame project signal detection and schema docs; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Safety note: detection checks path existence and literal markers only; it does not store raw `pom.xml` or VS Code config contents.

## 2026-06-20 Goal 4 Public-Sector Policy Template

- RED: updated `scripts/validate-project.mjs` to require `examples/egovframe5/policy-template.json` and `docs/policy-template.md`; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-template error.
- GREEN: added the advisory eGovFrame 5.0 public-sector review policy template and usage documentation; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Validation passed: `scripts/agent-harness.sh`.
- Safety note: the template is advisory only and does not mutate tools, block execution, upload reports, or claim official eGovFrame certification.

## 2026-06-20 Goal 5 VS Code Build And Runtime Readiness

- RED: updated `scripts/validate-project.mjs` to require a VS Code extension build script and package build commands; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-build-script error.
- Dependency boundary: no external dependencies were installed. Build readiness uses Node's built-in TypeScript type-stripping API when available and a source-specific fallback for the current extension command shell.
- GREEN: added `scripts/build-vscode-extension.mjs`, root `npm run build`, and extension package `build`; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed and generated `apps/vscode-extension/dist/extension.js`.
- Fallback validation passed: `env AGENT_ESTATE_FORCE_SIMPLE_TS_STRIP=1 npm run build`.
- Validation passed: `npm run check`, `npm run smoke`, and `scripts/agent-harness.sh`.
- Residual note: Node prints an experimental warning for `stripTypeScriptTypes`; a future TypeScript/esbuild setup may require explicit dependency approval.

## 2026-06-20 Goal 6 Contribution And Compatibility Readiness

- RED: updated `scripts/validate-project.mjs` to require `docs/contribution-readiness.md` and `docs/compatibility-readiness.md`; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh` failed with the expected missing-readiness-doc error.
- GREEN: added contribution readiness and compatibility readiness notes and linked them from `README.md`; `FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh` passed.
- Validation passed: `npm run check`, `npm run smoke`, and `scripts/agent-harness.sh`.
- Safety note: readiness language separates contribution recognition, official repository inclusion, and compatibility confirmation, and explicitly says Agent Estate is not currently certified.
