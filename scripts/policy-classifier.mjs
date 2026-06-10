export const POLICY_CLASSIFICATION_STATUS = "rule-based-secret-safe";

export const RISK_LEVEL_ORDER = {
  ok: 0,
  unknown: 1,
  review: 2,
  risky: 3
};

export const POLICY_RISK_RULES = [
  {
    id: "package-manager-path-ok",
    appliesTo: ["package"],
    level: "ok",
    rationale: "Package manager executable path metadata is acceptable when captured without version probing or config reads."
  },
  {
    id: "agent-cli-shell-filesystem-review",
    appliesTo: ["agent"],
    surfaces: ["shell", "filesystem"],
    level: "review",
    rationale: "Agent CLIs can execute shell commands or read files, so they require human review before approval."
  },
  {
    id: "mcp-client-config-review",
    appliesTo: ["mcpServer"],
    surfaces: ["unknown"],
    level: "review",
    rationale: "MCP client config paths are sensitive control surfaces until their tool behavior is reviewed."
  },
  {
    id: "openclaw-config-review",
    appliesTo: ["plugin"],
    host: "openclaw",
    level: "review",
    rationale: "OpenClaw runtime and plugin surfaces can affect agent routing, so they require review."
  },
  {
    id: "secret-surface-risky",
    appliesTo: ["agent", "mcpServer", "plugin", "package", "permission"],
    surfaces: ["secrets"],
    level: "risky",
    rationale: "Any discovered secret surface is risky unless redacted and explicitly approved."
  },
  {
    id: "unknown-surface-unknown",
    appliesTo: ["agent", "mcpServer", "plugin", "package", "permission"],
    surfaces: ["unknown"],
    level: "unknown",
    rationale: "Unknown behavior remains unknown until a later read-only collector can classify it."
  }
];

function normalizeSurfaces(item) {
  return item.riskSurfaces ?? (item.surface ? [item.surface] : []);
}

function ruleMatches(rule, item) {
  if (!rule.appliesTo.includes(item.type)) {
    return false;
  }
  if (rule.host && rule.host !== item.host) {
    return false;
  }
  if (rule.manager && rule.manager !== item.manager) {
    return false;
  }
  if (rule.surfaces?.length) {
    const surfaces = normalizeSurfaces(item);
    return rule.surfaces.some((surface) => surfaces.includes(surface));
  }
  return true;
}

function highestRiskLevel(rules) {
  return rules.reduce((highest, rule) => {
    return RISK_LEVEL_ORDER[rule.level] > RISK_LEVEL_ORDER[highest] ? rule.level : highest;
  }, "ok");
}

export function classifyDiscoveredSurface(item) {
  const matchedRules = POLICY_RISK_RULES.filter((rule) => ruleMatches(rule, item));
  const fallbackRules = matchedRules.length
    ? matchedRules
    : [{
        id: "unmatched-surface-unknown",
        level: "unknown",
        rationale: "No explicit policy rule matched this discovered surface."
      }];

  return {
    status: POLICY_CLASSIFICATION_STATUS,
    level: highestRiskLevel(fallbackRules),
    ruleIds: fallbackRules.map((rule) => rule.id),
    rationale: fallbackRules.map((rule) => rule.rationale).join(" "),
    secretHandling: "secret-safe"
  };
}

export function policyEvidence(classification) {
  return {
    kind: "manual-note",
    label: `Policy classification: ${classification.level} via ${classification.ruleIds.join(", ")}`,
    redacted: true
  };
}

export function policyClassificationSummary(report) {
  const findings = [
    ...(report.agents ?? []),
    ...(report.mcpServers ?? []),
    ...(report.plugins ?? []),
    ...(report.packages ?? [])
  ];

  const byLevel = { ok: 0, review: 0, risky: 0, unknown: 0 };
  for (const finding of findings) {
    byLevel[finding.riskLevel] = (byLevel[finding.riskLevel] ?? 0) + 1;
  }

  return {
    status: POLICY_CLASSIFICATION_STATUS,
    totalFindings: findings.length,
    byLevel
  };
}
