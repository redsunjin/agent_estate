export const RISK_LEVELS = ["ok", "review", "risky", "unknown"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_SURFACES = [
  "filesystem",
  "shell",
  "github",
  "database",
  "browser",
  "external_send",
  "network",
  "admin_permission",
  "secrets",
  "unknown"
] as const;

export type RiskSurface = (typeof RISK_SURFACES)[number];

export const EGOVFRAME_CHECKLIST_ITEM_IDS = [
  "project-signal",
  "read-only-scan",
  "secret-redaction",
  "external-send-review",
  "human-approval-path",
  "audit-report-export"
] as const;

export type EgovFrameChecklistItemId = (typeof EGOVFRAME_CHECKLIST_ITEM_IDS)[number];

export interface AgentEstateReport {
  readonly schemaVersion: "0.1";
  readonly metadata: ReportMetadata;
  readonly environment: EnvironmentSummary;
  readonly agents: readonly AgentFinding[];
  readonly mcpServers: readonly McpServerFinding[];
  readonly plugins: readonly PluginFinding[];
  readonly packages: readonly PackageFinding[];
  readonly permissions: readonly PermissionFinding[];
  readonly riskFindings: readonly RiskFinding[];
  readonly egovFrameChecklist: readonly EgovFrameChecklistItem[];
  readonly recommendations: readonly Recommendation[];
  readonly policyClassificationSummary?: PolicyClassificationSummary;
}

export interface ReportMetadata {
  readonly reportId: string;
  readonly generatedAt: string;
  readonly generator: "agent-estate";
  readonly generatorVersion: string;
  readonly workspaceRoot?: string;
  readonly source: "fixture" | "read-only-discovery";
}

export interface EnvironmentSummary {
  readonly platform:
    | "aix"
    | "darwin"
    | "freebsd"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32"
    | "unknown";
  readonly homeDirectory?: string;
  readonly workspaceType: "egovframe" | "general" | "unknown";
  readonly detectedProjectSignals: readonly ProjectSignal[];
}

export interface ProjectSignal {
  readonly kind: "pom.xml" | "egovframe-dependency" | "template-marker" | "workspace-config" | "unknown";
  readonly label: string;
  readonly path?: string;
  readonly evidence?: string;
}

export interface AgentFinding {
  readonly id: string;
  readonly name: string;
  readonly kind: "cli" | "ide-extension" | "local-agent" | "hosted-agent" | "unknown";
  readonly version?: string;
  readonly executablePath?: string;
  readonly configPaths: readonly string[];
  readonly riskLevel: RiskLevel;
  readonly riskSurfaces: readonly RiskSurface[];
  readonly evidence: readonly EvidenceItem[];
  readonly policyClassification?: FindingPolicyClassification;
}

export interface McpServerFinding {
  readonly id: string;
  readonly name: string;
  readonly transport: "stdio" | "http" | "sse" | "unknown";
  readonly command?: string;
  readonly url?: string;
  readonly configPath?: string;
  readonly declaredTools: readonly string[];
  readonly riskLevel: RiskLevel;
  readonly riskSurfaces: readonly RiskSurface[];
  readonly evidence: readonly EvidenceItem[];
  readonly policyClassification?: FindingPolicyClassification;
}

export interface PluginFinding {
  readonly id: string;
  readonly name: string;
  readonly host: "vscode" | "codex" | "openclaw" | "mcp-client" | "unknown";
  readonly version?: string;
  readonly path?: string;
  readonly riskLevel: RiskLevel;
  readonly evidence: readonly EvidenceItem[];
  readonly policyClassification?: FindingPolicyClassification;
}

export interface PackageFinding {
  readonly id: string;
  readonly name: string;
  readonly manager: "npm" | "pnpm" | "yarn" | "pip" | "uv" | "brew" | "unknown";
  readonly version?: string;
  readonly path?: string;
  readonly relatedToAgentTooling: boolean;
  readonly riskLevel: RiskLevel;
  readonly evidence: readonly EvidenceItem[];
  readonly policyClassification?: FindingPolicyClassification;
}

export interface PermissionFinding {
  readonly id: string;
  readonly surface: RiskSurface;
  readonly subject: string;
  readonly level: RiskLevel;
  readonly description: string;
  readonly evidence: readonly EvidenceItem[];
}

export interface RiskFinding {
  readonly id: string;
  readonly level: RiskLevel;
  readonly surfaces: readonly RiskSurface[];
  readonly title: string;
  readonly summary: string;
  readonly relatedFindingIds: readonly string[];
  readonly evidence: readonly EvidenceItem[];
}

export interface EgovFrameChecklistItem {
  readonly id: EgovFrameChecklistItemId;
  readonly label: string;
  readonly status: "pass" | "review" | "fail" | "not_applicable" | "unknown";
  readonly evidence: readonly EvidenceItem[];
}

export interface Recommendation {
  readonly id: string;
  readonly priority: "low" | "medium" | "high";
  readonly title: string;
  readonly rationale: string;
  readonly action: string;
  readonly relatedRiskFindingIds: readonly string[];
}

export interface FindingPolicyClassification {
  readonly status: string;
  readonly level: RiskLevel;
  readonly ruleIds: readonly string[];
  readonly rationale: string;
  readonly secretHandling: "secret-safe";
}

export interface PolicyClassificationSummary {
  readonly status: string;
  readonly totalFindings: number;
  readonly byLevel: Record<RiskLevel, number>;
}

export interface EvidenceItem {
  readonly kind: "file" | "command" | "config" | "fixture" | "manual-note";
  readonly label: string;
  readonly path?: string;
  readonly excerpt?: string;
  readonly redacted: boolean;
}
