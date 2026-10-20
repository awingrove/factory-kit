# SLICES.md — the slice manifest meta-grammar

Every app repo owns one `slices.yaml`. The **grammar of a slice** — which
file roles exist, what they name — is app-defined per stack flavor. The
**meta-rules** below are factory-readable: identical in every app, enforced
by that app's own checker script (reference implementation:
`stack-orrery/scripts/guard-slices.mjs`).

## Slice fields (all required)

- **`id`** — short unique token (`MF`, `PANEL`). Story-map task ids begin
  with it.
- **`name`** — human name.
- **`roles`** — map of role-name → list of repo-relative paths or globs
  (`**` = recursive). Role *names* are app-defined per flavor (.NET MVC:
  `controller`, `core`, `views`, `models`, `js`, `unit_tests`, `e2e_specs`;
  static JS: `pages`, `js`, `css`, `unit_tests`, `e2e_specs`). Declare every
  role on every slice, `[]` included: an absent key was never reviewed.
- **`owns`** — resources this slice is the only writer of (tables, routes,
  storage artifacts). Own first; an unowned writable resource is a boundary
  bug.
- **`calls`** — other slices' `id`s this slice may call. Nothing else.
- **`tests`** — refs into the suite: `unit: <path-or-symbol>` and
  `e2e: <spec-stem>::<title fragment>` (naming per
  [TEST-RULES.md](TEST-RULES.md)).
- **`entry_point`** — the navigable chain from app entry to this slice's UI
  (`nav bar -> Widgets -> list`). `n/a (<reason>)` only for non-navigable
  work; the reason is mandatory.

Top-level: `slices:` (sequence) and `allowlist:` (flat sequence of
repo-relative paths for cross-cutting files — shared shell, program
bootstrap, test helpers). Cross-cutting means genuinely shared, not
"nobody claimed it".

## Meta-rules (factory-readable)

1. **Every file claimed.** Every shipped repo file belongs to exactly one
   slice's roles or to the `allowlist`. No orphans, no double-claims.
2. **Every ref resolves.** Every path in the manifest exists; every glob
   matches at least one file (a vacuous glob passes testing nothing and
   fails).
3. **Every test ref resolves.** A `unit:` ref exists in that slice's
   `unit_tests` sources; an `e2e:` spec-stem file exists and the title
   fragment appears in it.
4. **No dangling calls.** Every `calls:` id names a declared slice; no
   slice calls itself.
5. **Every slice has an entry-point chain** or an explicit `n/a (reason)`.
6. **Story-map integrity.** Story-map task ids begin with a declared slice
   id, and every slice id prefixes at least one task id (bidirectional).
7. **Same-change updates.** `slices.yaml` (and the story map) change in the
   same commit/branch as the feature they describe (enforced on PR CI by
   comparing changed slice files against `--base <ref>`). A stale map is a
   defect, not a cleanup task.

An app may extend a slice with extra fields (its flavor needs them); the
meta-rules operate only on the fields above and must keep passing.

Worked stubs: [examples/slices-dotnet-mvc.yaml](examples/slices-dotnet-mvc.yaml),
[examples/slices-static-js.yaml](examples/slices-static-js.yaml).
First instantiation (in-repo, pre-dates this grammar): VitaTrack's
`shards.yaml`.
