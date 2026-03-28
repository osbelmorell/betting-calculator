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

## Why These Rules Exist (Cognitive Load)

Use this model to explain and defend UX decisions:
- Every extra decision, unclear label, or competing action adds cognitive load.
- Higher cognitive load increases hesitation, errors, and abandonment.
- Lower cognitive load improves task completion speed, confidence, and trust.
- The goal is not minimal UI for its own sake; the goal is obvious progress with minimal thinking overhead.

## Krug Theme Mapping (Second Pass)

Use this mapping when reviewing PRs so each UX decision can be traced to a core Krug idea.

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

## Chapter/Theme Traceability Checklist

For major page or flow changes, include a short note in PR description with this format:
- Krug principle(s) applied: [list numbers from mapping above]
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

4. Strengthen visual hierarchy.
- Ensure users can scan and understand the page in seconds.
- Use consistent heading structure and predictable layout patterns.
- Keep critical information above ambiguity points (before long explanations or secondary widgets).
- Use obvious section starts and meaningful subheadings so skimmers can jump directly to intent.

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
- First 5 seconds: purpose and next step are obvious.
- Primary action: one clear dominant CTA per section.
- Scanability: headings, spacing, and grouping support skim reading.
- Navigation clarity: trunk-test questions are answerable instantly.
- Copy brevity: no unnecessary words in labels, helper text, or intros.
- Error recovery: every failure/empty state includes a clear action.
- Mobile fit: core task is comfortable and obvious on small screens.

## Evidence to Include in PR Notes

- Primary task statement (one sentence).
- Dominant CTA and why it is primary.
- Before/after summary of words removed or simplified.
- Trunk Test outcome (pass/fail + notes).
- Lightweight usability check outcome (observations + fixes).

## Definition of Done

- Primary task is obvious within the first screen view.
- Primary action is unambiguous and visually dominant.
- Content and controls are scannable with low cognitive load.
- Trunk-test orientation is clear (where I am, what I can do next).
- Labels, helper text, and errors are clear and actionable.
- Main flow works without confusion on desktop and mobile.
- Accessibility basics are preserved (keyboard/focus/contrast/readability).
- A lightweight usability check has been run and documented for significant UX changes.
- Touched localized experiences remain structurally aligned.
- Any newly discovered repeatable usability rule is documented in this skill.