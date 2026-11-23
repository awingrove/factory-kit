# BATCH-OPS.md — long mechanical loops run fresh; the lead consumes results

The orchestrating session's own context is a first-class consumer: every
turn re-sends its accumulated context, so running a long mechanical loop
(batch scoring, wave driving, repeated measurement runs) inside the lead
session taxes the very context that holds the plan and the judgment. The
durable pattern from the STE-brief experiment is session structure, not
environment tuning.

## The pattern

- **Fresh session, committed handoff.** Long mechanical loops run in a
  fresh session (e.g. `opencode run`) driven by a committed `STATE.md`
  handoff: the batch objective, the current state, resume instructions,
  and where results land. Chat history is not the handoff — the file is,
  the same way a brief is not chat history
  ([PLAN-FORMAT.md](PLAN-FORMAT.md)).
- **The lead stays a consumer.** The lead session does not execute the
  loop; it reads the committed RESULTS the loop produces, adjudicates,
  and dispatches the next batch. Lead context accumulates decisions, not
  loop turns.

## Shape

1. Commit `STATE.md` before dispatch — objective, current state/wave,
   resume instructions, results location.
2. Dispatch a fresh session on the handoff; it runs the loop and commits
   RESULTS (or amends `STATE.md` for the next wave).
3. The lead reads RESULTS, adjudicates, and dispatches the next batch or
   closes the work.

Scope: session structure for long mechanical loops only — environment
run-time configuration is not part of this contract.
