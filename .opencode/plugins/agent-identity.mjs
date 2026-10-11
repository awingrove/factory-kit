// DOCUMENTS: agent GitHub credential seam for agent sessions — GH_TOKEN from the
// human-managed token file plus the machine git identity, injected into every
// shell an OpenCode session runs. Fail-closed sentinel and setup runbook:
// docs/factory/agent-identity.md
//
// PINS: both plugin entrypoints call the one shared injection body, so the V1
// and V2 shapes cannot drift — the lockstep test "PINS: V1 shell.env hook
// injects the identical env contract" in agent-identity.spec.js pins the
// no-drift claim by comparing the two env outputs for equality.
// OpenCode V2 plugin shape (v2.0.21): default-exported definition with an id and
// a setup(ctx); the shell-env hook is ctx.shell.hook('create.before', ...). The
// named export AgentIdentityPlugin is retained as the V1-compatible entrypoint —
// it is dead on V2 (V1 plugin functions register no hooks there) but keeps older
// OpenCode releases and any direct test import working.
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export const AGENT_GIT_NAME = 'awingrove-opencode';
export const AGENT_GIT_EMAIL = 'awingrove-opencode@users.noreply.github.com';
export const SENTINEL_TOKEN =
  '__AGENT_TOKEN_FILE_MISSING_see_docs/factory/agent-identity.md';
export const AGENT_GH_CONFIG_DIR = join(
  homedir(),
  '.config/opencode/gh-agent-config'
);

const DEFAULT_TOKEN_FILE = '.config/opencode/gh-agent-token';

export const injectAgentIdentity = (env) => {
  const tokenFile =
    process.env.AGENT_GH_TOKEN_FILE || join(homedir(), DEFAULT_TOKEN_FILE);
  let token;
  try {
    token = readFileSync(tokenFile, 'utf8').trim();
  } catch {
    token = SENTINEL_TOKEN;
    console.error(
      `agent-identity: cannot read token file "${tokenFile}"; injecting fail-closed sentinel GH_TOKEN. Fix per docs/factory/agent-identity.md.`
    );
  }
  if (!token) {
    token = SENTINEL_TOKEN;
    console.error(
      `agent-identity: token file "${tokenFile}" is empty; injecting fail-closed sentinel GH_TOKEN. Fix per docs/factory/agent-identity.md.`
    );
  }
  env.GH_TOKEN = token;
  env.GH_CONFIG_DIR = AGENT_GH_CONFIG_DIR;
  env.GIT_AUTHOR_NAME = AGENT_GIT_NAME;
  env.GIT_AUTHOR_EMAIL = AGENT_GIT_EMAIL;
  env.GIT_COMMITTER_NAME = AGENT_GIT_NAME;
  env.GIT_COMMITTER_EMAIL = AGENT_GIT_EMAIL;
};

export const AgentIdentityPlugin = async () => ({
  'shell.env': async (input, output) => {
    injectAgentIdentity(output.env);
  },
});

export default {
  id: 'agent-identity',
  setup(ctx) {
    ctx.shell.hook('create.before', (event) => {
      injectAgentIdentity(event.env);
    });
  },
};
