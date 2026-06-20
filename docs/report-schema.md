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

## Project Signals

Read-only discovery can record eGovFrame 5.0 workspace signals without storing configuration contents:

- `egovframe-pom`: a `pom.xml` path exists and can be checked as a Maven project candidate.
- `egovframe-dependency`: an intentionally readable project POM contains the literal `org.egovframe.rte`.
- `egovframe-vscode-initializr`: a VS Code workspace marker or extension recommendation indicates eGovFrame VS Code Initializr usage.

Only `egovframe-dependency` and `egovframe-vscode-initializr` are strong enough to classify `environment.workspaceType` as `egovframe`. A plain `egovframe-pom` signal remains a review candidate.

## Next Use

Read-only discovery should write `.agent-estate/report.json`, preserve secret-safe evidence, and avoid storing raw `pom.xml` or VS Code config contents.
