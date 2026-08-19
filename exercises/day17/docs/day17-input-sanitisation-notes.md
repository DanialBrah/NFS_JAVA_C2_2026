# Day 17 Exercise 05 — Input Sanitisation

## What was built

`com.example.supportdesk.util.InputSanitizer` (support-desk-api) — a small, static, dependency-free utility:

| Method | Does | Example |
|---|---|---|
| `trimToNull(String)` | Trim; blank → `null` | `"  "` → `null` |
| `stripControlCharacters(String)` | Remove control characters, but keep `\t`/`\n`/`\r` | `"Hi there"` → `"Hi there"` |
| `cleanText(String)` | Strip control chars, collapse all whitespace runs (incl. newlines/tabs) to a single space, trim, blank → `null` | `"  Printer   jam\ton\n level 3  "` → `"Printer jam on level 3"` |
| `cleanMultilineText(String)` | Strip control chars, trim overall, but **preserve internal line breaks** | `"  Steps:\nOpen app\nClick print  "` → `"Steps:\nOpen app\nClick print"` |
| `normalizeCode(String)` | `cleanText` + uppercase, for short fixed-vocabulary fields | `"  high  "` → `"HIGH"` |

Applied in `TicketService`: `title`/`category`/`createdBy` use `cleanText`, `description` uses `cleanMultilineText` (so multi-line ticket descriptions keep their line breaks instead of being flattened to one line), and `priority`/`status` use `normalizeCode` (matching the existing convention in this app of uppercase tokens like `HIGH`, `IN_PROGRESS`). Covered by `InputSanitizerTest` (6 tests, all passing).

This **replaces** the previous `value.trim()`-only logic in `TicketService.normalizeRequired/normalizeStatus/normalizePriority` — those still exist as private wrapper methods, they now delegate to the shared utility instead of duplicating ad-hoc trim calls.

Note: the sibling `asset-tracker` project already has its own `com.example.assettracker.util.InputSanitizer` (not currently called from anywhere), but its `cleanText` has a regex bug — `\\{Cntrl\\}` matches the literal text `{Cntrl}`, not the intended `\\p{Cntrl}` POSIX control-character class — so its "remove control characters" step is currently a no-op. Worth fixing there too if that class gets wired in.

## Where sanitisation sits relative to validation

Sanitisation happens in `TicketService`, **after** `@Valid @NotBlank` has already run on `CreateTicketRequest`/`UpdateTicketRequest` at the controller boundary. That ordering matters: a whitespace-only title (`"   "`) is already rejected by `@NotBlank` (which trims before checking) before the sanitizer ever sees it — the sanitizer only ever cleans input that already passed the reject/accept gate. It doesn't get a vote on whether something is valid, only on how it's stored.

## Reflection

**1. What is validation?**
Deciding whether input is acceptable at all, and refusing to proceed if it isn't — e.g. `@NotBlank`, `@Email`, `@Size(min = 8)` on `RegisterRequest`. Validation's job is to say yes or no.

**2. What is sanitisation?**
Reshaping input that's already been accepted into a clean, consistent form before it's stored or used — trimming whitespace, stripping control characters, normalising case. Sanitisation's job is to clean, never to decide accept/reject.

**3. One example where input should be cleaned:**
A ticket title submitted as `"  Printer jam on level 3  "` (stray leading/trailing spaces from a copy-paste) — there's nothing wrong with the content, it just needs trimming before it's stored, so it doesn't render or sort oddly later.

**4. One example where input should be rejected:**
A registration password of `"1234567"` (7 characters). There's no "clean" version of a too-short password that becomes acceptable — `@Size(min = 8)` on `RegisterRequest` correctly rejects it outright rather than trying to pad or reshape it into something valid.
