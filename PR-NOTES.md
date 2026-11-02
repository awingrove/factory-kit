# PR-NOTES.md — the decision half is the PR body; the record goes below

A PR body is the merge-reviewer's working surface, not the audit trail.
Factory runs produce dense artifacts (briefs, reports, ledgers); the PR
body must convert them into a review a human can *execute* — where to
start, what to judge, where risk concentrates — in minutes, with the full
record one click away. Two audiences, two halves:

1. **Decision half (always top, never collapsed):** what changes, where to
   look, what to decide, where risk lives.
2. **Record half (`<details>` collapsed):** the process artifacts, ids,
   telemetry, and tooling-specific detail a future audit reconstructs.

## The rule

Every PR body opened by a factory run (slice PR, report PR, kit PR) carries
the sections below, in order. Sections marked optional may be `none`, but
must be present and say so — *the absence of a decision item is information,
not noise to trim*.

```markdown
### TL;DR
≤3 sentences. Merged-or-not verdict, headline numbers, the one theme
or risk worth remembering. No ids, no model names.

### Review path (with time cost)
3–5 ordered pointers, each `path/file` + what to look at + a time
estimate ("5 minutes" / "if you read only one file"). The first pointer
is the file a reviewer reads; pointers rank honestly or don't count.

### Decisions needed
Enumerated list of choices requested from the reviewer (sign-offs,
re-scopes, register contests). If none: a literal "None — mergeable on
review." A PR that needs a decision hidden in prose is a defect.

### Risk map
Top ≤3 areas of concentrated risk in THIS change: area, why, where
(file or report pointer). For findings-class PRs, link each to its
register row (TD/DL) or report section. Include a minimal repro if the
top risk is a live defect (a command beats a quote).

### Verification
Named-gate result (`npm run verify` green, per-repo contract) and any
setup caveat. No substitute gates; the verb is "green", not "passing".

<details><summary><b>Record</b> — pipeline detail, ids, telemetry</summary>
The audit trail: artifact inventories, finding ids with one-line plain-
English anchors, register cross-refs, telemetry sums, model/workflow
notes. Density is welcome here. Finding ids must not appear above with
heavy meaning — ids are appendix anchors, not prose.
</details>
```

## Requirements and anti-patterns

1. **State process-rule changes explicitly.** Any edit to the PR's own
   repo contract (naming/AGENTS, kit docs, guard scripts, register
   schemas) is named in *Decisions needed*, never left to be discovered
   in the diff: an AGENTS/kit edit is invisible by construction.
2. **Every id gets a one-line plain-English anchor** at first use or in
   the record block. A body that requires the glossary to have read
   anything is unreviewable.
3. **The 5-minute path is honest:** the summed time of the listed
   pointers must actually fit its promise. Sum the files, compress the
   list until it holds — the promise is testable, which is what makes it
   truthful.
4. **Anti-patterns:** equal-weight artifact inventories without an entry
   ramp; headline findings stated only by id; decisions embedded in
   prose bullets; gate summaries without the named gate; repros cited
   from an artifact instead of inlined; risk described as "everything".

## Mechanical shape (enforcement hook for app repos)

App repos that want a guard can implement it as prose-checkable lints:
PR template with the section skeleton; presence-check of "Decisions
needed" and "Risk map" (a PR description that lacks them fails review
checklist, not merge); link-validate the pointers (`Review path` files
exist); kit leaves enforcement local — the rule above is the canonical
shape and the checklist language, not a shared script (no shared code,
see FACTORY.md Coupling).

One CI-specific trap when the shape check runs as a workflow step
(observed in stack-orrery, 2026-11-02): a PR body edited *after* the
workflow ran does not re-trigger CI under the default `pull_request`
types — the check then judges a stale event snapshot and blocks a merge
on a body that is actually fine. Include `edited` in the workflow's
`pull_request` types (`[opened, synchronize, reopened, edited]`) so a
body edit re-runs the check against the live body; a workflow-rerun
alone replays the original payload and would re-fail on the same stale
snapshot.
