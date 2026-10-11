# factory-kit

The factory is a process for building software with AI executors: features
arrive as vertical **slices**, each slice is delivered from a pre-decided
**brief**, and conformance is enforced by named, machine-checkable gates —
manifests, guardrail scripts, tests — rather than by reviewer vigilance.
Humans own design and the merge; executors execute mechanically and never
route around a gate. This repo is the process contract: the vocabulary, the
spec formats, and the rules that every app repo instantiates. It holds prose
and spec examples only — no shared code, ever (see Coupling below).

## Repo index

| Repo | Role |
|---|---|
| `factory-kit` (this repo) | Process contract: vocabulary, spec formats, worked manifest examples. |
| `VitaTrack` | First instantiation. Its factory layer lives in its own repo (`docs/factory/`, `shards.yaml`, `storymap.yaml`) — pre-dates this kit. |
| orrery (name TBD) | Second instantiation: a static-JS system-design simulator built by the factory, from the factory. |

## Vocabulary

These meanings are locked. Changing one is a kit change, not a local one.

- **factory** — the process itself: brief → slice → gates → DoD → human merge.
- **slice** — a vertical feature unit owning its logic end-to-end: a folder,
  a manifest entry, a story-map entry, its tests. *Not* "shard": `shard` is
  reserved for its systems meaning (the orrery simulates sharded databases;
  a database shard is never a feature unit).
- **slices.yaml** — the slice manifest. Every app repo owns exactly one.
  Which roles exist inside a slice is app-defined; the meta-rules that keep
  the manifest honest are factory-readable and identical everywhere
  ([SLICES.md](SLICES.md)).
- **brief** — the unit an executor works from: a committed plan document
  ([PLAN-FORMAT.md](PLAN-FORMAT.md)) that is the single source of truth for
  the work. Chat context is not a brief.

## The docs

- [SLICES.md](SLICES.md) — slice-manifest meta-grammar (fields + meta-rules).
- [PLAN-FORMAT.md](PLAN-FORMAT.md) — briefs and plans: checkbox ticks, cold resume.
- [DEBT-REGISTER.md](DEBT-REGISTER.md) — technical-debt register: open / closed / defect shapes.
- [CLAIM-LANGUAGE.md](CLAIM-LANGUAGE.md) — CHECKS / PINS / DOCUMENTS for guarantee-comments.
- [TEST-RULES.md](TEST-RULES.md) — the testing line: no-mock, no-double-200, entry-point coverage, click-through arrival.
- [FACTORY.md](FACTORY.md) — the process contract: DoD per slice, human gates, executor contract.
- [DESIGN.md](DESIGN.md) — the design-contract pattern (tokens + component rules), format not content.
- [examples/](examples/) — one worked `slices.yaml` stub per flavor:
  [.NET MVC](examples/slices-dotnet-mvc.yaml), [static JS](examples/slices-static-js.yaml).

## Coupling

Each app repo **points at this repo; it never owns a copy of these docs.**
Enforcement scripts are per-app (they must run inside that app's CI), copied
from kit examples where examples exist; the kit itself carries no runnable
code. When an app and the kit disagree, the disagreement is resolved — by
fixing the app, or by fixing the kit in the same change (the kit is
load-bearing, not aspirational) — never by silently diverging.
