# eGovFrame 5.0 Agent Estate Workflow

This example shows how an eGovFrame 5.0 project can keep a local AI and MCP governance report alongside development artifacts.

## Flow

1. Open the eGovFrame 5.0 project in VS Code.
2. Run `Agent Estate: Scan Environment`.
3. Review `.agent-estate/report.md`.
4. Check every `review`, `risky`, and `unknown` item before approving AI tool usage.
5. Attach, copy, or summarize the reviewed report in the project's review record.
6. Re-run the scan when AI tools, MCP servers, plugins, package managers, or workspace settings change.

## Suggested Project Record

Keep the working scan output local:

- `.agent-estate/report.json`
- `.agent-estate/report.md`

When a human review is complete, copy the Markdown summary into a project-owned review location selected by the team. Do not commit local machine paths, secrets, tokens, or private configuration values.

## Boundaries

- The scan is read-only.
- Secrets and config values are not collected.
- Reports stay local unless a human exports or copies them.
- Agent Estate does not mutate, disable, or remove tools.
- This workflow does not claim official eGovFrame certification.

## Review Focus

Use the report to answer:

- Which AI coding tools are present?
- Which MCP client config surfaces are present?
- Which plugin or runtime surfaces need human review?
- Which package managers or local tools are part of the development environment?
- Which findings must be approved before a public-sector project records AI tool usage?

## When To Re-run

Re-run `Agent Estate: Scan Environment` after:

- installing or removing AI coding tools,
- changing MCP client configuration,
- adding agent plugins or skills,
- changing package manager setup,
- preparing a public-sector review artifact,
- moving from internal MVP use to external open-source release preparation.
