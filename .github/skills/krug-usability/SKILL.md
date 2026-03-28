---
name: krug-usability
description: Apply practical usability principles inspired by Steve Krug's Don't Make Me Think to every new or significantly updated user-facing experience.
argument-hint: "[scope: page|component|flow|all] [action: create|update|audit]"
---

# Krug-Inspired Usability Skill

Use this skill every time a user-facing experience is created or significantly changed.

This skill is inspired by the usability principles popularized in Steve Krug's work and translates them into repeatable implementation rules for this repository.

## Book-Aligned Principles (Operationalized)

Apply these principles on every user-facing implementation:
- Don't make users think: choices, labels, and outcomes must be self-evident.
- Don't waste users' time: reduce steps, keep flows short, and prioritize speed to result.
- Omit needless words: use concise copy and remove filler text.
- Design for scanning, not reading: users skim first, then dive deeper.
- Build clear visual hierarchy: make importance obvious at a glance.
- Make navigation self-explanatory: users should always know where they are and what to do next.
- Test early with small checks: quick usability checks are required for every significant change.

## Visual Design Principles (7 Rules)

These seven principles govern every visual and layout decision. They are not stylistic preferences — they are enforceable rules that reduce cognitive load and guide users without requiring thought.

### 1. Hierarchy
Be intentional about what goes where and what the user sees first. Use visual weight to communicate importance.
- Important content and primary actions use larger font size, heavier weight, or stronger color.
- What users care about most must appear highest in the reading order.
- Every screen has a clear visual entry point: the most important element must be obvious at a glance.
- Navigational cues (title, section, context) must always remind users where they are and what the content is about.
- Apply to this project: calculator result values, primary CTA buttons, and section headings outrank helper text, labels, and FAQs in every visual tier.

#### Typography Rules
- Use only the established font size scale: `text-xs` (12px) for secondary labels, `text-sm` (14px) for helper text and inputs, base (16px) for body, `text-card-title` (~20–30px) for card headings, `text-section-title` (~27–43px) for editorial headings, `text-hero` (36–67px) for page titles. Do not introduce arbitrary bracket sizes (e.g., `text-[15px]`).
- Use font weight for role, not decoration: headings and primary result values use weight 600–700; body text and helper copy use weight 400–430. Do not use more than 3 weight levels on a single screen.
- Body text line height must be at least 1.5× font size. The project base is `line-height: 1.6` — do not override below 1.5 on paragraph or helper text.
- Prefer dark grey over pure black: `--foreground` (#1d1d1f) for primary text, `--text-secondary` (#5f5f64) for supporting text. Never use raw `#000000` or `text-black` for user-facing text.
- Apply to this project: the type scale contract is `text-hero → text-section-title → text-card-title → text-subtitle → text-sm → text-xs`. Declare a variant only when the existing scale has no suitable match, and add a rationale comment.

### 2. Progressive Disclosure
Show only what the user needs at each step. Do not present everything at once.
- Multi-step flows must reveal only the inputs needed for the current step.
- Secondary information (detailed explanations, edge cases, advanced options) appears after the primary task is clear.
- Always give users orientation within a multi-step flow: show position and remaining steps.
- Apply to this project: keep calculator inputs above editorial content; use FAQ/guide sections below the fold as progressive depth, not as prerequisites.

### 3. Consistency
A familiar interface removes the need to think. Do not break established patterns without a clear reason.
- Buttons, labels, input styles, heading levels, and result formats must look and behave identically across all calculators.
- Any deviation from an established UI pattern requires an explicit rationale.
- Consistent patterns across EN and ES routes: layout, element order, and interaction must be equivalent.
- Apply to this project: Quick Start block → Card → Inputs → Results → Actions → Related Tools → FAQ. This order is the contract; preserve it on every calculator page.

#### Component & Interaction Rules
- Differentiate button roles: `.btn-primary` for the one main action per section; `.btn-secondary` for supporting or reversible actions; `.btn-danger` for destructive actions (e.g., remove leg, reset). Never apply primary styling to a secondary action.
- Standardize corner radii: inputs and small buttons use `rounded-lg` (8px); format selectors and info surfaces use `rounded-xl` (12px); calculator cards use `rounded-2xl` (16px). Do not introduce other radius values without documented rationale.
- Afford interactivity: every interactive element must be visually distinct from static content via border, background, shadow, or cursor change. An element must never look inert when it is clickable.
- Apply to this project: all calculator inputs, format tabs, CTA buttons, and leg cards must follow the established radius and `.btn-*` style contract. One-off radius values are a consistency violation.

### 4. Contrast
Use contrast intentionally to command attention toward critical content and away from secondary content.
- Primary actions use the brand color; secondary actions use muted/neutral styles.
- Destructive actions (delete, reset) use a visually distinct color (e.g., red) to signal consequence.
- Positive EV results, warnings, and errors use distinct, semantically meaningful colors — not decoration.
- A higher contrast level is reserved for the most important element on the screen; do not dilute it by applying the same treatment to everything.
- Apply to this project: EV status badges (+EV/−EV/neutral), result values, and primary CTAs must be visually distinct from helper text and supporting copy.

#### Color Usage Rules
- The 60-30-10 rule is enforced by the design token system: 60% `--background` (neutral surface), 30% `--surface`/`--surface-soft` (white/light surfaces for cards and inputs), 10% `--brand` (blue accent for primary CTAs, active states, focus rings, and positive EV). Do not use `--brand` for decorative styling.
- Text-to-background contrast must meet WCAG AA: 4.5:1 minimum for normal text, 3:1 for large text (18px+ regular or 14px+ bold). The project tokens `--foreground` on `--background`/`--surface` are pre-validated; do not reduce contrast below these tokens with custom overrides.
- Never use color as the sole signal. Every semantic color (brand = positive, red = negative/danger) must be paired with a text label or icon — WCAG 1.4.1 requires color-independent understanding.
- Apply to this project: positive EV = `text-[var(--brand)]`, negative EV = `text-red-500` (maps to `--danger` family), neutral EV = `text-[var(--foreground)]`. These token-to-semantic mappings are fixed and must not be rewired.

### 5. Accessibility
Design for the full range of users. Accessibility is a requirement, not an enhancement.
- All text meets WCAG AA contrast ratios at minimum.
- Every interactive element is reachable and operable by keyboard.
- Focus states are visible and unambiguous.
- All inputs, icons, and controls have descriptive `aria-label` or associated visible labels.
- Images and icons that carry meaning have descriptive `alt` text.
- Sufficient padding and touch-target size for all interactive controls on mobile.
- Apply to this project: all calculator inputs, format selectors, sliders, and action buttons must pass WCAG AA contrast, keyboard focus, and screen-reader label checks.

#### Forms & Input Rules
- Labels must be placed above their input field, never to the left or as placeholder-only text. Placeholder text is supplementary hint copy, not a label replacement.
- All `<label>` elements must be bound to their input via `htmlFor`/`id`. Never rely on proximity alone for the label-input association.
- Use single-column layout for forms. Multi-column form layouts increase scan distance and error rates, especially on mobile.
- Inline validation fires immediately after the user leaves a field (on `blur`) or as values become clearly invalid — not deferred to form submit. Show both the error and the recovery action.
- Apply to this project: all calculator inputs (stake, odds, probability) already use top-aligned labels with `htmlFor` bindings — preserve this pattern. When adding new fields, inline error messages go directly below the input, not in a toast or page banner.

### 6. Proximity
Elements that belong together must be visually grouped. Elements that are unrelated must be visually separated.
- Related controls (bet amount + slider, odds format selector + odds field) are kept in the same visual group.
- Results are co-located with the inputs that produced them.
- Destructive or secondary actions (Reset, Share) are separate from primary task controls.
- Apply to this project: stake input and slider are one group. Odds fields and format selector are one group. Results footer is visually separated from inputs. Related tools and FAQ sections are separated from the interactive calculator surface.

#### White Space Rules
- White space is functional, not filler. Generous spacing between content groups signals boundaries, reduces visual clutter, and helps users focus on what matters.
- Do not compress spacing to fit more content on screen. If content feels crowded, remove content — don't reduce spacing.
- Apply to this project: calculator card sections use `px-6 py-8 sm:px-8` as the base interior padding. Editorial sections use `space-y-8` between blocks. Do not reduce these below the established values.

### 7. Alignment
Consistent alignment creates order, professionalism, and predictability.
- All content aligns to a predictable grid; random or inconsistent margins break trust.
- Text, labels, and values align consistently within their containers.
- Result stats in the results footer align on the same baseline grid.
- Mobile layouts maintain the same alignment system as desktop, adapted for a single column.
- Apply to this project: result stat grid, calculator card padding, and editorial section spacing must align to the established spacing scale — do not introduce one-off margins or padding values.

#### 8pt Grid Rule
- All spacing, padding, and margins must use multiples of 8px. In Tailwind this maps to: `p-2`/`gap-2` = 8px, `p-4`/`gap-4` = 16px, `p-6`/`gap-6` = 24px, `p-8`/`gap-8` = 32px, `p-10` = 40px, `p-12` = 48px.
- 4px increments (`p-1`, `gap-1`) are acceptable only for micro-spacing within components (e.g., icon padding, badge insets). They must not be used for section or layout spacing.
- Do not introduce arbitrary spacing tokens (e.g., `mt-[18px]`, `p-7`, `gap-5`) without a documented rationale. Prefer the nearest 8pt multiple.
- Apply to this project: card padding (`py-8`/`px-6`), section gaps (`space-y-8`/`space-y-12`), result grids (`gap-4`), and quick-start blocks (`py-3 px-4`) must all conform to this scale.

## Why These Rules Exist (Cognitive Load)

Use this model to explain and defend UX decisions:
- Every extra decision, unclear label, or competing action adds cognitive load.
- Higher cognitive load increases hesitation, errors, and abandonment.
- Lower cognitive load improves task completion speed, confidence, and trust.
- The goal is not minimal UI for its own sake; the goal is obvious progress with minimal thinking overhead.

## Krug Theme Mapping (Second Pass)

Use this mapping when reviewing PRs so each UX decision can be traced to a core Krug or Visual Design principle.

1. Don't make me think.
- Maps to: self-evident choices, clear labels, obvious primary action, low ambiguity.
- Enforced by: Non-Negotiable Rules, Workflow steps 1-3, Fast Rubric items 1-3.

2. Users scan pages, they do not read linearly.
- Maps to: strong heading hierarchy, chunked sections, concise copy, obvious section starts.
- Enforced by: Workflow steps 4-5, Fast Rubric item 3, minus-50%-words check.

3. Eliminate question marks at each interaction point.
- Maps to: explicit field labels, plain-language helper text, predictable controls, clear outcomes.
- Enforced by: Non-Negotiable "No mystery labels", Workflow steps 2, 5, 8.

4. Navigation should answer orientation questions immediately.
- Maps to: page identity, current location, available sections, and next possible actions.
- Enforced by: Workflow step 7 (Trunk Test), Fast Rubric item 4, Definition of Done orientation check.

5. Reduce friction and clicks to complete the primary task.
- Maps to: fewer required inputs, shorter path to results, no unnecessary interruptions.
- Enforced by: Workflow step 3, Fast Rubric items 1 and 7.

6. Remove words and elements that do not change decisions.
- Maps to: concise labels and intros, no filler, no repeated claims, no decorative noise.
- Enforced by: Workflow step 5, Workflow step 8 minus-50%-words test, Fast Rubric item 5.

7. Test early with small representative checks.
- Maps to: fast scan/path/clarity checks on each significant change.
- Enforced by: Workflow step 8 and Fast Rubric as release gates.

8. Visual hierarchy communicates importance without words.
- Maps to: Visual Principle 1 (Hierarchy) — font size/weight, contrast, and spacing enforce reading order.
- Enforced by: Workflow step 4, Fast Rubric visual hierarchy item.

9. Progressive disclosure reduces overwhelming complexity.
- Maps to: Visual Principle 2 (Progressive Disclosure) — primary task is shown first; depth follows.
- Enforced by: Non-Negotiable "No hidden essentials", Workflow step 1 and 3.

10. Consistency eliminates unnecessary learning.
- Maps to: Visual Principle 3 (Consistency) — patterns must match across all calculators and locales.
- Enforced by: Workflow step 11, Non-Negotiable Rules, Definition of Done.

11. Contrast directs attention intentionally.
- Maps to: Visual Principle 4 (Contrast) — brand/semantic color use is purposeful, not decorative.
- Enforced by: Anti-pattern "No decorative complexity", Fast Rubric primary action item.

12. Accessibility is non-negotiable.
- Maps to: Visual Principle 5 (Accessibility) — WCAG AA compliance, keyboard, and screen-reader support.
- Enforced by: Workflow step 10, Definition of Done accessibility check.

13. Proximity creates natural grouping.
- Maps to: Visual Principle 6 (Proximity) — related inputs, controls, and results stay together.
- Enforced by: Workflow step 3 and 6, Anti-pattern "mobile layouts that hide core actions".

14. Alignment creates order and predictability.
- Maps to: Visual Principle 7 (Alignment) — grid, spacing, and baseline consistency across all breakpoints.
- Enforced by: Workflow step 4, Definition of Done.

## Chapter/Theme Traceability Checklist

For major page or flow changes, include a short note in PR description with this format:
- Krug principle(s) applied: [list numbers 1-7 from Krug mapping]
- Visual principle(s) applied: [list numbers 1-7 from Visual Design Principles]
- What changed in UI/copy/flow:
- How cognitive load was reduced:
- What quick checks were run (scan/path/clarity/trunk):
- Result (pass/fix needed):

## Mandatory Trigger

Invoke this skill when any task includes:
- Creating a new page, route, calculator, guide, or UI component.
- Significant edits to interaction flow, navigation, labels, forms, or calls to action.
- Major content restructures that affect how quickly users understand what to do.

## Core Principle

The interface should be obvious and self-explanatory. Reduce user thought load before adding features or visual detail.

## Non-Negotiable Rules

- One page, one primary job: each page/flow must have a clearly dominant purpose.
- One section, one primary CTA: avoid multiple competing "main" actions.
- No mystery labels: every action and field label must be concrete and predictable.
- No decorative complexity: visuals must support comprehension, not distract from tasks.
- No dead ends: every empty/error state must include a next action.
- No hidden essentials: key value, inputs, and outcome signals must be visible without exploration.

## Common Anti-Patterns and Fixes

- Anti-pattern: multiple equal-weight CTAs in the same panel.
- Fix: keep one dominant CTA and demote alternatives to secondary links/buttons.

- Anti-pattern: vague button labels (for example, "Continue" with unclear effect).
- Fix: use outcome labels (for example, "Calculate Payout", "Convert Odds").

- Anti-pattern: long intro blocks before users can act.
- Fix: move primary input/action above long explanations and keep intro concise.

- Anti-pattern: form fields without context or examples.
- Fix: add helper text, placeholder examples, and inline validation.

- Anti-pattern: errors that describe failure but not recovery.
- Fix: include exact next step and recovery action in every error/empty state.

- Anti-pattern: mobile layouts that hide core actions below clutter.
- Fix: prioritize core controls/results first in mobile reading order.

## Required Workflow

1. State the main task first.
- Define the single primary user task for the page/flow.
- Ensure the heading, intro, and primary action make that task instantly clear.

2. Make choices obvious.
- Prefer clear labels over clever wording.
- Keep one dominant primary action per section.
- Remove or demote competing CTAs when they distract from the main task.

3. Reduce friction and noise.
- Minimize required inputs and steps.
- Group related controls and results together.
- Remove decorative or repetitive content that does not help decisions.

4. Strengthen visual hierarchy and visual design.
- Ensure users can scan and understand the page in seconds. (Hierarchy)
- Use consistent heading structure and predictable layout patterns. (Consistency, Alignment)
- Keep critical information above ambiguity points (before long explanations or secondary widgets). (Hierarchy, Progressive Disclosure)
- Use obvious section starts and meaningful subheadings so skimmers can jump directly to intent. (Hierarchy)
- Brand color and contrast are reserved for primary actions and semantic states (positive/negative/warning). (Contrast)
- Group related controls and results visually using proximity and consistent spacing. (Proximity, Alignment)
- Ensure all interactive elements meet WCAG AA contrast, have visible focus states, and carry aria labels. (Accessibility)
- Apply only type scale tokens from the established contract; do not introduce arbitrary font-size bracket values. (Typography)
- Differentiate button types using `.btn-primary`, `.btn-secondary`, `.btn-danger`; match visually to importance. (Components)
- All spacing must conform to the 8pt grid (multiples of 8px); use Tailwind's p-2/p-4/p-6/p-8 scale. (Alignment)

5. Write usable microcopy.
- Labels, helper text, and errors should answer: what this is, why it matters, and what to do next.
- Use concrete language and betting-domain terms users already expect.
- Prefer short sentences and action verbs.
- Remove marketing filler and repeated claims that do not improve task completion.

6. Preserve orientation.
- Users should always know where they are and what changed.
- Keep navigation predictable.
- On multi-step or interactive sections, show state and outcomes clearly.

7. Run Krug navigation checks (Trunk Test).
- At a glance, users must be able to answer: "What site is this?", "What page am I on?", "What are the major sections?", "Where can I go from here?", and "How do I search/act?".
- Verify these answers are clear on desktop and mobile.

8. Validate with quick heuristic checks.
- Perform a five-second scan test: can a new user identify purpose and next step immediately?
- Perform a path test: can the main task be completed without backtracking?
- Perform a clarity test: do error/empty states provide a clear recovery action?
- Perform a "minus 50% words" test on long copy; remove anything that does not change user decisions.

9. Run a lightweight usability check (3 users or proxies).
- Ask each tester to complete one primary task without guidance.
- Capture where they pause, misclick, or ask clarification questions.
- Any repeated confusion across 2 or more testers is a required fix before release.

10. Keep accessibility and responsiveness non-negotiable.
- Ensure keyboard usability and visible focus states.
- Ensure touch-friendly controls and readable spacing on mobile.
- Ensure contrast and text size support quick comprehension.

11. Maintain consistency across calculators and guides.
- Reuse established patterns for titles, inputs, results, FAQs, and related links when suitable.
- Keep EN/ES structure and intent aligned for touched user-facing copy.

12. Evolve the skill.
- If implementation reveals a better repeatable usability pattern, update this skill in the same change.
- Keep rules concise, practical, and repository-specific.

## Release Gate (Required for Significant UX Changes)

A significant change cannot be considered done unless all are true:
- Fast Usability Rubric has no "Needs Work" on first 5 seconds, primary action clarity, and error recovery.
- Trunk Test answers are clear on desktop and mobile.
- At least one lightweight usability check run is documented in PR notes.
- Any repeated confusion pattern has either been fixed or explicitly deferred with rationale.

If these are not met, classify the change as UX-incomplete and do not mark as finished.

## Fast Usability Rubric (Pass/Needs Work)

Score each item during implementation:
- First 5 seconds: purpose and next step are obvious. (Krug 1, Hierarchy)
- Primary action: one clear dominant CTA per section. (Krug 5, Contrast)
- Scanability: headings, spacing, and grouping support skim reading. (Hierarchy, Alignment)
- Navigation clarity: trunk-test questions are answerable instantly. (Krug 4, Consistency)
- Copy brevity: no unnecessary words in labels, helper text, or intros. (Krug 6)
- Error recovery: every failure/empty state includes a clear action. (Krug 3)
- Mobile fit: core task is comfortable and obvious on small screens. (Progressive Disclosure, Proximity)
- Visual hierarchy: font size, weight, and color clearly rank important vs. secondary elements. (Hierarchy, Contrast)
- Typography scale: only established size tokens are used — no arbitrary Tailwind bracket font sizes. (Typography)
- Consistency: this page matches established patterns for inputs, results, CTAs, and section order. (Consistency)
- Component roles: btn-primary, btn-secondary, and btn-danger are used correctly and never interchanged. (Components)
- Color semantics: 60-30-10 token balance is maintained; brand color is not used for decoration. (Color)
- Accessibility: contrast, keyboard navigation, focus states, and aria labels are correct. (Accessibility)
- Forms: field labels are top-aligned, bound via htmlFor, and inline validation is immediate. (Forms)
- Proximity: related elements are grouped; unrelated elements are separated. (Proximity)
- White space: spacing is generous and not compressed to fit more content. (Proximity)
- Alignment: all spacing conforms to the 8pt grid scale — no one-off margin or padding values. (Alignment)

## Evidence to Include in PR Notes

- Primary task statement (one sentence).
- Dominant CTA and why it is primary.
- Before/after summary of words removed or simplified.
- Trunk Test outcome (pass/fail + notes).
- Lightweight usability check outcome (observations + fixes).

## Definition of Done

- Primary task is obvious within the first screen view. (Krug 1, Hierarchy)
- Primary action is unambiguous and visually dominant at every breakpoint. (Contrast, Hierarchy)
- Content and controls are scannable with low cognitive load. (Hierarchy, Alignment)
- Progressive disclosure is applied: depth follows the primary task, not the reverse. (Progressive Disclosure)
- Page layout is consistent with established calculator/guide structure contract. (Consistency)
- Contrast is purposeful: brand color marks primary actions; semantic colors mark EV status and errors. (Contrast)
- Related inputs/controls/results are co-located; destructive/secondary actions are separated. (Proximity)
- All spacing conforms to the 8pt grid — multiples of 8px using established Tailwind scale tokens. (Alignment)
- Only established type scale tokens are used; no arbitrary bracket font sizes introduced. (Typography)
- Button roles are correct: btn-primary for primary, btn-secondary for supporting, btn-danger for destructive. (Components)
- 60-30-10 color balance held: brand color used only for primary actions, active states, and semantic signals. (Color)
- All form field labels are top-aligned and bound via htmlFor; inline validation is immediate. (Forms)
- Trunk-test orientation is clear (where I am, what I can do next). (Krug 4)
- Labels, helper text, and errors are clear and actionable. (Krug 3)
- Main flow works without confusion on desktop and mobile. (Krug 5, Progressive Disclosure)
- All interactive elements pass WCAG AA contrast, have keyboard focus, and carry aria labels. (Accessibility)
- A lightweight usability check has been run and documented for significant UX changes.
- Touched localized experiences remain structurally and visually aligned.
- Any newly discovered repeatable usability rule is documented in this skill.