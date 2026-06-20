# Agent Estate eGovFrame 5.0 Review Checklist

Use this checklist after generating `.agent-estate/report.md`.

## Required Review

| Item | Expected Status | Reviewer Action |
| --- | --- | --- |
| Project signal | pass or review | Confirm whether the workspace is an eGovFrame 5.0 project or a general workspace. |
| Read-only scan boundary | pass | Confirm the scan did not mutate project files or tool configuration. |
| Secret exclusion | pass | Confirm no secrets, tokens, passwords, or private config values are included. |
| External-send surfaces | review | Confirm tools that can send data externally have explicit human approval. |
| Shell and filesystem surfaces | review | Confirm AI agents with shell or filesystem access are approved for the workspace. |
| MCP client config surfaces | review | Confirm MCP servers and their tool behavior are reviewed before use. |
| Risky findings | none or escalated | Block or escalate before approving use. |
| Unknown findings | none or classified | Classify before approval. |
| Report export | pass or review | Confirm where the reviewed Markdown summary will be stored. |

## Approval Notes

Record:

- report generation date,
- reviewer name or team,
- project or workspace name,
- approved tools,
- blocked or deferred tools,
- follow-up actions.

Do not record private credentials, API keys, tokens, or secret config values.

## Decision States

- `pass`: acceptable evidence exists.
- `review`: human review is required before approval.
- `risky`: block or escalate before approval.
- `unknown`: classify before approval.

## Minimum Completion

Before treating the report as reviewed:

1. Every `risky` finding is escalated or blocked.
2. Every `unknown` finding is classified or deferred.
3. Every `review` finding has a named approval decision.
4. The final Markdown report or summary is stored in a project-owned review location.
5. The review record avoids official eGovFrame certification claims.
