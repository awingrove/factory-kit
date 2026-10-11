# CLAIM-LANGUAGE.md — CHECKS / PINS / DOCUMENTS

A code comment that makes a guarantee must carry exactly one of three
keywords:

- **`CHECKS: <claim>`** — this code verifies the claim here, at
  runtime/compile time/this test. The claim is only as strong as the check
  that backs it.
- **`PINS: <claim>`** — regression pin: the claim once failed and a test
  now prevents its return. Name the test in the comment.
- **`DOCUMENTS: <behavior>`** — description of behavior, carrying **no**
  guarantee. The reader may rely on it as description, not as promise.

## The rule

Guarantee-language outside a claim — `guarantees`, `always`, `never`,
`ensures`, `will` used as a promise, in any comment — is a review defect.
Either the comment earns a keyword (and the check behind it), or it loses
the promise. The same applies to claims pasted into prose docs: a rule doc
may state rules, but a claim that code *enforces* something must name the
gate that enforces it.

## Carve-out — pattern note (not yet exercised)

In security-training apps (the OWASP CTF genre: DVWA / WebGoat / Juice
Shop lineage), a slice's deliberately seeded flaw must **not** be
commented: the teaching goal is that innocuous, well-written code can hide
a vulnerability, so the surrounding code is genuinely good and exactly one
flaw per slice sits uncommented in it. The claim lives in the exploit-proof
e2e spec instead, still in claim vocabulary (`CHECKS: the SQLi in
`login.php` is exploitable as seeded` — pinned by the CTF overlay, not by
production code). This is the one place where an uncommented
guarantee-relevant location is correct. Every other rule in this doc still
binds those repos. *Status: not-yet-exercised — adopted from a design
discussion; first use is the vuln-app, when it starts.*
