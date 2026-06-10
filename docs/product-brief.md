# Product Brief

## One-Line Definition

Agent Estate is a VS Code extension and local collector for inventorying, reviewing, and reporting AI agent, MCP, plugin, and permission state in developer environments.

## Target Users

- Public-sector SI developers using eGovFrame 5.0
- Team leads responsible for AI coding tool adoption
- Security/review staff who need visibility into local developer tooling
- OpenClaw-style multi-agent operators who need a local control-plane inventory

## Problem

Modern developer machines may run many AI-assisted tools at once: Codex, Claude Code, Cursor, Copilot, OpenCode, Gemini CLI, OpenClaw, MCP servers, browser automation tools, shell tools, local plugins, and observability tools.

Each tool has its own config, permissions, package source, and update state. Without an inventory layer, a team cannot easily know what is installed, what has access to sensitive surfaces, and what should be disabled or updated.

## Proposed Product

The initial product is a VS Code-first governance extension with a local collector.

It should:

- Scan installed AI agents, MCP servers, plugins, and relevant CLI tools.
- Detect package sources such as brew, npm, pipx, uv, Docker, and local Git checkouts.
- Map risky capability surfaces: filesystem, shell, GitHub, database, browser, external send, and admin-level local permissions.
- Generate JSON and Markdown reports for review.
- Provide an eGovFrame 5.0-oriented policy template and audit checklist.
- Later show the result inside a VS Code panel.

## Positioning

Use this framing:

`AI coding tool governance for public-sector development environments`

Avoid this framing:

- Generic plugin list
- Spyware-like monitoring
- Full endpoint security replacement
- eGovFrame official product before any official process exists

## Success Signal

The first useful version should let a developer run a scan and answer:

- Which AI/MCP tools are present?
- Which configs did the scan find?
- Which tools have high-risk capability access?
- Which items are likely stale, duplicated, or unmanaged?
- What can be exported for project review?

