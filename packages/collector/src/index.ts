export interface CollectorPlaceholder {
  readonly implementedInSlice: 6;
}

export const FIXTURE_COLLECTOR_STATUS = "fixture-supported";

export const READ_ONLY_DISCOVERY_STATUS = "read-only-discovery";

export const READ_ONLY_DISCOVERY_SURFACES = [
  "workspace-settings",
  "openclaw-config",
  "mcp-client-config",
  "agent-cli-path",
  "package-manager-path"
] as const;
