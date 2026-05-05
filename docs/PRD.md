# Product Requirements Document
## Psychological Insight Platform — [PLATFORM NAME TBD]
**Version:** 0.1 — Pre-Build  
**Date:** 2026-05-04  
**Author:** Theron Peterson

---

## 1. Product Vision

A single platform that turns self-knowledge into a compounding asset. Users complete one deep intake — once — and unlock a growing library of psychological reports, each generated from the same profile data. Every add-on module deepens the platform's understanding of the user rather than starting from scratch.

**Core formula (non-negotiable):**
> Short input → Deep synthesis → Identity-level output → Insight that feels uncomfortably accurate

**Tone:** Mainstream-accessible. Warm but direct. Feels like a brilliant, perceptive friend — not a clinical report, not a self-help book, not a Myers-Briggs printout. Occasionally surprising. Never condescending.

**Working names to decide before Phase 1 ships:**
- Meridian ("your psychological north star")
- Prism (multiple facets of one person)
- Depth ("know yourself completely")
- Mirror
- Strata (layers of who you are)

---

## 2. Target Audience

### Primary Persona — "The Self-Aware Optimizer"
- Age 24–38, college educated
- Already interested in psychology, self-development, therapy, personality frameworks
- Has taken MBTI, Enneagram, or Big Five before — and felt like they got half the picture
- Wants depth, not a quiz. Wants something that feels *earned*
- Willing to spend 40–60 minutes on an intake if the output is genuinely valuable

### Secondary Persona — "The Curious Skeptic"
- Comes in via social share ("my friend sent me their Shadow Self report")
- Skeptical of personality tests but intrigued by the specificity
- Needs to feel the output is personalized, not templated
- Converts if the first paragraph of the sample feels unnervingly accurate

### Out of Scope (for now)
- Clinical/therapeutic use
- Enterprise HR (Phase 5+ if at all)
- Minors

---

## 3. Core Architecture Philosophy

The entire platform is built on a single principle: **one profile, many lenses.**

```
[Core Intake Quiz]
       ↓
[Persistent Psychological Profile — structured JSON]
       ↓
[Report Engine — Claude API]
  ├── Phase 1: Core Deep Personality Report
  ├── Phase 2: Auto-Generated Add-on Reports (same data, new lenses)
  ├── Phase 3: Domain Modules (supplemental intake → new reports)
  ├── Phase 4: Behavioral Modules (ongoing input → dynamic reports)
  └── Phase 5: Synthesis Layer (cross-report meta-analysis)
```

**Key architectural constraint:** No Phase 2+ module should require the user to re-answer questions already answered in the core intake. Every new module either (a) generates from existing profile data or (b) asks only for net-new context that couldn't have been inferred.

---

## 4. The Core Intake — Psychological Foundation

The 40–60 minute intake quiz covers 15 psychological dimensions. This is the foundation for the entire platform. Every report traces back to this data.

### The 15 Dimensions (maps to original "15 tests → JSON" architecture)

| # | Dimension | Framework Basis | Question Style |
|---|-----------|----------------|----------------|
| 1 | Personality traits | Big Five / OCEAN | Likert scale (30 items) |
| 2 | Attachment style | Bowlby / Ainsworth | Scenario-based (12 items) |
| 3 | Core type | Enneagram indicators | Preference-ranking (9 items) |
| 4 | Values hierarchy | Schwartz Value Theory | Card-sort style (10 items) |
| 5 | Jungian cognitive functions | Jung / MBTI substrate | Forced-choice (16 items) |
| 6 | Internal family system | IFS (Schwartz) | Reflective prompts (8 items) |
| 7 | Cognitive distortions | CBT / Burns | Frequency + scenario (15 items) |
| 8 | Emotional regulation style | Gross model | Scenario-based (10 items) |
| 9 | Decision-making style | Decision theory | Scenario + self-report (10 items) |
| 10 | Conflict style | Thomas-Kilmann | Scenario-based (10 items) |
| 11 | Strengths signature | VIA Character Strengths | Ranking (15 items) |
| 12 | Risk tolerance | Prospect theory indicators | Scenario-based (8 items) |
| 13 | Self-concept clarity | SCC scale | Likert (10 items) |
| 14 | Locus of control | Rotter scale | Agreement statements (10 items) |
| 15 | Motivational orientation | Self-Determination Theory | Scenario + rating (10 items) |

**Total:** ~180 items, presented in ~8 themed sections (not as clinical test blocks). Target completion time: 40–55 minutes. Progress-saved so users can return.

### Intake UX Principles
- Themed sections with evocative names (e.g., "How You Move Through the World," "What You're Running From")
- No clinical language. No scales labeled "Neuroticism." 
- Each section has a 1–2 sentence framing that makes it feel meaningful, not administrative
- Progress saved to localStorage + account if logged in — resumable at any point
- End of intake: "Your profile is being analyzed" → report delivery within 60 seconds

---

## 5. Phase 1 — Core Platform + Deep Personality Report

### 5.1 Goal
Ship a working product: user completes the intake quiz and receives a comprehensive, personalized psychological report. The report is the product. Everything else is built on top of it.

### 5.2 Features

#### 5.2.1 Landing Page
- Hero: clear value proposition ("The most thorough self-analysis you've ever seen")
- Sample report teaser (3–4 anonymized paragraphs — the kind that make you think "how did it know that")
- What's inside the report (section previews)
- Social proof placeholder (testimonials once available)
- Single CTA: "Start Your Analysis"

#### 5.2.2 Intake Quiz
- Multi-step form, one section at a time
- 8 sections, each with a thematic name and brief intro
- Question types: Likert sliders, scenario choices, ranking drag-and-drop, short free text (3–4 open-ended prompts)
- Auto-saves progress every 30 seconds
- Estimated time shown per section
- Resume flow for returning users (via email link or account)
- Mobile-first, keyboard-navigable

#### 5.2.3 Report Generation
- On intake submit: structured JSON profile built from responses
- Profile sent to Claude API with a master system prompt (the report generation engine)
- Report generated in ~45–90 seconds (streamed if possible)
- Report sections:

| Section | Description |
|---------|-------------|
| **Who You Are** | Core personality summary — the OCEAN/Enneagram synthesis in plain language |
| **How You Think** | Cognitive style, decision patterns, strongest and weakest reasoning modes |
| **How You Connect** | Attachment style in relationships, conflict approach, what you need from others |
| **Your Superpowers** | Top 3–5 genuine strengths with specific manifestations |
| **Your Kryptonite** | 3–5 genuine vulnerabilities — specific, not generic |
| **Hidden Patterns** | The things you do that you don't realize — behavioral loops |
| **What's Driving You** | Motivational roots — fear vs aspiration, internal vs external |
| **Your Blind Spots** | What others see that you can't |
| **A Word About Your Shadow** | Jungian suppressed traits — brief intro (hooks Phase 2 add-on) |
| **Where to Go From Here** | Specific, actionable next steps tied to the user's actual profile |

#### 5.2.4 Report Delivery
- Web-based report (styled, readable, shareable link)
- PDF download option
- User account created automatically at report delivery (email + password or magic link)
- Report stored in account forever — user can return anytime
- Shareable public link (optional, user-controlled, anonymized name option)

#### 5.2.5 User Account / Dashboard
- View completed report
- See available add-on modules (teased, locked)
- Profile completeness indicator
- Email: report delivery + "your profile is ready" flow

### 5.3 Technical Requirements

**Stack:**
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes (Vercel Functions / Fluid Compute)
- **AI:** Anthropic Claude API (claude-sonnet-4-6 for report generation, haiku for intake processing)
- **Database:** Neon Postgres (via Vercel Marketplace) — user accounts, profile JSON, report storage
- **Auth:** NextAuth.js with magic link (Resend) + optional Google OAuth
- **Storage:** Vercel Blob for PDF exports
- **Email:** Resend (transactional)
- **Deployment:** Vercel

**Key API design:**
```
POST /api/intake/save          — saves intake progress (unauthenticated, session-based)
POST /api/intake/submit        — finalizes intake, triggers profile build + report generation
GET  /api/report/[id]          — fetch completed report
POST /api/report/[id]/export   — generate PDF
GET  /api/user/dashboard       — user's reports + available modules
```

**Profile JSON schema (abbreviated):**
```json
{
  "userId": "uuid",
  "createdAt": "ISO date",
  "dimensions": {
    "ocean": { "O": 72, "C": 58, "E": 41, "A": 65, "N": 63 },
    "attachment": { "style": "anxious", "score": { "secure": 34, "anxious": 71, "avoidant": 28, "disorganized": 45 } },
    "enneagram": { "primary": 4, "wing": 3, "confidence": 0.82 },
    "values": ["autonomy", "achievement", "connection", "creativity", "security"],
    "cogFunctions": { "dominant": "Ni", "auxiliary": "Fe", "tertiary": "Ti", "inferior": "Se" },
    "ifs": { "primaryProtector": "manager", "exile_themes": ["inadequacy", "abandonment"] },
    "cognitiveDistortions": { "top3": ["catastrophizing", "mind_reading", "all_or_nothing"], "severity": "moderate" },
    "emotionRegulation": { "style": "suppression", "flexibility": "low" },
    "decisionStyle": { "primary": "intuitive", "secondary": "deliberate", "bias": "loss_aversion" },
    "conflictStyle": "avoiding",
    "strengths": ["perspective", "creativity", "love_of_learning", "authenticity", "curiosity"],
    "riskTolerance": { "financial": "moderate", "social": "low", "intellectual": "high" },
    "selfConceptClarity": 0.52,
    "locusOfControl": { "internal": 0.68, "external": 0.32 },
    "motivation": { "primary": "intrinsic_curiosity", "fear_driver": "irrelevance", "aspiration_driver": "mastery" }
  },
  "openEndedResponses": {
    "lifeStory": "...",
    "proudestMoment": "...",
    "biggestRegret": "...",
    "whatOthersSay": "..."
  }
}
```

**Report generation prompt architecture:**
- System prompt: platform tone, section structure, length targets per section (~300–500 words each), "never generic, always specific to the data" instruction, mainstream accessible framing
- User message: full profile JSON + open-ended responses
- Output: structured markdown with section headers
- Total target report length: 4,000–6,000 words

**Performance requirements:**
- Intake auto-save: < 200ms
- Report generation: < 90 seconds (streamed to client)
- Report page load: < 2 seconds (cached after generation)

### 5.4 Non-Goals for Phase 1
- No payment/monetization yet
- No add-on modules
- No social sharing features
- No mobile app
- No team/group profiles

### 5.5 Success Metrics
- Intake completion rate > 60% of users who start
- Report satisfaction: qualitative — "does it feel accurate?" (add single post-report survey)
- Return rate: % of users who log back in within 7 days
- Share rate: % of users who share their report link

---

## 6. Phase 2 — Auto-Generated Add-on Reports

### 6.1 Goal
Unlock the profile data already collected and generate 12 additional targeted reports with zero additional input from the user. Each report is a new lens on the same data — different emphasis, different framing, different value.

### 6.2 The 12 Auto-Generated Modules

Each module is unlocked from the dashboard and generates in ~30–60 seconds.

| Module | What It Analyzes | Primary Data Sources |
|--------|-----------------|----------------------|
| **Shadow Self Report** | Jungian suppressed traits, how they leak into behavior | IFS exiles, OCEAN low scores, cognitive functions inferior |
| **Cognitive Bias Scanner** | Top biases, where they appear, how dangerous they are | Cognitive distortions, decision style, locus of control |
| **Internal Conflict Mapper** | Competing inner drives — the war between what you want | Values hierarchy, IFS parts, enneagram, motivation orientation |
| **Narrative Identity Analyzer** | Your dominant life story (hero, survivor, builder, etc.) | Open-ended life story, values, attachment, strengths |
| **Blindspot Finder** | What others see that you can't about yourself | Self-concept clarity, cognitive distortions, conflict style, OCEAN |
| **Motivation Source Analyzer** | Fear vs aspiration vs duty vs status — and sustainability | Motivation orientation, locus of control, values, enneagram |
| **Overthinking Diagnosis** | When thinking becomes avoidance — your specific triggers | Cognitive distortions, decision style, emotion regulation, N score |
| **Emotional Trigger Blueprint** | What sets you off, why, and how predictable it is | Emotion regulation, attachment, conflict style, IFS |
| **Mental Energy Map** | When and how you think best — your cognitive rhythm | OCEAN (E score), cognitive functions, decision style |
| **Decision Pattern Analyzer** | Your decision algorithm — and exactly where it breaks | Decision style, locus of control, risk tolerance, loss aversion |
| **Personal Leverage Report** | Your highest-ROI personal actions (small effort = big result) | Strengths, weaknesses, values, cognitive style |
| **Life as a Game Engine** | Your life reframed as RPG mechanics — stats, quests, bosses | Full profile synthesis — gamified framing layer |

### 6.3 UX Flow
1. User visits dashboard — sees 12 locked module cards with teaser descriptions
2. User unlocks a module (click → instant generation starts)
3. Report appears in same styled format as core report
4. Each module report is stored in account alongside core report
5. Dashboard shows "X of 12 modules unlocked"

### 6.4 Technical Requirements
- Each module has its own system prompt — a different "lens" instruction for Claude
- Same profile JSON as input (no new data collection)
- Reports stored in DB linked to user + module type
- Generation uses claude-haiku-4-5 (faster, cheaper for shorter targeted reports)
- Target length per module report: 1,500–2,500 words
- Add `/api/modules/[moduleId]/generate` endpoint

### 6.5 Module Report Structure
Each module report follows a condensed version of the core structure:
1. **Your [Module Topic] Profile** — the direct diagnosis (most important, comes first)
2. **How This Shows Up** — specific behavioral manifestations
3. **Where It Helps You** — the upside
4. **Where It Costs You** — the downside
5. **What To Do About It** — 3–5 concrete, specific actions

### 6.6 Non-Goals for Phase 2
- No new intake questions
- No module-to-module cross-referencing yet (that's Phase 5)
- No social features per module

### 6.7 Success Metrics
- Average modules unlocked per user (target: > 3)
- Time from core report to first module unlock (target: < 24 hours)
- Module completion rate (how many users read the full module vs bounce)

---

## 7. Phase 3 — Domain Module Add-ons (Supplemental Intake Required)

### 7.1 Goal
Unlock domain-specific reports that need context the core intake couldn't capture — career history, relationship context, family dynamics, future goals. Each domain module adds a short supplemental questionnaire (10–20 minutes) and generates a deeply contextualized report.

### 7.2 The 5 Domain Modules

#### 7.2.1 Life Strategy Engine
- **Supplemental intake:** Goals, current life situation, biggest constraints, 5-year vision, past "big swings" (20 items)
- **Output:** 10-year strategic life plan — likely failure paths, high-leverage moves, a ranked action list
- **Unique value:** Combines the user's psychology with their actual goals — not generic life advice

#### 7.2.2 Career Path Predictor
- **Supplemental intake:** Work history highlights, current role, what energizes vs drains, financial needs, autonomy preferences (15 items)
- **Output:** 3 likely career trajectories with probability, income range, satisfaction curve, and "you'll hate this about it" warning per path
- **Unique value:** Predicts fit, not just interest — based on what the user's psychology can sustain long-term

#### 7.2.3 Founder DNA Report
- **Supplemental intake:** Startup experience (if any), ideas in progress, risk appetite confirmation, co-founder preferences, what failure would mean to you (12 items)
- **Output:** Startup strengths, failure-prone patterns, the startup archetype you're suited for, what type of co-founder you need
- **Unique value:** Honest about what types of companies will break you, not just inspire you

#### 7.2.4 Family System Decoder
- **Supplemental intake:** Family structure, birth order, parent descriptions, significant family events, recurring family dynamics (18 items — sensitive, framed carefully)
- **Output:** The scripts you inherited, the roles you played, the loyalty binds still running your life — and what's actually yours vs theirs
- **Unique value:** One of the most emotionally resonant outputs on the platform — high share potential

#### 7.2.5 Future Self Simulator
- **Supplemental intake:** Current habits (10 key habits rated), goals (stated vs actual), biggest procrastination patterns (12 items)
- **Output:** 3 versions of you in 5 years — each a realistic narrative scenario based on current trajectory, altered trajectory, and breakthrough trajectory
- **Format:** Narrative storytelling + bulleted habit analysis

### 7.3 Technical Requirements
- Each domain module has its own supplemental intake form
- Supplemental responses stored alongside core profile in DB
- Generation uses claude-sonnet-4-6 (richer output needed for these longer reports)
- Target report length: 3,000–5,000 words per domain module
- API: `POST /api/modules/domain/[moduleId]/intake` and `POST /api/modules/domain/[moduleId]/generate`
- Supplemental intake can be started and returned to (saved state)

### 7.4 UX Considerations
- Domain modules surfaced separately from auto-generated modules on dashboard
- Clear "this one needs 15 more minutes of your time" expectation set before starting
- Framing: "We already know who you are — now tell us about your [career/family/goals] and we'll apply your psychology to it"

### 7.5 Success Metrics
- Domain module start rate (of users who see them, % who begin)
- Domain module completion rate (supplemental intake drop-off points)
- Most popular domain module (expect: Career or Future Self)

---

## 8. Phase 4 — Behavioral Modules + Standalone Flows

### 8.1 Goal
Add two types of new experiences: (1) modules that require ongoing behavioral input (not a one-time quiz) and (2) completely standalone flows for experiences that can't share the core intake.

### 8.2 Behavioral/Ongoing Modules

These modules require the user to provide data over time or in a session-based input format.

#### 8.2.1 Habit Root Cause Engine
- **Input:** User describes 3–5 habits they consistently fail at. For each: how long trying, what triggers the failure, what the habit is meant to fix
- **Output:** The psychological root cause for each failure (not willpower — actual behavioral drivers), and the minimum effective intervention for each
- **Format:** One-time session input + generated analysis (not a tracker)

#### 8.2.2 Attention Economy Profile
- **Input:** 20-minute self-audit questionnaire about content consumption — what platforms, how long, what pulls you in, what you can't resist, what you feel after
- **Output:** Your attention vulnerabilities, manipulation triggers, what content is quietly shaping your beliefs, and a personalized attention defense plan
- **Note:** This one has high viral potential — feels slightly alarming in a good way

#### 8.2.3 Relationship Autopsy Report *(Standalone — sensitive flow)*
- **Completely separate intake** — does not use core profile (or optionally links to it for deeper context)
- **Input:** Relationship timeline, key events, communication samples (optional paste), how it ended, what you believe went wrong
- **Output:** Root causes, attachment dynamics at play, patterns the user contributed, what the relationship revealed about them, what to watch for next time
- **UX note:** This is the most emotionally sensitive module. Tone must be compassionate, not clinical. No blame framing. Include a "this may bring up difficult feelings" notice at the start.
- **Format:** Separate entry point from dashboard — can be reached without completing core intake

### 8.3 Technical Requirements
- Relationship Autopsy: fully independent intake form and generation pipeline
- Optional profile linkage: if user has core profile, offer to include it for deeper analysis
- Input text fields (for communication samples) must have character limits and content moderation layer
- Habit Engine and Attention Profile: session-based input, no ongoing tracking required
- All Phase 4 modules generate single reports (not recurring)

### 8.4 Non-Goals for Phase 4
- No journaling or daily check-in features
- No push notification habit tracking
- No couples flow (future consideration)

---

## 9. Phase 5 — The Synthesis Layer

### 9.1 Goal
Transform the platform from a collection of reports into something genuinely novel: a system that knows the user across all their reports and can surface cross-report patterns no individual report could catch.

### 9.2 Features

#### 9.2.1 Meta-Report: "The Thread"
- Generated after user has completed 5+ reports (core + at least 4 modules)
- Output: A synthesis analysis — "Here is the single pattern running through all of your reports"
- Example: "Your shadow report, your decision pattern, your family system, and your emotional trigger map all point to the same root dynamic: [specific insight]"
- This is the most valuable output on the platform. It's the thing no human could produce without reading everything.

#### 9.2.2 Profile Evolution
- When user unlocks new modules, option to "re-analyze" the meta-report with new data included
- Framed as: "Your understanding of yourself is getting more complete"

#### 9.2.3 Cross-Report Contradictions
- Surface places where the user's self-report and behavioral patterns contradict each other
- Example: "You rate yourself high in risk tolerance, but your decision patterns and conflict avoidance style tell a different story"
- Framed as insight, not gotcha

#### 9.2.4 Shareable "Psych Card" (Social Feature)
- User can generate a single-page visual summary of their psychological profile
- Highly shareable format (like a personality trading card)
- Pulls the most interesting/unusual data points from their full profile
- Optional: "Send to a friend" who can see your card and take their own intake

### 9.3 Technical Requirements
- Meta-report generation takes all completed report content + profile JSON as context
- Requires claude-sonnet-4-6 with extended context (full reports = large context window)
- Psych Card: designed as a visual component, exportable as image (html2canvas or similar)
- Cross-report contradiction detection: structured prompt comparing profile dimensions that commonly conflict

---

## 10. Tech Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind | Fast, Vercel-native, strong ecosystem |
| AI | Anthropic Claude API | claude-sonnet-4-6 for depth reports, haiku for speed |
| Database | Neon Postgres (Vercel Marketplace) | Serverless, scales to zero, JSON column for profiles |
| Auth | NextAuth.js + Resend magic links | Simple, no OAuth complexity needed at launch |
| Storage | Vercel Blob | PDF storage, psych card image exports |
| Email | Resend | Transactional — report delivery, magic links |
| Deployment | Vercel | Fluid Compute, instant deploys, no infra |
| Analytics | Vercel Analytics + PostHog | Funnel tracking (where do users drop off in intake?) |

---

## 11. Data Model (Postgres Schema — High Level)

```sql
users
  id, email, created_at, name

profiles
  id, user_id, intake_data (jsonb), dimensions (jsonb), created_at, updated_at

reports
  id, user_id, profile_id, module_type (enum), content (text), created_at

module_intakes
  id, user_id, module_type, intake_data (jsonb), completed_at

report_sessions
  id, session_token, intake_progress (jsonb), created_at, expires_at
  -- allows unauthenticated intake saving before account creation
```

**Module type enum:**
`core`, `shadow_self`, `cognitive_bias`, `internal_conflict`, `narrative_identity`, `blindspot`, `motivation_source`, `overthinking`, `emotional_trigger`, `mental_energy`, `decision_pattern`, `personal_leverage`, `life_as_game`, `life_strategy`, `career_predictor`, `founder_dna`, `family_system`, `future_self`, `habit_root_cause`, `attention_economy`, `relationship_autopsy`, `meta_synthesis`

---

## 12. Key Open Decisions (Resolve Before Phase 1 Build)

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Platform name | Meridian, Prism, Depth, Mirror | Decide before domain purchase |
| Monetization model | Per-report, subscription, freemium | Revisit after Phase 2 is live |
| Core intake length | 40 min vs 60 min | Start with 40, expand if needed |
| Report format | Web-only vs PDF first | Web-first, PDF as export |
| Auth timing | Gate report behind account creation vs after | Create account at delivery (reduces friction) |
| Open-ended responses | 3 prompts vs 6 | Start with 3 (life story, proud moment, what others say) |
| Mobile intake | Full mobile support vs desktop-first | Mobile-first (most users will start on phone) |

---

## 13. Phase Sequencing Summary

| Phase | Core Deliverable | Estimated Build Time (with AI) |
|-------|-----------------|-------------------------------|
| **Phase 1** | Core intake + Deep Personality Report + account/dashboard | 1 focused session (4–6 hrs) |
| **Phase 2** | 12 auto-generated add-on reports | 1 session (3–4 hrs) — mostly prompt engineering |
| **Phase 3** | 5 domain modules with supplemental intakes | 1–2 sessions |
| **Phase 4** | 3 behavioral/standalone modules | 1 session |
| **Phase 5** | Synthesis layer, meta-report, social features | 1–2 sessions |
| **Full platform** | All of the above, production-ready | 4–6 focused sessions total |
