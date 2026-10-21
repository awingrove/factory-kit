# METRICS.md — the slice metrics & intervention ledger

The factory's claim to prove: an executor, given a committed brief
([PLAN-FORMAT.md](PLAN-FORMAT.md)) and the guardrails, delivers a correct
slice or stage with **minimal human touch**. We measure touch, rework, and
session cost — not wall-clock hours, which are meaningless across models and
sessions.

One ledger per repo, conventionally `docs/factory/slice-metrics.yaml`
(VitaTrack: `docs/factory/shard-metrics.yaml`). Validated in each app's CI
by its metrics guard script.

## What we measure (per entry)

| Field | Required | Meaning |
|---|---|---|
| `id` | required | Short unique identifier for the delivered unit (e.g. `STAGE-3`, `NT`). |
| `slice` | required | Declared slice id (or list of slice ids) in `slices.yaml` that this work touched. |
| `name` | required | Human-readable title of the slice or stage. |
| `brief` | required | Repo-relative path to the committed plan file in `docs/plans/` (existence-checked). |
| `agent` | required | Executor class (`cheap` / `frontier` / `human`). |
| `human_interventions` | required | Unscheduled stops requiring the human person after the design gate: unprompted corrections, unblocks, or post-review findings found by the person. Scheduled gates (design-before-code, PR merge) do not count; unprompted corrections do (and also log a `DL-\d+` in [DEBT-REGISTER.md](DEBT-REGISTER.md)). **The headline number.** `0` = autonomous of the person after Step 1. |
| `agent_review_rounds` | required | Review/fix rounds driven by the lead/controller agent session against the sub-agent executor's work. Kept separate from `human_interventions` so controller supervision does not inflate human touch. |
| `guardrail_failures` | required | Red gate cycles (`verify` / arch / format / lint / unit / e2e failures before green). Loud failures are the guardrails working; a high count signals the brief under-specified a constraint. |
| `fix_commits` | required | Commits after the executor's first "done" claim. |
| `defects_escaped` | required | Defects found after merge (cross-referenced from `defects:` in [DEBT-REGISTER.md](DEBT-REGISTER.md)). |
| `lead_model` | optional | Exact `provider/model` of the lead planning session. |
| `agent_model` | optional | Exact `provider/model` of the sub-agent executor session(s). |
| `session_id` | optional | Sub-agent session id(s) (`ses_...`) from which token/cost telemetry was extracted. |
| `tokens_input` / `tokens_output` / `tokens_reasoning` / `tokens_cache_read` | optional | Exact token counts from the executor session export. |
| `cost_usd` | optional | Dollar spend reported by the harness for the executor session (`0` on free-tier models is a real measurement, not an omission). |
| `notes` | optional | Folded prose summary of red cycles, mechanical deviations, or review findings. |

## Extracting usage numbers (OpenCode V2)

After the sub-agent executor session completes:

```bash
opencode session export <sessionID> > /tmp/opencode/session.json
```

Read the top-level `info` block of the exported JSON (never sum per-message
token blocks, which are cumulative per turn):

- `info.model.providerID` + `/` + `info.model.id` → `agent_model`
- `info.tokens.input` → `tokens_input`
- `info.tokens.output` → `tokens_output`
- `info.tokens.reasoning` → `tokens_reasoning`
- `info.tokens.cache.read` → `tokens_cache_read`
- `info.cost` → `cost_usd`

When a brief spans multiple sub-agent dispatches, sum the top-level `info`
blocks across those child sessions and list their session IDs in
`session_id`. If a unit was executed before session exports were captured,
omit the optional token/cost fields rather than guessing — an absent field
is more honest than an estimate.

## Validator & ratchet expectations

- **Schema & reference check:** CI fails on missing required fields,
  duplicate `id`, unknown `agent` class, negative or non-integer counters, a
  `slice` id not declared in `slices.yaml`, or a `brief` path that does not
  exist on disk.
- **Warn-until-three, hard afterward:** after three entries, shipping a
  committed brief without its ledger entry fails the gate, and
  `human_interventions` above the ratchet target (start: **≤ 1 per brief**)
  is review material.

Worked stub: [examples/slice-metrics.yaml](examples/slice-metrics.yaml).
