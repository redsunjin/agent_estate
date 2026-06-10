# Test Strategy

## TDD Rule

For each behavior change:

1. Write or update a failing test first.
2. Run the focused test and confirm it fails for the expected reason.
3. Implement the smallest change that makes the test pass.
4. Run the focused test again and confirm it passes.
5. Run `scripts/agent-harness.sh`.
6. Refactor only after tests are green.

## Exceptions

Only skip TDD for docs-only changes, pure styling with no testable behavior, or projects that do not yet have a test framework. Record the reason in `.agent/test-log.md`.

## Current Phase

The project has moved into implementation slices. Behavior changes should use the RED/GREEN loop before implementation when a focused validation can cover the behavior.

Future behavior changes should start with tests for:

- fixture-to-report generation
- Markdown report rendering
- policy risk classification
- eGovFrame checklist generation
