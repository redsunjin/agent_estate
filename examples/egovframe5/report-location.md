# Agent Estate Report Location Guide

Agent Estate writes generated scan output to the local `.agent-estate` directory.

## Generated Files

| File | Purpose | Commit Guidance |
| --- | --- | --- |
| `.agent-estate/report.json` | Machine-readable local scan report. | Do not commit by default. |
| `.agent-estate/report.md` | Human-readable review report. | Do not commit raw local output by default. |

The repository ignores `.agent-estate/` because generated reports can contain local machine paths and environment-specific metadata.

## Recommended Review Artifact

After human review, copy only the approved Markdown summary or decision record into a project-owned location selected by the team, for example:

```text
docs/reviews/agent-estate/YYYY-MM-DD-ai-tooling-review.md
```

The copied artifact should include:

- scan date,
- reviewer,
- workspace name,
- approved tools,
- blocked or deferred tools,
- unresolved review items,
- link or reference to the internal review ticket if one exists.

## Redaction Rules

Before storing or sharing a reviewed artifact:

- remove local home directory paths when they are not needed,
- remove usernames if the report will leave the team,
- do not include secrets, API keys, tokens, passwords, or private config values,
- do not include full MCP server config contents,
- do not claim official eGovFrame certification.

## Export Flow

1. Run `Agent Estate: Scan Environment`.
2. Review `.agent-estate/report.md`.
3. Resolve or record all `review`, `risky`, and `unknown` findings.
4. Copy the approved summary into the project review location.
5. Keep raw generated reports local unless the team explicitly approves sharing.
