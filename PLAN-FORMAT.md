# PLAN-FORMAT.md — briefs and plans

A **brief** is the unit an executor works from. Its file is the single
source of truth for the work; chat history is not.

## When a plan exists

Feature work beyond ~3 tasks gets a committed plan at
`docs/plans/<feature>.md`, created before code. Smaller work may live in
the PR description — but anything that must survive a session boundary is a
plan file.

## Shape

```
# <feature> plan
**For agentic workers:** <any required spec/skill that travels with this
plan — executors read both; the spec is binding on every task below.>

## Hard rules        (only what this feature forbids; link out, don't restate)
## Steps             (checkbox tasks, below)
```

## Checkbox tasks

- Syntax: `- [ ] **Step N: imperative, file-specific action**`. Steps are
  numbered, name their files, and each ends in a commit or a named verify
  command. A step can be skipped *visibly* (left unticked with a reason);
  a paragraph of prose can be missed silently — so the tracking lives in
  steps, not prose.
- A tick (`- [x]`) means the step's commit exists on the branch. Ticking
  ahead of the commit is a plan defect; the plan-tick checker requires
  every tick's claim to be evidenced in the diff.
- **Backticked tokens in step lines:** inside `- [ ]` / `- [x]` checkbox
  lines, reserve backticks for repo-relative file paths (or shell commands
  containing spaces). Do not wrap dotted domain literals (such as mini-IP
  addresses `10.20` or version numbers `1.2`) in backticks inside a step
  line, or the plan-tick checker will treat them as missing file paths.
- Sub-steps get their own checkboxes; never bury two verifiable actions in
  one step.

## Boundary contracts and counter-examples

A boundary contract that conditions on input — routing tables, narrative
machines, component responses, geometry families — is specified by its
branch conditions, not its happy path. Every such contract names at least
one **counter-example** the mechanism must treat differently ("a GET trace
keeps the Stage 4 story — no async 202"), and the brief's test list pins
that counter-example by name. A contract written only as the happy-case
script is a brief defect: the executor implements exactly what is written,
and the un-named branches are fabricated (or absent) versions of whatever
the happy case said.

## Cold-resume & sub-agent dispatch contract

Session context lives in the plan file, not in chat history. Once the human
design gate passes and Step 1 (the brief + any `DESIGN.md` amendment) is
committed, the lead session spawns a fresh sub-agent on the project's
configured executor model (asked of the human at bootstrap and recorded in
the app's `AGENTS.md` / `FACTORY.md`) to execute the remaining steps cold
from the brief. On resume — of a sub-agent, a new session, a new model, or a
different executor — read the plan and its Step-0 references first, then
continue from the first unticked step.
Updating the plan (ticks, newly discovered steps, decided questions) happens
in the same change that advances the work. If the plan's text conflicts
with a reviewer finding or a fresh recollection of the code, the plan loses
only by human adjudication (see [FACTORY.md](FACTORY.md) human gates) —
executors do not silently reinterpret the brief.

## Status precedence

Where plan status is summarized (dashboards, reports): explicit status >
whole-plan progress > checkbox counts. Positive whole-word completion
values are `done`, `complete`, `completed`, `shipped`; negated forms do not
complete a plan. Fenced or indented examples are never metadata.
