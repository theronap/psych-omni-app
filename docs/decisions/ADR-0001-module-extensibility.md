# ADR-0001 — Module extensibility: adding the remaining 8 modules

**Status:** accepted
**Date:** 2026-05-05

## Context

The PRD specifies 20 total modules across three phases:

- **Phase 2 (12 auto-generated)** — generate purely from the core profile, no extra input
- **Phase 3 (5 domain modules)** — require a short supplemental intake (career, family, goals, habits, etc.)
- **Phase 4 (3 behavioral/standalone)** — habit root cause, attention economy, relationship autopsy (the last is fully independent of the core profile)

Phase 2 is fully shipped. The static-content architecture (one TS seed file per module → `blockSeeds.ts` aggregates → `lookup.ts` picks the dimension branch → `/api/modules/[moduleId]/generate` stitches markdown) means each unlock costs ~$0 and serves instantly.

This ADR documents that **the remaining 8 modules can plug into the same scaffolding with minimal new infrastructure** — most of the work is content authoring, not engineering.

## What's reusable for Phase 3 and 4

| Layer | Reusable? | Notes |
|-------|-----------|-------|
| Module registry (`src/lib/modules/definitions.ts`) | ✅ | Add new entries with id, name, tagline, primaryDriverKey |
| Seed file pattern (`src/lib/modules/seeds/*.ts`) | ✅ | Same `Record<driver, Record<section, body>>` shape works |
| Block aggregator (`src/lib/modules/blockSeeds.ts`) | ✅ | Add one import + one entry |
| Section lookup (`src/lib/modules/lookup.ts`) | ✅ | Driver-key picker generalizes |
| Generate route (`/api/modules/[moduleId]/generate`) | ✅ | Already accepts arbitrary moduleId |
| Report rendering (`ReportDisplay.tsx`) | ✅ | Markdown sections render identically |
| DB persistence (`reports` table, `moduleType` column) | ✅ | Schema already supports any module key |

## What's new per phase

### Phase 3 — Domain modules (5 modules)

Each needs a **supplemental intake form** — net-new user input the core profile doesn't have. The pattern:

1. New page: `/modules/[moduleId]/intake` — small form (10–20 items)
2. New API: `POST /api/modules/[moduleId]/intake` — persists to `module_intakes` table (already in PRD schema; needs migration)
3. Generate route reads supplemental intake + core profile, picks seed branch
4. Seeds key off the new dimension(s) — e.g., career module keys off "current role + 5-year vision" combination

**The trick to keep it cheap:** quantize supplemental answers into a small number of buckets (3–5 per question), then your seed branching tree stays manageable. Same content-authoring effort as Phase 2.

### Phase 4 — Behavioral/standalone (3 modules)

- **Habit Root Cause** and **Attention Economy** follow the Phase 3 pattern — supplemental intake → seed lookup
- **Relationship Autopsy** is the only one that needs more thought — it accepts free-text input (relationship timeline, communication samples). For an MVP version, gate it behind structured-choice questions like the story questions; full free-text version requires an LLM call back in the loop

## Estimated effort per remaining module

Assuming the supplemental-intake-with-quantized-answers pattern:

- Add module definition + seed file scaffolding: ~30 min
- Author seed content (5 sections × N driver branches × ~300 words each): bulk of the time, parallelizable to an agent
- Wire intake form: ~1 hour (reuse existing question components)
- Smoke test: ~15 min

**Per module: ~2 hours engineering + content-authoring time, mostly parallelizable.**

## What would NOT scale this way

If a module requires:
- Genuinely open-ended text generation (no quantization possible)
- Cross-module synthesis (Phase 5 — the meta-report)
- Real-time tracking or recurring input

…then it needs an LLM call back in the loop. Budget accordingly: Sonnet 4.6 per generation, or Haiku 4.5 if quality permits.

## Decision

Stop at 12 modules for the demo. When/if Phase 3 ships, follow the scaffolding above. The architectural choice to make module content data-driven (seed files) rather than prompt-driven (LLM per request) is the load-bearing decision — keep it.
