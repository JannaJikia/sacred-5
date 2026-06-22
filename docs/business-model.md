# Sacred 5 — Business Model Brainstorm

> Working strategy doc. Status: exploratory. Chosen near-term direction:
> **Free now, monetize-ready** (build the experience and the gating
> architecture now; switch on a subscription later).

---

## 1. What Sacred 5 is, commercially

A single-player consumer habit app in the **discipline / wellness** niche
(walk, cold shower, journal, meditation, plus custom practices). Key
commercial implications:

- **No per-seat pricing.** It is one person tracking their own practice, so
  the classic SaaS "per user" metric does not apply.
- **Value scales with depth**, not usage volume: history, insights,
  customization, reminders, accountability. That makes this a **freemium
  feature-gating** problem, not a usage-metering one.
- **Self-serve, web-first.** No sales motion. Conversion happens inside the
  product at moments of value.

---

## 2. Positioning (the wedge)

The product already has a sharp point of view baked in: **honest points,
daily caps, no vanity streaks.** That is a *serious-tracker* stance, not
gamified fluff.

**Lean the paid tier into integrity, insight, and accountability** — not into
removing artificial annoyances. The promise is "the disciplined version of a
habit tracker," and people who want that will pay for depth and accountability,
not for a coat of paint.

---

## 3. Competitive frame

| Product | Model | Price (approx) |
|---|---|---|
| Streaks | One-time | $5 once |
| Productive | Subscription | ~$7/mo or $40/yr |
| Finch | Freemium | ~$9/mo premium |
| Habitica | Freemium + subscription | ~$5/mo |
| Way of Life | Freemium | one-time unlock |

The market clears around **$3–6/mo or $30–40/yr**, frequently with a
**lifetime** option used as a price anchor.

---

## 4. The options considered

### Option A — Freemium + single Premium tier (the long-term recommendation)
- **Free:** the 5 core practices, daily tracking, current streak, this-week
  stats, 1–2 custom practices, 7-day history.
- **Premium (~$4.99/mo or $39.99/yr; optional $79 lifetime as a decoy):**
  full history, monthly / all-time trends, streak calendar + streak freeze,
  reminders, unlimited custom practices, extra themes, data export, private
  accountability circles.
- **Reverse trial:** new users get Premium for 7 days, then fall back to Free.
  Converts noticeably better than a hard paywall.
- **Pros:** recurring revenue, aligns price with value (depth), simple to
  understand. **Cons:** needs enough Premium value to justify the bill.

### Option B — Accountability-led
- Free tracker; monetize **social accountability**: private circles and
  challenges with real stakes (commit money, forfeit if you miss).
- **Pros:** novel, high engagement, on-brand for "discipline." **Cons:**
  most to build, trust/payments-handling complexity, community moderation.

### Option C — One-time / Lifetime
- Pay once (~$30–80), no recurring billing.
- **Pros:** zero churn, simple, App-Store-friendly. **Cons:** lower lifetime
  value, no recurring revenue to fund ongoing hosting and development.

### Option D — Free now, monetize-ready  ✅ chosen near-term
- Do not charge yet. Ship the experience, give **coins and streaks a real
  purpose**, and architect feature-gating so a subscription (most likely
  Option A) can switch on later with minimal rework.
- **Pros:** grow first, learn what people value, avoid pricing a product
  nobody is retained on yet. **Cons:** revenue is deferred; requires
  discipline to build the gating seams now so the later switch is cheap.

---

## 5. Recommended value metric & tiers (for when monetization turns on)

**Value metric:** *depth* — history length, insight richness, customization
count, reminders, accountability. "The more serious you are about your
practice, the more the paid features matter."

**Two tiers only** (a consumer app does not need good-better-best):

| | Free | Premium |
|---|---|---|
| Core 5 practices + daily tracking | ✅ | ✅ |
| Current streak | ✅ | ✅ |
| Stats | This week | Monthly + all-time + trends |
| History | 7 days | Unlimited |
| Custom practices | 1–2 | Unlimited |
| Streak freeze | Earned with coins | Earned + monthly grant |
| Reminders / notifications | — | ✅ |
| Themes | Light / dark | Extra themes |
| Data export | — | ✅ |
| Accountability circles | — | ✅ |

**Price:** $4.99/mo or $39.99/yr (annual anchored, ~33% cheaper than monthly).
Optional **$79 lifetime** as a decoy that makes the annual plan feel sensible.
Charm pricing (`.99`) since this is value-focused, not luxury.

---

## 6. Coins & streaks (resolves "coins are meaningless")

Keep coins as **delight, not a paywall**:

- **Earn** coins through consistency (already implemented: milestone rewards).
- **Spend** coins on:
  - **Streak freeze** — a "skip token" that protects a streak when you miss a
    day (the Duolingo mechanic; the single highest-retention feature in this
    category).
  - **Cosmetic themes / accents.**
- This gives coins an obvious purpose without making the core feel
  pay-to-win, and it is fully compatible with a later Premium tier (Premium
  can *grant* freezes monthly while free users *earn* them).

**Streak** itself is the most motivating metric in habit apps and the data is
already tracked (active days). Free shows the current streak; Premium adds the
streak calendar and history.

---

## 7. How this maps to the in-app UX work

| UX item | Monetization-ready treatment |
|---|---|
| #4 Stats duplication | `/stats` becomes the deeper surface (future Premium home for trends/history); dashboard keeps only a compact summary. |
| #5 Leaderboard | Hidden / clearly "coming soon" now; later becomes paid accountability. |
| #7 Coins purpose | Streak-freeze + cosmetic sink, earnable free. |
| #10 Streak | Free basic streak now; Premium streak insights later. |

---

## 8. Rollout sequence

1. **Now (free):** ship the UX improvements; give coins and streak real
   purpose; keep the data model and feature checks gating-ready.
2. **Instrument:** track activation (first practice logged), D1/D7/D30
   retention, streak length distribution, custom-practice usage, stats views.
3. **When retention is healthy** (e.g. D30 retention and streak length show a
   committed core): turn on Premium (Option A) with a reverse trial.
4. **Iterate price** with a Van Westendorp survey once there is a user base to
   ask.

---

## 9. Metrics to watch

- **Activation:** % of new users who log a practice on day 1.
- **Retention:** D1 / D7 / D30; this is the gate for monetizing.
- **Engagement depth:** average streak length, custom practices per user,
  stats-page views per week.
- **Later (paid):** free→paid conversion (target ~2–5% self-serve consumer),
  trial→paid, monthly churn (<5% is healthy for consumer), ARPU, LTV.

---

## 10. Risks & honest caveats

- **Do not monetize before retention exists.** Charging for a product people
  do not return to just caps growth and teaches you nothing.
- **Premium must clear the "is it worth $40/yr?" bar.** History + reminders +
  trends + accountability together can; any one alone probably cannot.
- **Coins must not feel grubby.** The moment coins gate core tracking, the
  "honest discipline" positioning breaks. Keep them delight-only.
- **Web billing reality:** Stripe for web is straightforward; if this ever
  becomes a native app, App Store / Play take a 15–30% cut and constrain
  external-payment messaging.

---

*This is a sketch to align on direction, not a committed plan. The chosen path
is to build free and monetize-ready, with Freemium + Premium (Option A) as the
most likely eventual model.*
