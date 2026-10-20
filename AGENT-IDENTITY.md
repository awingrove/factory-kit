# AGENT-IDENTITY.md — GitHub identity isolation for agent sessions

Runbook for setup, verification, rotation, and per-repo onboarding of the
dedicated machine GitHub account used by agent sessions. GitHub-side steps
(account creation, PAT issuance, repository rulesets) are executed by the
human in a browser — agents never run with human credentials.

## Architecture

1. **Machine account:** Agent sessions authenticate to GitHub as a dedicated
   machine account (e.g. `<human>-opencode`), never the human's personal
   account.
2. **Per-shell credential injection:** `.opencode/plugins/agent-identity.js`
   (OpenCode V2 plugin shape: default export hooking `ctx.shell.hook('create.before')`)
   reads the machine PAT from `~/.config/opencode/gh-agent-token` on every
   shell creation and injects:
   - `GH_TOKEN` (the machine PAT)
   - `GH_CONFIG_DIR` (an isolated directory so `gh` never reads the human's
     `~/.config/gh`)
   - `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`,
     `GIT_COMMITTER_EMAIL`
3. **Fail-closed sentinel:** When `~/.config/opencode/gh-agent-token` is
   missing, unreadable, or empty, the plugin sets `GH_TOKEN` to a
   fail-closed sentinel string (`__AGENT_TOKEN_FILE_MISSING_...`) and logs to
   stderr so `git push` / `gh` fail loudly with `401` rather than falling
   through to the human's keyring.
4. **Plugin filename (`DL-007`):** The file in `.opencode/plugins/` **must end
   in `.js`, never `.mjs`** — OpenCode's project-plugin loader scans `*.js`
   only and silently ignores `*.mjs`.
5. **Server-side enforcement:** GitHub repository rulesets (with bypass
   granted to the human account only) mechanically reject agent attempts to
   push to `main`, approve PRs, merge PRs without independent human approval,
   force-push, or delete branches.

## One-time machine setup (human)

1. **Create machine account** on GitHub with 2FA enabled.
2. **Issue a classic PAT** from the machine account with **`repo`** and
   **`workflow`** scopes only (no `admin:*`, no `delete_repo`). Classic PATs
   are used because fine-grained PATs cannot write to repositories where the
   account is an outside collaborator.
3. **Write token file:** save the PAT to `~/.config/opencode/gh-agent-token`
   (outside any repository) with mode `chmod 600`.
4. **Harness permission backstop:** in `~/.config/opencode/opencode.json`,
   deny `gh auth token`, `gh auth login`, `gh auth refresh`,
   `git credential fill|approve|reject`, and `secret-tool` so agent shells
   cannot read the OS keyring.

## Per-repo onboarding checklist (human)

1. Copy `.opencode/plugins/agent-identity.js` into the repo (and ensure the
   remote `origin` URL uses `https://`, never `git@github.com:` SSH which
   would authenticate via the human's SSH key).
2. Invite the machine account as a **write collaborator** on the repo and
   accept the invitation from the machine account.
3. Configure repository **Rulesets** (Settings → Rules → Rulesets,
   Enforcement: **Active**, Bypass list: **human account only**):
   - **`human-gates-main`** (target `main`): require PR before merging,
     require ≥ 1 approval, dismiss stale approvals on push, require approval
     from someone other than the last pusher, block force pushes, block
     deletions.
   - **`agent-cannot-touch-anything`** (target `*` all branches): block
     deletions, block force pushes.
   - **`build-must-pass`** (target `main`): require status check `build` to
     pass (strict / up-to-date before merge).

## Verification

```bash
GH_TOKEN="$(cat ~/.config/opencode/gh-agent-token)" gh api user --jq .login
```

- Must print the machine account login.
- From an agent shell, pushing a feature branch and opening a PR succeeds;
  merging to `main`, approving a PR, force-pushing, or deleting a branch
  returns `4xx` from GitHub.
