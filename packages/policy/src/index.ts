import type { RiskLevel, RiskSurface } from "@agent-estate/shared";

export const POLICY_CLASSIFICATION_STATUS = "rule-based-secret-safe";

export interface PolicyClassification {
  readonly status: typeof POLICY_CLASSIFICATION_STATUS;
  readonly level: RiskLevel;
  readonly ruleIds: readonly string[];
  readonly rationale: string;
  readonly secretHandling: "secret-safe";
}

export interface PolicyRiskRule {
  readonly id: string;
  readonly appliesTo: readonly ["agent" | "mcpServer" | "plugin" | "package" | "permission", ...string[]];
  readonly surfaces?: readonly RiskSurface[];
  readonly host?: "vscode" | "codex" | "openclaw" | "mcp-client" | "unknown";
  readonly level: RiskLevel;
  readonly rationale: string;
}

export const POLICY_RISK_RULES: readonly PolicyRiskRule[] = [
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
] as const;

export interface DiscoveredPolicySurface {
  readonly type: "agent" | "mcpServer" | "plugin" | "package" | "permission";
  readonly riskSurfaces?: readonly RiskSurface[];
  readonly surface?: RiskSurface;
  readonly host?: "vscode" | "codex" | "openclaw" | "mcp-client" | "unknown";
  readonly manager?: string;
}

const RISK_LEVEL_ORDER: Record<RiskLevel, number> = {
  ok: 0,
  unknown: 1,
  review: 2,
  risky: 3
};

function normalizeSurfaces(surface: DiscoveredPolicySurface): readonly RiskSurface[] {
  return surface.riskSurfaces ?? (surface.surface ? [surface.surface] : []);
}

function matchesRule(rule: PolicyRiskRule, surface: DiscoveredPolicySurface): boolean {
  if (!rule.appliesTo.includes(surface.type)) {
    return false;
  }
  if (rule.host && rule.host !== surface.host) {
    return false;
  }
  if (rule.surfaces?.length) {
    const surfaces = normalizeSurfaces(surface);
    return rule.surfaces.some((candidate) => surfaces.includes(candidate));
  }
  return true;
}

export function classifyDiscoveredSurface(surface: DiscoveredPolicySurface): PolicyClassification {
  const matchedRules = POLICY_RISK_RULES.filter((rule) => matchesRule(rule, surface));
  const fallbackRules: readonly PolicyRiskRule[] = matchedRules.length
    ? matchedRules
    : [{
        id: "unmatched-surface-unknown",
        appliesTo: [surface.type],
        level: "unknown",
        rationale: "No explicit policy rule matched this discovered surface."
      }];
  const level = fallbackRules.reduce<RiskLevel>((highest, rule) => {
    return RISK_LEVEL_ORDER[rule.level] > RISK_LEVEL_ORDER[highest] ? rule.level : highest;
  }, "ok");

  return {
    status: POLICY_CLASSIFICATION_STATUS,
    level,
    ruleIds: fallbackRules.map((rule) => rule.id),
    rationale: fallbackRules.map((rule) => rule.rationale).join(" "),
    secretHandling: "secret-safe"
  };
}
