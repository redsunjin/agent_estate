# Brainstorm

## Goal

Design Agent Estate MVP feature development for a VS Code-first AI agent and MCP governance extension

## Candidate Approaches

- Start with real machine scanning.
- Start with a fixture-based report model and renderer.
- Start with a VS Code command shell only.
- Start with an eGovFrame contribution proposal.

## Selected Approach

- Start with a fixture-based report model and renderer, then connect it to a VS Code command shell.
- Defer real machine scanning until the schema, report format, and safety rules are stable.
- Defer eGovFrame contribution until the tool has a working MVP.

## Product Question

How can Agent Estate become useful before real enforcement or official eGovFrame participation?

## Strongest Starting Point

Start with visibility, not control.

The first useful version should answer what exists in the development environment and which items deserve review. This is valuable even before the project can disable tools, enforce policies, or integrate with official public-sector processes.

## Design Decisions

- Build a VS Code-first product surface.
- Use a local collector as the core engine.
- Treat eGovFrame 5.0 as a supported workflow first.
- Keep official eGovFrame contribution for later, after MVP evidence.
- Use fixtures before reading sensitive local paths.
- Generate reports that a human can attach to project review documents.

## Risks

- Too much endpoint-security scope too early.
- Accidental secret exposure during config scanning.
- Overclaiming official eGovFrame status.
- Building a generic plugin list instead of governance-grade reporting.
- Adding enforcement before inventory is trusted.

## Naming

Root project: `agent-estate`

Possible package/product labels:

- `Agent Estate`
- `Agent Estate for VS Code`
- `Agent Estate eGovFrame Starter`
