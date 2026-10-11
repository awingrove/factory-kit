// DOCUMENTS: OpenCode's project-plugin loader scans .opencode/plugins/*.js
// only — it never loads *.mjs (verified empirically on opencode v2.0.26,
// 2026-10-11: identical .js/.mjs probe plugins in twin project dirs; only
// the .js produced a "loading plugin" line and ran its setup). This shim
// exists so sessions actually load the plugin and inject the agent
// identity env (GH_TOKEN, GH_CONFIG_DIR, GIT_* per
// docs/factory/agent-identity.md). The module of record stays
// agent-identity.mjs because CI's Node 20 imports it as ESM by extension
// (a .js with import syntax is CJS to Node without type:module). PINS:
// without this file, `gh api user` in a session resolves the *human*
// account — the exact failure TD-010 was built to prevent. Delete the
// shim when the loader learns .mjs.
export {
  default,
  AgentIdentityPlugin,
  injectAgentIdentity,
  AGENT_GIT_NAME,
  AGENT_GIT_EMAIL,
  SENTINEL_TOKEN,
  AGENT_GH_CONFIG_DIR,
} from './agent-identity.mjs';
