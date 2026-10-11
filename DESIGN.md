# DESIGN.md — the design-contract pattern

An app with a UI owns a `DESIGN.md` that is a **contract**, not a mood
board. This kit defines the format; the content (which colors, which type,
which components) is app-owned. Worked example by reference: VitaTrack's
`DESIGN.md` in its repo — front-matter token block, per-component intent
tables, Do's and Don'ts.

## Format contract

**YAML front matter — the token contract.** Machine-readable; the app's
guardrails can check markup against it.

```yaml
---
version: alpha
name: <app>
description: >-
  <one paragraph: what this contract covers>
colors:
  primary: "#0d6efd"
  on-primary: "#ffffff"        # every color role paired with its on-* pair
  ...
typography:
  body: { fontFamily: ..., fontSize: ..., fontWeight: ..., lineHeight: ... }
rounded: { sm: 0.25rem, md: 0.5rem, ... }
spacing: { xs: 0.25rem, sm: 0.5rem, ... }
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}" }
---
```

- Token references use brace syntax (`{colors.primary}`); a literal value
  is allowed but should be justified in the markdown.
- Components are named maps of style properties referencing tokens. New
  component = new entry, same change as the markup that uses it.

**Markdown — the component rules.** Per-component sections with
intent→class/property tables (create / edit / delete / navigate → exact
class or token), section rules (tables, forms, feedback, empty states),
and a closing Do's and Don'ts list. Rules are imperatives with named
exceptions; descriptions that no rule binds belong in the app's docs, not
here.

## The amendment rule

**This document is part of every UI change.** A change that introduces or
alters a pattern, interaction, or component not covered here must raise it
with the human and — on agreement — amend this document **in the same
change**. A shipped UI pattern the contract doesn't describe is a defect
(register it). Tokens *select* from the app's base framework; they don't
replace it — prefer the framework's stock classes matching a token over
custom CSS, always.

## What the kit does not hold

Colors, type scales, component inventories, and framework choices are app
content. Cite VitaTrack's `DESIGN.md` for a full worked instance; copy its
*shape*, not its values.
