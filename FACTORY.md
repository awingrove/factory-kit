# FACTORY.md — the process contract

How features are built in a factory repo, and what "done" means. Code-level
rules live in each app's `AGENTS.md`; the spec formats live beside this
file; the process itself is here.

## Principles

- **Upstream first.** Requirements (story map) and design (plan /
  decision records) precede code.
- **Slices, not layers.** Each feature is a vertical unit owning its logic
  end-to-end ([SLICES.md](SLICES.md)).
- **Guardrails enforce conformance; humans own design.** Automated checks
  catch rule violations; a human confirms architecture decisions
  (boundaries, new subsystems).
- **Measure touch, not time.** Each slice records agent class, human
  interventions, guardrail failures, fix commits, and escaped defects —
  wall-clock hours are meaningless across models and sessions.
- **Lead planning vs. sub-agent execution.** At project bootstrap (or whenever
  a repo's `AGENTS.md` / `FACTORY.md` does not yet specify them), ask the human
  which model to use for the lead planning session and which model to use for
  sub-agent brief execution, and record both in the app's `AGENTS.md` and
  `FACTORY.md`. Once the design-before-code gate passes and Step 1 (the brief +
  any `DESIGN.md` amendment) is committed, the lead session dispatches a fresh
  sub-agent on the project's configured executor model to execute the remaining
  steps cold from the brief — never implementing the brief inline in the lead
  session.

## Process

1. **Claim** — confirm the feature's slice and entry points; update
   `slices.yaml` and the story map in the same change. If it needs a new
   slice boundary or a design decision, **STOP — human gate** before code.
2. **Exemplar copy** — start from the proven reference slice; change
   names, keep shape.
3. **Tracer bullet** — a green vertical stub through every layer before
   depth, so the path works from commit one.
4. **Fill** — depth: validation, edge cases, real data. Tracer stays green.
5. **Verify** — run the repo's named gate: format → build → arch checks →
   slice unit → slice e2e (click-through) → DoD below.
6. **Record** — debt register touched if a systemic gap surfaced; metrics
   recorded; plan updated.
7. **Ship** — push the branch, open the PR, report ready with green
   checks. **The human approves and merges** — server-side rulesets reject
   agent attempts to approve, merge, delete, or force-push. Closing the
   agent's own PRs is permitted.

## Human gates

Enumerated because every one of them has been skipped at least once by
some executor, somewhere:

- **Design-before-code** — new boundary, new subsystem, or a reviewer
  finding that conflicts with the plan's text. The executor surfaces
  options; the human decides.
- **PR approve + merge to main** — the human's final review. Executors
  prepare (branch, commits, PR, gate report); humans merge.
- **Findings marked plan-mandated or Important** — adjudication is the
  human's unless the finding is unambiguous mechanical compliance.

**Gate-rejection rule:** a gate that rejects the work (branch protection,
failing required check, declined push) is the system working, not an
obstacle. One rejection → fix the named cause. A second rejection of the
same gate → **stop and report to the human** — never hunt for another
route around a gate.

## Definition of Done (per slice)

- Slice owns its logic end-to-end per the manifest; manifest + story-map
  entries present, consistent, and same-change ([SLICES.md](SLICES.md)
  meta-rules green).
- One concept per file; nothing approaches the app's split trigger (300
  complete lines, counting every part) without splitting first.
- Typed contracts at boundaries — no untyped bag-of-strings view data.
- Unit tests + e2e specs green; entry-point chain arrives by click-through;
  no orphan pages ([TEST-RULES.md](TEST-RULES.md)).
- Tracer green: the cross-layer path works from the first commit; no step
  silently stubbed.
- Docs updated: rules changed → the rule doc; UI changed → DESIGN.md
  amendment raised; systemic gap → [DEBT-REGISTER.md](DEBT-REGISTER.md) in
  the same change. No CI-derivable counts pasted into prose — the command's
  own output is the source.

## Executor contract

Executors (usually AI) work from a brief ([PLAN-FORMAT.md](PLAN-FORMAT.md))
under these terms:

- The brief is the single source of truth. Execute mechanically; **the
  factory does not invent architecture, it executes it.** Judgement steps
  route through the human gates above.
- Keep gates green. Gates are **named** (each repo lists its verify
  command) — never reimplemented ad hoc at the call site.
- **NEVER** weaken a guardrail, test, threshold, or manifest entry to make
  a gate pass. Red gate = stop; fix the named cause; report on the second
  rejection of the same gate.
- Escalate early: stuck after two failed attempts at the same fix → stop
  and report. Debug artifacts are tracked and removed before commit — none
  ride along in a feature diff.
- Post-mortem & human-intervention capture: a bug fix OR an unprompted human
  intervention correcting a code or process miss (outside the scheduled human
  gates above) reveals a systemic gap — record a `DL-\d+` entry in
  [DEBT-REGISTER.md](DEBT-REGISTER.md) and update the governing rule doc in the
  same change.
- A truthful failure is worth more to this factory than a fabricated
  success. Ticks, metrics, and claims are only as good as the evidence
  behind them.
