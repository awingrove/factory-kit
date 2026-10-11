# DEBT-REGISTER.md — the technical-debt register

One register per repo, conventionally `docs/factory/debt.yaml`
(VitaTrack: `docs/factory/technical-debt.yaml`). Three sections: `open`,
`closed`, `defects`. The register is machine-validated in each app's CI —
a missing field, a duplicate id, or an unresolvable `where` fails the build.

## Field shapes

- **`open`** — required: `id`, `title`, `where`, `what`, `interest`,
  `paydown`. Forbidden: `closed`, `note`. Optional: `deferred` (date),
  `deferral_note` — a deliberate park: the entry stays **open**.
- **`closed`** — required: `id`, `title`, `closed` (a real ISO date),
  `note`. Optional: `where`, `what`, `interest`. A closed `where` is a
  *historical* path (often prefixed `was `) and is never existence-checked.
  Do not unify the open and closed shapes — the asymmetry is deliberate.
- **`defects`** — required: `id`, `title`, `found` (a real ISO date),
  `injection_stage`, `detection_stage`, `systemic_gap`. Optional: `what`,
  `closed_in` (the file whose `systemic_gap` closes the loop).

## Rules

- **Ids are unique repo-wide** (`TD-\d+` debt, `DL-\d+` defects). An id may
  not appear in two sections.
- **Every prose field is a folded block scalar (`>-`)**, never a plain
  scalar: the text contains `": "` (labels like `**Interest:**`) which is a
  parse error in a plain scalar. Indentation is significant — a continuation
  line that loses its indent silently truncates the field.
- **Dates are bare ISO scalars** (`found: 2026-09-21`), no prose. Month-only
  precision belongs in `injection_stage`, not in `found`.
- **`where` on open entries**: backticked repo-relative paths, optionally
  with `:line` or `(:symbol)` anchors; existence-checked by the validator.

## Validator expectations

CI fails on: missing required field, forbidden field present, duplicate or
malformed id, `closed`/`found` not a real date, an open entry's `where`
path not existing. Closed entries' `where` is exempt (historical).
Warn-until-three-entries is acceptable at bootstrap; after three entries
the gate is hard: a shipped slice with no register touch when its PR
introduced a known cost is review material.

## Post-mortem capture

A bug fix whose root cause reveals a systemic gap (a gotcha, a missing
rule, an unenforced convention) updates the register — and the rule doc the
gap lived in — in the same commit or an immediate follow-up. Never
optional cleanup. Defect entries exist so escapes are classifiable: name
the injection stage and the detection stage honestly, including when the
detection stage is "human review, while the same author's tests all
passed" — that is a signal about the suite, not an embarrassment.

Example shapes (open / closed / defect), condensed from VitaTrack:

```yaml
open:
  - id: TD-019
    title: >-
      `Expand` returns an empty list silently, so a third caller gets silence for free
    where: >-
      `src/App.Core/Widgets/WidgetRepository.cs:80-107`
    what: >-
      The zero-match check lives in the caller; a new caller would inherit silence.
    interest: >-
      Same "wrong is loud, deleted is silent" class as TD-013, one layer down.
    paydown: >-
      Move the zero-match check into `Expand` itself so callers cannot forget it.

closed:
  - id: TD-009
    title: >-
      `GetAll` missing `ORDER BY`
    where: >-
      was `src/App.Core/Widgets/WidgetRepository.cs:17`
    what: >-
      Nondeterministic row order; position assertions could flake.
    interest: >-
      Order-dependent tests pass/fail nondeterministically.
    closed: 2026-09-24
    note: >-
      `ORDER BY Name, Id` + a stable-order unit test.

defects:
  - id: DL-001
    title: >-
      Currency add kept the left operand's currency silently
    found: 2026-09-21
    injection_stage: >-
      Value-object design — mixed-currency semantics left unresolved and
      papered over with a "caller guarantees same currency" comment.
    detection_stage: >-
      Human code review. Unit tests and CI both passed the defective
      semantics — the tests were written by the same agent as the defect.
    systemic_gap: >-
      The value-object recipe had no rule about invalid-combination
      semantics. Closed in the exemplar recipe (fail loudly on invalid
      combinations; test the error edges).
    closed_in: new-slice-recipe.md
```
