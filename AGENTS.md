<!-- project-harness-runner:start -->
## Project Harness Runner

Work autonomously toward the requested goal.

Current default goal:
- Design Agent Estate MVP feature development for a VS Code-first AI agent and MCP governance extension

Selected method:
- superpowers-lite

Proceed without asking for ordinary local work:
- reading files
- editing normal project files
- adding focused tests
- running local tests, lint, build, typecheck, and smoke checks
- starting local dev servers for verification
- updating local docs, status, and worklog files

Ask before:
- destructive deletes or resets
- database migrations that alter real data
- credential or secret changes
- paid API usage
- external dependency installation requiring network approval
- git push, merge, tag, release, or deployment
- broad architecture changes not implied by the goal
- continuing when requirements are ambiguous enough to risk building the wrong thing

Preferred validation command:
- `scripts/agent-harness.sh`


TDD policy:
- For behavior changes, write or update the failing test before implementation.
- Confirm RED by running `scripts/test-red.sh` with `FOCUSED_TEST_CMD` when a focused command is known.
- Implement the smallest useful change.
- Confirm GREEN with `scripts/test-green.sh`.
- Run `scripts/agent-harness.sh` before claiming completion.
- If TDD cannot be applied, record the reason in `.agent/test-log.md`.

Final response must include changed files, validation commands, failed or skipped checks, and residual risks.
<!-- project-harness-runner:end -->
