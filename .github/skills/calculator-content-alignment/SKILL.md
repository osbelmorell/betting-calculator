---
name: calculator-content-alignment
description: Enforce consistent calculator copy structure across Single, Parlay, EV, and Odds Converter. Use this whenever creating or significantly updating a calculator.
argument-hint: "[scope: single|parlay|ev|odds|all] [action: create|update|audit]"
---

# Calculator Content Alignment Skill

Use this skill every time a calculator is created or significantly changed.

## Mandatory Trigger

Invoke this skill when any task includes:
- Creating a new calculator route/page/component.
- Adding or renaming calculator UI labels, hints, CTAs, or sections.
- Adding new localization keys in calculator content files.

## Source of Truth

- Single + Parlay content: [app/content/calculatorContent.ts](../../../app/content/calculatorContent.ts)
- EV content: [app/ev/content.ts](../../../app/ev/content.ts)
- Odds converter content: [app/odds-converter/content.ts](../../../app/odds-converter/content.ts)
- Auto-generated contract: [CALCULATOR_CONTENT_CONTRACT.md](./CALCULATOR_CONTENT_CONTRACT.md)
- Contract sync script: scripts/sync-calculator-content-contract.mjs

## Required Workflow

1. Update calculator copy in content files first.
- Do not hardcode user-facing copy inside calculator components when equivalent content keys exist.
- Keep English and Spanish key sets aligned.

2. Keep calculators structurally aligned.
- Preserve shared UX blocks where relevant: hero title/subtitle, inputs card title, results labels, reset/share actions, related tools, and FAQ/help sections.
- Use concise labels that fit mobile cards without wrapping when possible.

3. Sync the calculator contract.
- Run `npm run calc:contract:sync` after adding/removing/renaming calculator copy keys.
- This regenerates [CALCULATOR_CONTENT_CONTRACT.md](./CALCULATOR_CONTENT_CONTRACT.md).

4. Validate.
- Run `npm run lint` when possible.
- Run `npm run build` for release-impacting changes.

5. Maintenance requirement.
- If you discover a better reusable pattern, update this skill in the same change.
- Keep guidance concise and repository-specific.

## Definition of Done

- Calculator copy is sourced from content files (no unnecessary hardcoded strings in components).
- Locales remain aligned for touched calculator keys.
- Contract file is regenerated and committed.
- Build/lint pass or any blockers are clearly reported.
