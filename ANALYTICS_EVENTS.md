# Analytics Event Schema

This document defines the event contract emitted by the betting calculator app.

## Emission Points

Events are emitted from:
- Single calculator interactions
- Parlay calculator interactions
- Share actions
- Parlay leg management

Primary emitter:
- app/components/analytics.ts

## Destinations

Each event is sent to all available integrations:
- Custom browser event: betting-calculator:event
- window.dataLayer push (if present)
- gtag event (if present)
- plausible event (if present)

## Event Names

Single calculator:
- single_first_input
- single_first_calc
- single_reset
- single_share_copied

Parlay calculator:
- parlay_first_input
- parlay_first_calc
- parlay_reset
- parlay_leg_added
- parlay_leg_removed
- parlay_share_copied

## Standardized Payload Fields

These fields are normalized automatically for every emitted event:
- calculator: single or parlay
- event_version: currently 1
- page_path: current route path
- sticky_variant: compact or expanded
- stake_bucket: one of 0, 1-24, 25-99, 100-249, 250-999, 1000+
- stake_amount: numeric stake amount when parseable
- odds_format: american, decimal, fractional, implied, or bet_amount when present
- leg_count: number of legs when provided

Optional event-specific fields that may be included:
- source
- payoutBucket

## Sticky Bar A/B Variant

Assignment logic:
- Key: bc_sticky_bar_variant_v1
- Storage: localStorage
- Variants: compact, expanded
- Behavior: assignment persists per browser until storage is cleared or key changes

## Development Debug Panel

In development mode, a live event viewer is available:
- Component: app/components/AnalyticsDebugPanel.tsx
- Placement: root layout
- Shows the latest events with timestamp and payload
- Supports clearing the current in-memory stream

## Dashboard Mapping Suggestions

Recommended primary funnel:
1. first_input events
2. first_calc events
3. share_copied events

Recommended segments:
- calculator
- sticky_variant
- stake_bucket
- leg_count
- odds_format

## Versioning Guidance

When changing event semantics:
- Increment event_version
- Keep old fields stable where possible
- Add new fields as additive, optional first
- Update this document in the same PR
