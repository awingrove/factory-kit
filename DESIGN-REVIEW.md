# DESIGN-REVIEW.md — the design-before-code briefing checklist

Automated guardrails catch *rule* violations (file ownership, split triggers,
claim vocabulary, test refs). They cannot make *design* judgements. When work
introduces a new slice boundary, a new component/subsystem, a schema/protocol
change, or a UI pattern not yet covered by `DESIGN.md`, the lead session
**stops at the design-before-code gate** before writing implementation code.

## When to trigger (STOP)

- A new architectural layer, component, or cross-slice dependency is needed.
- A slice boundary is ambiguous (whether work belongs in an existing slice or
  a new one, or which slice `owns` a shared resource).
- A UI change introduces or alters a visual pattern, component, or layout
  rule covered by [DESIGN.md](DESIGN.md).
- A reviewer finding conflicts with the committed brief's text.

## Pre-briefing checklist (lead session)

Every item below is verified **before** committing Step 1 (the brief + any
`DESIGN.md` amendment):

1. **Decision statement** — one sentence naming what is being decided and why
   it is not mechanical.
2. **Options considered** — at least two concrete options with the trade-off
   each imposes on complexity, slice ownership, and testability, with the
   recommended option first.
3. **Current-state facts verified against the repo (`DL-002` rule)** — every
   claim about existing files, line counts, exports, `slices.yaml` claims, or
   `storymap.yaml` tasks is checked against the working tree at briefing time,
   never recalled from memory.
4. **Guardrail dry-run per step (`DL-002` rule)** — verify that each checkbox
   step in the brief can pass the repo's commit-time/verify-time guardrails on
   its own:
   - File moves, new files, and `slices.yaml` / `storymap.yaml` updates land
     in the same step (`SLICES.md` meta-rule 7).
   - No file touched by the step approaches its role's split trigger without
     a module split pre-specified in the brief (`FACTORY.md` DoD).
   - Backticked tokens inside `- [ ]` step lines name only repo-relative file
     paths so the plan-tick checker does not mistake domain literals for
     missing files (`PLAN-FORMAT.md`).
5. **Blast radius** — which slices, modules, pages, and test suites change.
6. **Human sign-off** — present the options to the human, record the decision
   in the committed brief (`docs/plans/<feature>.md`) and `DESIGN.md` (Step 1),
   and only then dispatch the sub-agent executor cold for Step 2+.
