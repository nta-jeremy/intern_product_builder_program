# YODY Design System — Review &amp; Upgrade Recommendations

> Companion to `Review.html` (the visual version). Same content, dev-shareable markdown.
> Reviewed system: **v2026.05 · Light Hightech** &middot; Audit date: 2026-05-24

---

## 0 · Verdict (one paragraph)

Foundation is **solid**. Token discipline, content tone, and the 9-principle spine are above industry average. But the system is **scope-bound to a single internal portal (ITDX EA)** and has three structural issues — **font sprawl**, **logo divergence**, **scope gap** — that need to be locked before adding a second UI kit.

---

## 1 · At a glance

| Dimension          | Score / count | Note                                                                      |
| ------------------ | ------------- | ------------------------------------------------------------------------- |
| Token coverage     | 82 %          | Color · type · spacing · radii · shadow done. Gaps: motion, focus, viz.   |
| Preview cards      | 18            | Strong specimen library. Missing: form, table, empty, error.              |
| Font families      | 6             | Above the system's own "no font #6" line.                                 |
| UI kits shipped    | 1 / 4         | ITDX only. Commerce / retail / marketing not represented.                 |
| Vietnamese support | ★★★★★         | Be Vietnam Pro self-hosted + Inter VN subset.                             |
| Accessibility      | ★★☆☆☆         | No focus-ring token, no tap-min token, motion-reduce in prose only.       |

---

## 2 · Five things to preserve

1. **9-principle enforcement spine** — Claim → evidence → conclusion · Roman numerals · insight callout · 1 ambient motion. This is IA discipline, not a style guide.
2. **Vietnamese-first typography** — Be Vietnam Pro self-hosted (full weight range) + Inter VN subset. No UI font without diacritic support.
3. **Content tone discipline** — Bilingual default (VN labels + EN tech terms), sentence case, no emoji, no exclamation. Executive voice.
4. **Semantic accent palette** — 4 accents × 1 role each (iris · gold · mint · rose), each with `-deep` + `-tint`. Reserve rules are codified.
5. **Light hightech aesthetic** — White-dominant surfaces, iris-tinted shadows (never neutral black), ≥19px body for projector legibility. This is *positioning*, not skin.
6. **Drill-down = right-side slide-in panel** — One enforced rule across all views. Prevents page thrash.

---

## 3 · Structural risks (prioritised)

### P0 — Critical (block v2 work until fixed)

**I · Scope gap.** System serves only the **ITDX internal portal**. YODY is a 274-store fashion retail brand; `yody.vn` commerce, mobile app, in-store signage, marketing surfaces are not represented. Every token / rule / kit is executive-portal-shaped.
**Fix.** Split into 3 layers: (a) Foundations — logo, color, type, motion. (b) ITDX library — KPI / domain / insight / panel. (c) Commerce library — product card / size selector / cart / lookbook. Rename root scope.
**Effort.** ~3 weeks.

**II · Font sprawl.** Six families loaded (Inter, Be Vietnam Pro, Montserrat, Playfair Display, JetBrains Mono, Dancing Script). DESIGN.md §3.2 explicitly says "no font #6". Inter ↔ Be Vietnam Pro overlap; Dancing Script isn't used in any shipped UI.
**Fix.** Drop to 4: **Be Vietnam Pro** (body + brand chrome — supersedes Inter, no separate VN subset), **Montserrat** (display + numerals), **Playfair italic** (1 hero moment), **JetBrains Mono** (technical). Drop Inter + Dancing Script.
**Effort.** ~1 week (audit usage, refactor `colors_and_type.css`, re-test previews).

**III · Logo divergence.** Master YODY logo is **navy "yo" + white "dy" on gold square** — recognisable, distinctive. System invents a separate **28×28 navy→iris gradient tile + Quicksand "yody·id" wordmark**. Two identities competing in the same brand.
**Fix.** Ground all lockups in the master logo: header tile = gold square + navy "y"; wordmark uses actual YODY letterform, not Quicksand derivation; "·id" stays as product-line modifier but in the system's primary face.
**Effort.** ~4 days.

### P1 — Important (block second UI kit)

**IV · Source-of-truth conflict.** README says "Inter-led" and "BUILD = navy". DESIGN.md says "5-font composition with Be Vietnam Pro for brand chrome" and "BUILD = iris #7c6cf5". Definitions diverge, not interpretations.
**Fix.** DESIGN.md is canonical (it explicitly says so). Rewrite README §VISUAL FOUNDATIONS to match.
**Effort.** ~0.5 day.

**V · Data-viz tokens missing.** DESIGN.md mentions D3 donut, bar, mindmap, roadmap, org chart. UI kit README admits these are out-of-scope. CSS has no `--chart-*` palette. Devs will pick ad-hoc colors and break discipline.
**Fix.** Ship 3 chart palettes — sequential (mist → iris-deep, 5 steps), categorical (8-color, brand-rooted), diverging (gap → fg-3 → mint). Add 5 chart specimen cards.
**Effort.** ~1 week.

**VI · Component coverage thin at the input layer.** No text input, textarea, select, checkbox, radio, toggle, search bar, date picker, modal, toast, tooltip, table, empty-state, error-state, loading-skeleton. Any real portal touches all of these.
**Fix.** Spec 10 more components with the same card-DNA. 8 input controls + table + empty/error.
**Effort.** ~2 weeks.

### P2 — Nice (clean upgrades)

**VII · No dark theme.** Only `--bg-ink` for rare hero/footer. No dark mirror for fg-1/2/3, border, shadow, accent-tint. Low-light meeting rooms will be glaring.
**Fix.** Mirror tokens into `[data-theme="dark"]`. Surfaces + ink flip; accents stay branded.
**Effort.** ~1 day.

**VIII · Accessibility tokens missing.** No `--focus-ring`, no `--tap-min`, no `.no-motion` utility. Reduced-motion rule is prose, not enforceable.
**Fix.** Add `--focus-ring`, `--focus-ring-gold`, `--tap-min: 44px`, util class. Document.
**Effort.** ~0.5 day.

**IX · Narrative coupling.** Year-tone mapping (2026=mint…2030=gold) and "5 chặng Roman numerals" live in DESIGN.md §1 + §4.4. If strategy shifts (e.g. IPO delay), half the system becomes stale.
**Fix.** Extract `NARRATIVE.md` — IPO mapping, year cards, Roman numeral list. Keep DESIGN.md narrative-free.
**Effort.** ~0.5 day.

---

## 4 · Upgrade roadmap (6 weeks → v2.0)

### Phase 01 — Lock foundation (week 1–2)

Fix all P0 risks. No new components. Goal: docs + tokens self-consistent.

- [ ] Drop Inter + Dancing Script from font stack
- [ ] Re-base header lockup on master YODY logo
- [ ] Rewrite README §VISUAL FOUNDATIONS to match DESIGN.md
- [ ] Extract `NARRATIVE.md` from DESIGN.md
- [ ] Add `--focus-ring`, `--tap-min`, `--motion-*` tokens
- [ ] **Ship: `colors_and_type.css v2.0` + README v2.0**

### Phase 02 — Fill component gap (week 3–4)

Make the system wide enough to build any ITDX screen end-to-end.

- [ ] 8 form controls + table + empty/error states
- [ ] 3 chart palettes + 5 chart specimen cards
- [ ] Dark theme mirror tokens
- [ ] Vendor 30 most-used Lucide SVGs offline into `assets/icons/`
- [ ] Motion tokens (enter / exit / hover / press)
- [ ] **Ship: ITDX UI kit v2 with chart pages + form pages**

### Phase 03 — Open consumer scope (week 5–6)

Build the second UI kit. Test that foundations (locked in phase 1) hold across consumer surfaces.

- [ ] Spec `ui_kits/yody-commerce/`
- [ ] Product card, size selector, cart drawer
- [ ] Lookbook hero, store locator form
- [ ] Photography style guide (warm tones, natural light, VN context)
- [ ] QA: same tokens, two aesthetic outputs
- [ ] **Ship: YODY Commerce UI kit v1 + bilingual brand book**

---

## 5 · Concrete diffs (copy-paste ready)

### A · Consolidate font stack

```diff
- --font-body: 'Inter', system-ui, sans-serif;
- --font-script: 'Dancing Script', cursive;
+ --font-body: 'Be Vietnam Pro', system-ui, sans-serif;
// Dancing Script removed — no usage
```

Trim the Google Fonts import:

```diff
- @import url('…&family=Inter…&family=Dancing+Script…');
+ @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### B · Add chart palette tokens

```css
/* Sequential — maturity, score, depth */
--chart-seq-1: #ecedf8;
--chart-seq-2: #c5c1f0;
--chart-seq-3: #9d94e8;
--chart-seq-4: #7c6cf5;
--chart-seq-5: #4a4bc8;

/* Categorical — TOGAF domain, platform, owner */
--chart-cat-1: var(--brand);
--chart-cat-2: var(--iris);
--chart-cat-3: var(--mint);
--chart-cat-4: var(--rose);
--chart-cat-5: var(--gold);
--chart-cat-6: #fb923c;   /* coral */
--chart-cat-7: #64748b;   /* slate */
--chart-cat-8: #14b8a6;   /* teal */

/* Diverging — variance, sentiment, gap-vs-target */
--chart-div-neg: var(--gap);
--chart-div-mid: var(--fg-3);
--chart-div-pos: var(--mint);
```

### C · Accessibility + motion tokens

```css
/* Accessibility */
--focus-ring:       0 0 0 3px rgba(124,108,245,0.40);
--focus-ring-gold:  0 0 0 3px rgba(252,175,22,0.45);
--focus-ring-gap:   0 0 0 3px rgba(239,68,68,0.40);
--tap-min: 44px;

/* Motion choreography */
--motion-enter:  250ms cubic-bezier(.34, 1.56, .64, 1);
--motion-exit:   180ms cubic-bezier(.4, 0, .2, 1);
--motion-hover:  150ms cubic-bezier(.4, 0, .2, 1);
--motion-press:  80ms ease-out;

/* Utility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

### D · Dark theme mirror

```css
[data-theme="dark"] {
  --bg:        #0e0f24;
  --bg-2:      #16175a;
  --bg-muted:  #1f2046;
  --fg-1:      #f4f5fb;
  --fg-2:      #c5c8e0;
  --fg-3:      #8a8db0;
  --border:        #2a2c5a;
  --border-light:  #1f2046;
  --border-hover:  #3c3e72;
  /* shadows lighten */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.35);
  --shadow:    0 2px 6px rgba(0,0,0,0.40);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.45);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.55);
  /* accents pass through unchanged — iris stays iris, gold stays gold */
}
```

---

## 6 · Things explicitly **not** changed

To save the reviewer reading time, here are deliberate non-changes:

- **Brand navy `#2a2b86`** stays — it's the master anchor.
- **9-principle spine** stays untouched — best part of the system.
- **Insight callout pattern** stays — discipline > variety.
- **Status palette (LIVE/BUILD/GAP/PLAN)** stays — names + colors + reserve rules all good.
- **JetBrains Mono for technical anchors** stays.
- **Side-panel drill-down rule** stays.
- **4px spacing base** stays.
- **`--shadow-*` purple tint** stays — important brand cohesion signal.

---

## 7 · Open questions for the team

1. **IPO timeline.** Is 2030 still the firm target? Affects narrative coupling fix (P2).
2. **Consumer brand integration.** Should `yody.vn` and the shopping app share this system, or have their own? Affects scope split (P0-I).
3. **Vietnamese-only or bilingual?** Current system enforces bilingual UI; commerce surfaces may be VN-only.
4. **Master logo source files.** Do we have `.ai` / `.svg` of the YODY wordmark? Needed for the lockup re-base (P0-III).
5. **Dark theme demand.** Is anyone actually using the portal in low-light rooms, or is this purely defensive? Affects P2 priority.

---

**Last updated** 2026-05-24 &middot; **Reviewer** ITDX Design Council
