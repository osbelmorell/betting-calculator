# 2026-03-28-apply-example-impact-ga-report.md

## Google Analytics Report: Feature Impact Review

**Date Range:** 2026-03-22 to 2026-03-28
**Timezone:** [Not specified]
**GA Property/Stream:** calcmybets.com

---

### Funnel Definition
- **Entry Point:** Any calculator page (Single, Parlay, EV, Odds Converter)
- **Event:** `*_example_applied` (user applies a guided example)
- **Next Step:** Calculator result displayed
- **Conversion:** User completes a calculation after using a feature (e.g., guided example)

### Segment Filters
- All users
- New vs returning
- Device type
- Language (en/es)

### Available Metrics (2026-03-22 to 2026-03-28)

#### User & Engagement Overview
- **Active users:** 51
- **New users:** 50
- **Average engagement time per active user:** 281 seconds
- **Total event count:** 1,821

#### Page Views (Top Calculators)
| Page Title | Views | Active Users | Event Count | Bounce Rate |
|---|---|---|---|---|
| Single Bet Calculator (EN) | 298 | 51 | 667 | 0.62 |
| Parlay Calculator (EN) | 72 | 7 | 118 | 0 |
| Calculadora de Apuesta Simple (ES) | 63 | 6 | 134 | 0.08 |
| +EV Calculator (EN) | 44 | 6 | 89 | 0.83 |
| Parlay Calculator (ES) | 32 | 5 | 60 | 0.08 |
| Odds Converter (EN) | 25 | 5 | 28 | 0.46 |

#### Retention (Nth Day Active Users)
| Day | Active Users |
|---|---|
| 2 | 6 |
| 3 | 23 |
| 4 | 16 |
| 5 | 17 |
| 6 | 4 |

#### New Users by Channel
- Direct: 50
- Organic Search: 1

#### Platform
- Web: 52 active users

---

### Missing Metrics (Not Available in Current Export)
- Total `*_example_applied` events: Not available
- Unique users who used a guided feature: Not available
- Feature use → calculation conversion rate: Not available
- Drop-off after feature use: Not available

### Observations & Insights
- Most users accessed the Single Bet Calculator (EN), with strong engagement on both English and Spanish calculators.
- Engagement time is high (avg. 281 seconds per user).
- Retention drops after day 3, but a core group remains active through day 6.
- No event-level or funnel data for guided feature usage is present in this export.

### Recommendations
- For future impact reviews, export event-level or funnel data for `*_example_applied` and other feature usage events, plus calculation completion events.
- Use clear, human-friendly report names and headings for easy reference.
- Consider segmenting by device and language for deeper insights.

---

**Report prepared by:** [Your name]
**Date prepared:** 2026-03-28

---

_Store this file in `reports/ga/` and reference it in future optimization decisions._
