# FULL-REVIEW.md — the factory runs periodic deep reviews of its own output

The factory's gates verify every slice as it lands. What no per-slice gate
can see is what slices do to each other: cross-slice duplication, drift
between hand-written narrative surfaces and the mechanisms they describe,
defects born from a shared brief-contract gap, files living at their gates,
and the process's own ledgers silently diverging from practice. The factory
therefore periodically runs a **full review** — a deliberate, batched,
stronger-model audit of the whole repo plus its process — and registers the
findings the same way it registers escaped defects.

The review is a factory run like any other: it is planned, executed by
sub-agents, evidence-pinned, and human-merged. It is **more** expensive per
task, not less, so it earns its own rule.

## When (the trigger — prompts the human, never auto-fires)

A full review is due when **either**:

1. **Calendar trigger:** the first slice-signoff opportunity of a month —
   provider quota resets and stronger models are typically plentiful at
   month start, which suits a sweep. The start-of-month prompting lives with
   the human's slice/design gate: at the first merge of a month the lead
   session asks the human whether to run the review or defer it.
2. **Count trigger:** the number of periods delivered since the last full
   review crosses the repo's stated review cadence (default: every eight
   entries in the slice-metrics ledger, repo-declared). This catches
   momentum periods where a month would be too slow.

Whichever triggers first. A **targeted review** (one to three topic chunks —
a cluster, a suspicious file family, a guard-integrity audit) is the right
response when a single theme demands investigation between full reviews;
it reuses the same four phases at point-of-need without counting toward,
or resetting, the full-review cadence.

The review never starts on its own: the trigger _prompts the human at a
scheduled gate_, the human approves the launch (and the worktree backend for
cost tier), then the factory runs it. It does not auto-start, and it is
always the _merge_ (human).

## The pipeline (what "running it" means exactly)

Four phases output four artifact classes into
`docs/reviews/YYYY-MM-DD-<name>/` (map.md → briefs/ → reports/ →
assessment.md). Every phase is executed by sub-agents; the orchestrating
lead session plans, verifies, and writes the final aggregate.

1. **Map (phase 1, lead session).** Decompose the codebase into review
   chunks grouped by purpose, layer, or risk, not by file size; each chunk
   gets a risk charter. Commit a map.md that states the **reviewer
   standards** (the repo's own contract the reviewers judge against, not
   generic style opinion), the **findings schema** every report must
   follow (id/severity/category/file:line/quoted evidence/impact/
   recommendation, plus an explicit judgment label — `deep_dive`
   adjudication references), and the **severity definitions**. No findings
   exist yet; this phase produces the standards only.
2. **Briefs (phase 2, researcher sub-agents, one per chunk).** Facts-only
   context briefs ≤ 120 lines (inventories, import graphs, contract
   touchpoints, determinism/anomaly scans, manifest cross-checks).
   Researchers run batched and parallel; they verify their own numbers
   before writing and record no findings — facts are briefs' whole job.
3. **Reviews (phase 3, reviewer sub-agents, one per chunk).** Use a fresh
   stronger model per reviewer. Each reviewer reads the repo standards
   - their brief + the actual files named **and verifies the brief against
     the code** — a brief-vs-code mismatch is itself a finding. Every finding
     cites `file:line` evidence. If real complexity is under judgment, the
     reviewer's runtime may delegate _single items_ to a stronger-still
     adjudicator; when a runtime cannot dispatch models itself, the reviewer
     flags `deep_dive: yes` items with targeted prompts and the orchestrator
     dispatches them, consolidating verdicts into the same report.
4. **Assessment (phase 4, orchestrating lead).** Read all reports,
   de-duplicate across chunks (same root cause, multiple symptoms → one
   aggregated item ranked by impact). Write the merged `assessment.md`
   with a ranked register. Two follow-through obligations close the run:
   register systemic findings as technical-debt rows with same-change
   rule-doc updates ([DEBT-REGISTER.md](DEBT-REGISTER.md)), and produce a
   **recommendations.md** that stages the fixes as brief-sized, factory-
   executable slices wired to the register rows (each paydown row names
   the slice that can close it).

Where model choice matters, the map names **capability tiers**
("executor-brief runner", "reviewer tier", "adjudicator tier") — never
specific models. Model lists churn; the tier contract is the durable rule.
Only the PR body / assessment headers carry the concrete models used, for
telemetry.

## Instruments (optional per run; visibility, never gates)

Instruments are deterministic tools a review _runs to produce evidence_;
findings cite their output, but no review instrument may become a slice
gate. Batch instruments are slow and their survivors need triage — those
are exactly the properties a per-commit gate must not have (the factory's
per-slice gates stay blunt and honest; see FACTORY.md gate-rejection).
Each map.md names its instruments up front; a review that runs an
instrument and cites nothing it surfaced has wasted its evidence budget.

1. **Mutation pass (reviewer tier, phase 3).** Over a shortlist of
   high-risk pure-logic modules — hand-nominated in the map (e.g. pure
   mapping functions with claimed-but-absent pins, untested view-model
   cores). A surviving mutant is a _finding quadrant_: no pin covers the
   behavior the mutant altered. Survivors are triaged, not
   auto-converted: kill-by-test, or justify as equivalent behavior
   (equivalent mutants are documented in the report, never silently
   ignored). Mutation testing cannot detect _missing_ behavioral pins on
   hand-copied prose/mirrors — it complements, it does not replace,
   verify-against-source.
2. **Duplication similarity scan (map or phase 2).** Structural-similarity
   tooling over the chunk's files surfaces near-identical blocks as
   measured facts, raising firsthand duplication rows like "the same
   constant is declared in N files" from researcher diligence to
   instrument output. Thresholds are map-declared per repo (structural
   language, formatting normalization); the scan is evidence, the
   register row's paydown decides whether to merge or consciously keep
   duplicates.
3. **Unproven-load table (map phase).** A per-function table of
   complexity against the tests that carry it — the load no test bears.
   As _directional signal_, not a threshold. A universal numeric gate
   ("every function under a fixed load") is an anti-pattern for
   state-machine-heavy domains where complexity concentrates by design
   in a few honest dispatchers; the map decides which functions are
   load-bearing by design and marks them, so the table is read with that
   answer in hand. An app repo may wrap the table in its own mechanical
   tool (the way [PR-NOTES.md](PR-NOTES.md) instantiate rules locally);
   the kit contract is the reading, not the threshold.
4. **Failing-witnessed-first (phase 2/3, process instrument).** When a
   brief pins counter-examples or other negative branches, the executing
   or reviewing agent records the counter-example witnessed
   failing-for-the-expected-reason in the session log before reporting
   green. This is evidence-of-failure, kept in the log — never a commit
   (slices commit only verify-green), never a claim without the
   transcript anchor.

## Attack the premise (triage doctrine)

When two or more findings —- or two rejected fixes — trace to one shared
design decision, the assessment names that premise in a single sentence,
lists the actors that created it, and registers the premise row, not the
symptoms. Registering the _premise_ as the debt row (the systemic gap in
[DEBT-REGISTER.md](DEBT-REGISTER.md)) is the default; per-symptom rows
carry register IDs only when the premise is already fixed and the
remnants are independent. A review that files five symptom rows under
one premise has hidden the actual decision behind work.

## The rules that keep the reviews honest

1. **No review of briefs.** A reviewer who reads only the brief reviews the
   brief's claims. Phase 3 verification against source is the clause that
   makes findings findings.
2. **Quoted evidence only.** A finding without `file:line` + a real
   load-bearing quote is a redaction risk, not a finding. Report writers
   correct their researcher's numbers; brief-vs-data correction is a
   finding too.
3. **Zero-Critical is information.** A full review that returns no
   findings-grade defects is still an audit _evidence event_ (verified
   counts, honest-ledger adjudication, praise register). Empty is not
   "nothing happened" — record what was verified.
4. **The review reviews the process as well as the code.** Brief contracts
   vs realized code, manifests' storymap test-refs vs live test titles,
   register integrity, metric semantics — cross-ledger claims get
   adjudicated, not assumed (sample, then deep-dive if contested or
   impactful).
5. **Findings enter the register, not the merge diff.** A full review
   changes the register and writes recommendations; it does not fix code
   inline. Fixes dispatch through the normal brief → slice → merge
   lifecycle, carrying the finding ids, quoted lines, and repro runs in
   their briefs.
6. **The review PR follows [PR-NOTES.md](PR-NOTES.md)** — decision half
   (TL;DR, review path with time cost, decisions needed, risk map,
   verification), record collapsed to the summary details block.

## Enforcement hook (app repos)

Optional, prose-checkable lints per app repo: PR template with the phase
skeleton; presence-check of the review-pr body's decision sections; a
`docs/reviews/` artifact dirs exist and each contains the four classes;
these sit on `allowlist` entries so meta-rule 7 never blocks review
artifacts. The kit ships no script (this rule is prose-contract, not
code; see FACTORY.md Coupling).
