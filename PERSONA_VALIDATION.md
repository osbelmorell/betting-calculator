# Persona Validation Report

Date: 2026-03-28
Scope: Calculator UX for novice clarity (Parlay, EV, odds format abbreviations)

## 1) Personas and Expected Steps

### Persona A: First-Time Novice (EN)
Goal: Understand what Parlay and EV mean and complete first successful calculation.

Expected steps:
1. Open `/` and complete a single-bet calculation.
2. Navigate to `/parlay` and add at least 2 legs.
3. Understand all-legs-must-win rule and read combined payout.
4. Navigate to `/ev`, enter estimated win %, and interpret EV result.
5. Open one related guide from calculator context.

### Persona B: Returning Bettor (EN)
Goal: Compare single vs parlay quickly.

Expected steps:
1. Complete a single-bet scenario on `/`.
2. Move to `/parlay` and recreate/extend scenario with additional legs.
3. Compare payout and implied win percentage.
4. Optionally share scenario via share action.

### Persona C: Spanish-Speaking Novice (ES)
Goal: Complete first calculations in Spanish and discover supporting guides.

Expected steps:
1. Open `/es` and complete single-bet calculation.
2. Navigate to `/es/parlay` and complete 2-leg parlay.
3. Navigate to `/es/ev` and interpret EV output with helper text.
4. Open `/es/guides` and read one contextual guide.

## 2) Validation Evidence (Automated)

Executed: `npm run ci:verify`

Results:
1. Lint: PASS
2. Quality gate: PASS
3. Calculator content contract check: PASS
4. Next build: PASS
5. Accessibility smoke: PASS
6. Sitemap host check: PASS

Conclusion: Application is operationally healthy for the defined persona flows at build, route generation, and baseline accessibility levels.

## 3) UX Friction Found by Persona Flow Review

1. Guide discovery can still be missed by first-time users unless links are near decision points.
2. Short odds labels (US/Dec/Frac/Prob) can be ambiguous to novices.
3. EV and break-even language can still feel dense without plain-language cues.
4. Spanish terminology consistency warrants a dedicated pass (next sprint).

## 4) Business Agent Recommendations (Prioritized)

### Do now
1. Add contextual "Learn this step" links within calculator input and result zones.
2. Expand odds tab labels to explicit names while preserving shorthand context.
3. Add plain-language EV and break-even helper lines with progressive disclosure.

### Next sprint
1. Spanish terminology normalization pass for odds and parlay wording.

### Later
1. Beginner-mode micro-onboarding.

## 5) Do-Now Acceptance Criteria

1. At least one relevant guide link appears in each calculator input area and result area.
2. Odds labels are explicit and understandable without shorthand knowledge.
3. EV/break-even sections include concise plain-language interpretation.
4. No calculator math, analytics contracts, routes, or SEO routing behavior is changed.
5. `npm run ci:verify` remains green.

## 6) Regression Controls

Do not change now:
1. EV/payout/odds conversion logic.
2. Route structure, slug mapping, canonical/hreflang, sitemap behavior.
3. Existing analytics event names.
4. Global onboarding/state architecture.
