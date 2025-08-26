export interface PluginManifest {
  /** Unique plugin name */
  name: string;
  /** Semantic version */
  version: string;
  /** Entry point file */
  entry: string;
  /** Capabilities exposed by this plugin */
  capabilities: string[];
  /** Optional policy file references */
  policies?: string[];
  /** Optional human readable description */
  description?: string;
}
