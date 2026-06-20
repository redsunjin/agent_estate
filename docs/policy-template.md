# Public-Sector Policy Template

`examples/egovframe5/policy-template.json` is the first Agent Estate review template for eGovFrame 5.0 and public-sector development environments.

The template is advisory. It does not mutate local tools, block commands, disable MCP servers, upload reports, or certify eGovFrame compatibility.

## Default Review Model

The template sets:

- `defaultAction`: `review`
- `reviewRequiredSurfaces`: shell, filesystem, network, external_send, database, secrets, admin_permission, unknown

This means a human reviewer should inspect relevant findings before approving AI tool usage in a public-sector workspace.

## Finding Levels

| Level | Meaning | Reviewer Action |
| --- | --- | --- |
| `ok` | Expected low-risk metadata. | Record as accepted if the source is understood. |
| `review` | Human review required. | Approve, reject, or defer with a named decision. |
| `risky` | High-impact surface. | Block or escalate before use. |
| `unknown` | Behavior is not classified. | Classify before approval or defer. |

## Review Surfaces

| Surface | Why It Requires Review |
| --- | --- |
| `shell` | AI tools may execute local commands. |
| `filesystem` | AI tools may read or write workspace files. |
| `network` | Tools may contact external services. |
| `external_send` | Tools may send content to chat, issue, email, or messaging surfaces. |
| `database` | Tools may read or modify structured project data. |
| `secrets` | Secret exposure must be blocked or escalated. |
| `admin_permission` | Privileged access changes the risk boundary. |
| `unknown` | Unclassified behavior is not approval-ready. |

## Minimum Approval Record

For each reviewed report, record:

- report date,
- workspace or project name,
- reviewer or review team,
- approved findings,
- rejected or blocked findings,
- deferred findings,
- follow-up owner.

Do not record API keys, tokens, passwords, private MCP config values, or raw secret-bearing configuration.

## Use With Agent Estate Reports

1. Run `Agent Estate: Scan Environment`.
2. Open `.agent-estate/report.md`.
3. Review the `Risk Summary` and `Review Queue` first.
4. Apply the policy template to each `review`, `risky`, and `unknown` finding.
5. Copy only the approved review summary into the project-owned review record.

## Boundaries

This template does not provide:

- official eGovFrame certification,
- compatibility confirmation,
- endpoint security,
- automatic compliance,
- runtime enforcement.
