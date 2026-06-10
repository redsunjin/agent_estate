# Definition Of Done

## Goal

Design Agent Estate MVP feature development for a VS Code-first AI agent and MCP governance extension

## Method

superpowers-lite

## Required Local Validation

- `npm run check`
- `npm run smoke`
- `scripts/agent-harness.sh`

## Smoke Validation

- `npm run smoke`

## Completion Criteria

- Implementation slices should preserve the read-only and secret-safe MVP boundary.
- The project harness is bootstrapped with Superpowers-lite.
- The first feature slice is documented.
- Acceptance tests for the design phase are documented.
- Future implementation slices are defined in order.
- `scripts/agent-harness.sh` runs without unexpected failures, or skipped checks are explicitly reported.
- Core user flow is verified at design level by manual review.
- Worklog and status reflect the latest state.
- Final response includes changed files, validation results, and remaining risks.

## Detection Notes

- Deterministic project commands are now available through npm scripts and the project harness.
- Method explicitly selected: superpowers-lite.
