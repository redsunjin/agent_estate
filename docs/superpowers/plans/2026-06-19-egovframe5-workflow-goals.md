# eGovFrame 5 Workflow Goals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Agent Estate from a working read-only MVP into an eGovFrame 5.0-ready workflow pack with project detection, policy templates, and validation evidence.

**Architecture:** Keep Agent Estate local-first and secret-safe. Add eGovFrame-specific workflow files under `examples/egovframe5`, keep official version facts in docs, and extend discovery only through metadata checks that can be validated by the existing harness.

**Tech Stack:** Node.js 20+, VS Code extension manifest/source, workspace npm scripts, Markdown docs, read-only JavaScript discovery scripts.

---

## Goal Order

1. Create the eGovFrame 5.0 workflow pack.
2. Add an official baseline reference document.
3. Add eGovFrame project detection metadata.
4. Add a public-sector policy template.
5. Harden VS Code build and test readiness.
6. Prepare contribution and compatibility readiness notes.

## User-Provided Materials

The work can start without extra materials. These inputs would improve accuracy:

- A real or sanitized eGovFrame 5.0 project structure, especially `pom.xml`.
- The preferred public-sector audit report format, if one already exists.
- The intended first audience: internal SI team, open-source users, or eGovFrame contribution reviewers.
- Any organization-specific allowed or blocked AI tools, MCP servers, or package managers.
- License direction for public release.

Do not provide secrets, private config values, API keys, tokens, or full machine inventory exports.

---

### Goal 1: eGovFrame 5.0 Workflow Pack

**Purpose:** Create a concrete example showing where Agent Estate reports live inside an eGovFrame 5.0 project.

**Files:**
- Create: `examples/egovframe5/README.md`
- Create: `examples/egovframe5/agent-estate-checklist.md`
- Create: `examples/egovframe5/report-location.md`
- Modify: `docs/mvp-plan.md`
- Modify: `.agent/status.md`

- [x] **Step 1: Add workflow README**

Create `examples/egovframe5/README.md` with these sections:

```markdown
# eGovFrame 5.0 Agent Estate Workflow

This example shows how an eGovFrame 5.0 project can keep a local AI and MCP governance report alongside development artifacts.

## Flow

1. Open the project in VS Code.
2. Run `Agent Estate: Scan Environment`.
3. Review `.agent-estate/report.md`.
4. Attach or summarize the report in the project review record.
5. Re-run the scan when AI tools, MCP servers, plugins, or package managers change.

## Boundaries

- The scan is read-only.
- Secrets and config values are not collected.
- Reports stay local unless a human exports them.
- This workflow does not claim official eGovFrame certification.
```

- [x] **Step 2: Add audit checklist**

Create `examples/egovframe5/agent-estate-checklist.md` with pass/review items for project signal, read-only scan, secret exclusion, external-send review, human approval, and report export.

- [x] **Step 3: Add report location guide**

Create `examples/egovframe5/report-location.md` explaining that generated files live in `.agent-estate/report.json` and `.agent-estate/report.md`, while copied review artifacts can be stored under a project-owned review folder.

- [x] **Step 4: Validate**

Run:

```bash
scripts/agent-harness.sh
```

Expected: harness completes without unexpected failures.

---

### Goal 2: Official eGovFrame 5.0 Baseline

**Purpose:** Keep the product aligned with official eGovFrame 5.0 facts without overclaiming compatibility.

**Files:**
- Create: `docs/egovframe5-baseline.md`
- Modify: `docs/egovframe-strategy.md`
- Modify: `docs/source-report.md`

- [x] **Step 1: Add baseline document**

Create `docs/egovframe5-baseline.md` with these sections:

```markdown
# eGovFrame 5.0 Baseline

## Runtime Baseline

- JDK baseline: verify from official runtime documentation before release.
- Maven artifact group: `org.egovframe.rte`
- Runtime version target: `5.0.0`

## Development Baseline

- VS Code Initializr is a relevant reference surface.
- Eclipse-based development environment remains a separate reference surface.

## Agent Estate Scope

Agent Estate inspects local AI, MCP, plugin, package, and permission metadata. It does not certify an eGovFrame project and does not replace compatibility confirmation.
```

- [x] **Step 2: Link baseline from strategy docs**

Add one sentence in `docs/egovframe-strategy.md` pointing readers to `docs/egovframe5-baseline.md`.

- [x] **Step 3: Validate**

Run:

```bash
scripts/agent-harness.sh
```

Expected: harness completes without unexpected failures.

---

### Goal 3: eGovFrame Project Detection Metadata

**Purpose:** Improve the read-only discovery report so it can identify an eGovFrame-like workspace from metadata only.

**Files:**
- Modify: `scripts/generate-readonly-report.mjs`
- Modify: `scripts/validate-project.mjs`
- Modify: `docs/report-schema.md`
- Modify: `.agent/test-log.md`

- [x] **Step 1: Write RED validation**

Update `scripts/validate-project.mjs` to require detection tokens:

```text
egovframe-pom
org.egovframe.rte
egovframe-vscode-initializr
```

Run:

```bash
FOCUSED_TEST_CMD='npm run smoke' scripts/test-red.sh
```

Expected: fails because detection tokens are not implemented yet.

- [x] **Step 2: Implement metadata-only detection**

Extend `projectSignals()` in `scripts/generate-readonly-report.mjs` to detect:

- `pom.xml` path existence.
- `org.egovframe.rte` only if a safe fixture or intentionally readable project file is in scope.
- `.vscode` or Initializr markers when present.

Do not read secrets or external config values.

- [x] **Step 3: Confirm GREEN**

Run:

```bash
FOCUSED_TEST_CMD='npm run smoke' scripts/test-green.sh
scripts/agent-harness.sh
```

Expected: both commands pass.

---

### Goal 4: Public-Sector Policy Template

**Purpose:** Provide a reusable default policy for public-sector review without enforcing or mutating the environment.

**Files:**
- Create: `examples/egovframe5/policy-template.json`
- Create: `docs/policy-template.md`
- Modify: `scripts/validate-project.mjs`

- [x] **Step 1: Add policy template**

Create `examples/egovframe5/policy-template.json` with allowed levels and review-required surfaces:

```json
{
  "schemaVersion": "0.1",
  "name": "egovframe5-public-sector-review",
  "defaultAction": "review",
  "reviewRequiredSurfaces": [
    "shell",
    "filesystem",
    "network",
    "external_send",
    "database",
    "secrets",
    "admin_permission",
    "unknown"
  ],
  "notes": [
    "This template is advisory.",
    "It does not mutate tools or block execution.",
    "Human approval remains required for review and risky findings."
  ]
}
```

- [x] **Step 2: Document policy use**

Create `docs/policy-template.md` explaining how to review `ok`, `review`, `risky`, and `unknown` findings.

- [x] **Step 3: Validate**

Run:

```bash
scripts/agent-harness.sh
```

Expected: harness completes without unexpected failures.

---

### Goal 5: VS Code Build And Runtime Readiness

**Purpose:** Move from command source presence to a buildable extension surface.

**Files:**
- Modify: `apps/vscode-extension/package.json`
- Modify: `package.json`
- Create or modify: build/test config files only if dependency installation is approved.
- Modify: `.agent/test-log.md`

- [x] **Step 1: Decide dependency boundary**

If adding TypeScript or VS Code test dependencies requires network installation, ask for approval before running install commands.

- [x] **Step 2: Add build validation**

Add a root script such as:

```json
"build": "npm --workspace @agent-estate/vscode-extension run build"
```

Only add this after the extension package has a real build command.

- [x] **Step 3: Validate**

Run:

```bash
npm run check
npm run smoke
scripts/agent-harness.sh
```

Expected: commands pass, or dependency/network limitations are recorded in `.agent/test-log.md`.

---

### Goal 6: Contribution And Compatibility Readiness Notes

**Purpose:** Prepare public-facing language without claiming official certification.

**Files:**
- Create: `docs/contribution-readiness.md`
- Create: `docs/compatibility-readiness.md`
- Modify: `README.md`

- [x] **Step 1: Add contribution readiness note**

Create `docs/contribution-readiness.md` with these tracks:

- Open-source release readiness.
- eGovFrame sample/docs readiness.
- Possible official repository reference.
- Future contribution participation.

- [x] **Step 2: Add compatibility readiness note**

Create `docs/compatibility-readiness.md` separating:

- contribution recognition,
- official repository inclusion,
- compatibility confirmation.

Explicitly state that Agent Estate is not currently certified.

- [x] **Step 3: Validate**

Run:

```bash
scripts/agent-harness.sh
```

Expected: harness completes without unexpected failures.

---

## Completion Criteria

- `examples/egovframe5` contains usable workflow documentation.
- Official eGovFrame 5.0 facts are documented with source links.
- Read-only eGovFrame project detection is implemented or explicitly deferred.
- A public-sector review policy template exists.
- VS Code build/test readiness is either implemented or blocked only by approved dependency setup.
- Contribution and compatibility language avoids official-status overclaims.
- `scripts/agent-harness.sh` passes before final completion.
