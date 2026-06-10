# Report Schema

## Purpose

`packages/shared/src/report.ts` defines the MVP report contract used by the fixture collector, Markdown renderer, policy package, and VS Code extension.

The schema is local-first and audit-oriented. It records evidence paths and summaries, but it must not collect or store secrets.

## Top-Level Report

`AgentEstateReport` contains:

- metadata
- environment summary
- detected agent tools
- detected MCP servers
- detected plugins
- detected packages
- permission findings
- risk findings
- eGovFrame checklist items
- recommendations

## Risk Levels

Initial risk levels are:

- `ok`
- `review`
- `risky`
- `unknown`

## Risk Surfaces

Initial risk surfaces are:

- `filesystem`
- `shell`
- `github`
- `database`
- `browser`
- `external_send`
- `network`
- `admin_permission`
- `secrets`
- `unknown`

## eGovFrame Checklist

The first checklist IDs are:

- `project-signal`
- `read-only-scan`
- `secret-redaction`
- `external-send-review`
- `human-approval-path`
- `audit-report-export`

## Next Use

Slice 3 should read fixture data, normalize it into `AgentEstateReport`, and write `.agent-estate/report.json`.
