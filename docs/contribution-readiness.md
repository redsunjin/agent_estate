# Contribution Readiness

This document defines when Agent Estate is ready to move from a local MVP into public contribution conversations around eGovFrame development environments.

Agent Estate should not enter contribution activity until it has working evidence, review-safe language, and a clear release boundary.

## Open-source release readiness

Minimum conditions:

- README explains the local-first Agent Estate value clearly.
- License direction is explicit.
- `npm run check`, `npm run smoke`, and `scripts/agent-harness.sh` pass.
- Generated reports remain local by default.
- The VS Code extension can be built into `apps/vscode-extension/dist/extension.js`.
- Known limitations are documented without hiding risks.

Release blockers:

- secret collection,
- external report upload by default,
- official eGovFrame certification claims,
- undocumented AI/MCP permission behavior.

## eGovFrame sample/docs readiness

Minimum conditions:

- `examples/egovframe5` explains the Agent Estate scan and review flow.
- `docs/egovframe5-baseline.md` is refreshed against official sources.
- `docs/policy-template.md` explains the advisory public-sector policy template.
- eGovFrame project detection remains read-only and metadata-only.
- Review artifacts explain where generated reports should and should not be stored.

The sample/docs track is the first reasonable external-facing track because it can show practical value without requiring official runtime integration.

## Possible official repository reference

Possible future targets:

- eGovFrame documentation references,
- eGovFrame VS Code Initializr adjacent guidance,
- AI/MCP governance sample material,
- public-sector project review checklist material.

Do not pursue official repository reference until:

- a local scan works reliably,
- a report can be exported,
- the VS Code command surface is buildable,
- the eGovFrame sample workflow is clear,
- compatibility language is reviewed.

## Future contribution participation

Contribution participation may become useful after MVP evidence exists. Treat it as a later trust-building track, not as proof of product certification.

Before participating:

1. Prepare a concise public pitch.
2. Separate product value from official eGovFrame status.
3. Include a working local demo path.
4. Include non-goals and safety boundaries.
5. Avoid claims about automatic compliance, endpoint security, or official compatibility.

## Current Position

Agent Estate is ready for internal MVP iteration and eGovFrame workflow documentation. It is not ready to claim official eGovFrame status.
