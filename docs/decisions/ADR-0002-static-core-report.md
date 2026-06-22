# ADR-0002 — Static core report (eliminate the LLM dependency)

**Status:** accepted
**Date:** 2026-06-22

## Context

The core intake report (`/api/intake/submit`) was the last surviving live LLM
call in the app. Every other surface — the 12 unlockable modules — was already
converted to static, data-driven seed content (see ADR-0001), serving instantly
at ~$0. The core report still called Claude (Haiku 4.5) at module scope.

Two problems surfaced:

1. **Single point of failure.** On 2026-06-22 the Anthropic org hit its usage
   limit (`invalid_request_error: "You have reached your specified API usage
   limits"`). The `client.messages.create` call returned 400, the stream errored
   (`controller.error`), and the whole report 500'd — surfaced to users as
   "Something went wrong generating your report." A demo product can't depend on
   an external quota.
2. **The original justification for the LLM is gone.** The core report used to
   weave in four **free-text** story answers, which genuinely needed a model.
   Those questions are now multiple-**choice** (`type: 'choice'`), so every input
   to the report is discrete/quantized — identical in kind to the inputs the
   static modules already handle. There is no longer a free-text input to
   synthesize.

## Decision

Convert the core report to the same static-seed architecture as the modules.
No LLM call in the request path. The report is assembled from pre-written
blocks selected by the profile.

The one architectural extension over the module system: modules key the whole
report off a single `primaryDriverKey`; the core report keys **each of its 10
sections off its own driver**, then stitches them.

### Section → driver map

| Section | Driver | Buckets |
|---|---|---|
| Who You Are | dominant OCEAN trait (furthest from 50, high/low) | 10 |
| How You Think | `jungian.dominant` | 4 |
| How You Connect | `attachment.style` | 4 |
| Your Superpowers | `strengths[0]` | 12 |
| Your Kryptonite | `cognitiveDistortions.top3[0]` | 6 |
| Hidden Patterns | `enneagram.primary` | 9 |
| What's Driving You | `motivation.primaryDriver` | 4 |
| Your Blind Spots | `conflictStyle` | 4 |
| A Note on Your Shadow | `enneagram.primary` | 9 |
| Where to Go From Here | composite (recommendation library) | ~24 snippets |

"Who You Are" keys off the single most-extreme OCEAN trait rather than a
cross-product of all five (which would be 3^5 = 243 combinations). "Where to Go
From Here" is assembled from a recommendation library: one snippet per bucket
across attachment, top distortion, primary motivation, emotion-regulation style,
and self-concept clarity, concatenated into 4–5 personalized recommendations.

### Files

- `src/lib/coreReport/bucket.ts` — `dominantOcean`, `bucket3` helpers
- `src/lib/coreReport/sections.ts` — the 10 `CoreSection` specs + driver fns
- `src/lib/coreReport/lookup.ts` — `getCoreReportSections` / `assembleCoreReport`
  (driver lookup with fallback to the first authored bucket)
- `src/lib/coreReport/seeds/*.ts` — one bank per section + `recommendations.ts`
- `src/app/api/intake/submit/route.ts` — rewritten to assemble statically; the
  module-scope `new Anthropic()` and the streaming LLM call are gone. Response
  contract (body + `META` trailer incl. `__profile__`) is unchanged so the
  client needs no changes.

## Consequences

- **$0, instant, no token, never 500s on a quota.** Nothing for a licensee to
  provision.
- **Some loss of cross-dimension nuance.** Per-section single-driver keying can't
  capture interactions the way a model reasoning over the full vector could. An
  optional interaction-override map and/or a single LLM "smoothing pass" (behind
  a default-off flag, with graceful fallback to raw blocks) are documented as
  future enhancements, intentionally deferred to keep the demo robust.
- **Authoring is content work, not engineering** (~62 section bodies + a rec
  library), parallelizable to an agent — consistent with ADR-0001's approach.
