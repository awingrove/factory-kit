# TEST-RULES.md — the testing line

## The no-mock line

E2E specs run against the **real running application**; what must never be
faked is the app's own HTTP. A test-double server standing in for an
*external* dependency — bound on a real socket, speaking a real protocol —
is fine, with one hard limit: **the stub never writes the app's answer.**
It may serve a fixed upstream payload, an error, a delay; it may not
compute or originate the response the app exists to produce. The line is
whether the app still answers.

## No-double-200

A test whose only signal is a `200 OK` proves nothing whenever two sources
can produce that 200 (app vs stub, primary route vs fallback). Assert the
*answer* — body content, resulting state, the stub's request log — never
the status alone. One 200 the app earned, one the harness earned: a test
that cannot tell them apart has tested the harness.

## Entry-point coverage per surface

A validation or binding rule must be exercised at **every** endpoint that
binds that model. A rule verified on one page proves nothing about the
others; the manifest's `tests:` refs are how "every" is made checkable
([SLICES.md](SLICES.md) meta-rule 3).

## Click-through arrival + the orphan-page rule

Every GET page must be reachable from inside the running app **in the same
change that adds it**; direct-URL-only access is a defect. At least one
e2e spec per surface must arrive by clicking in-app links — `goto()` deep
URLs prove the page exists, not that the app leads to it.

## e2e naming

Spec files: `<area>.spec.js`, area matching the slice id's lowercase form.
Test titles start `should `. Story-map refs address specs as
`<spec-stem>::<title fragment>`; the fragment must appear verbatim in the
file, or the ref fails resolution.

## Guardrail discipline (for the checkers themselves)

A guardrail is only as good as its ability to **fail**:

- **Non-vacuity** — a rule whose selection is empty passes without testing
  anything. Each checker proves its selection is non-empty against the real
  manifest.
- **One negative-path proof** — when a rule is introduced, observe it red
  once against an input it should reject: mutate the real input, see red,
  revert. Not asserted from memory.
- **No layer 3** — never assert on another test's assertions. Running a
  suite and asserting on its result is layer 3, is forbidden, and has no
  stable place to stop.
