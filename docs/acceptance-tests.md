# Acceptance Tests

## Goal

Design Agent Estate MVP feature development for a VS Code-first AI agent and MCP governance extension

## Required Behaviors

- [x] Design documents identify the first buildable feature slice.
- [x] Architecture separates VS Code UI, collector, policy, and shared report model.
- [x] MVP scope is read-only and avoids secret collection.
- [x] eGovFrame strategy separates contribution recognition, official repository inclusion, and compatibility confirmation.
- [x] Superpowers-lite harness exists for future implementation loops.
- [x] TypeScript workspace metadata exists for the planned app and packages.
- [x] Shared report schema defines metadata, environment, inventory, risk, eGovFrame checklist, and recommendations.
- [x] Future implementation can generate `report.json` from fixtures.
- [x] Future implementation can render `report.md` from `report.json`.
- [x] Future VS Code command can trigger the fixture scan flow.
- [ ] Future policy layer can classify findings as `ok`, `review`, `risky`, or `unknown`.

## Test Mapping

| Behavior | Test File Or Command | Status |
|---|---|---|
| Design docs exist | `test -f docs/feature-design.md` | DONE |
| Harness is runnable | `scripts/agent-harness.sh` | DONE |
| TypeScript workspace metadata exists | `npm run check` | DONE |
| Report schema exists | `npm run check` | DONE |
| Fixture report generation | `npm run fixture:report` | DONE |
| Markdown report rendering | `npm run report:markdown` | DONE |
| VS Code command registration | `npm run smoke` | DONE |
| Fixture scan command shell | `npm run smoke` | DONE |
| Future policy layer classification | TBD | TODO |

## Manual Review Checklist

- [x] The design does not start by claiming official eGovFrame certification.
- [x] The first feature slice can be built without touching sensitive local config.
- [x] Real machine scanning is deferred until fixtures and schema are stable.
- [x] Public-sector audit/reporting use is visible in the design.
