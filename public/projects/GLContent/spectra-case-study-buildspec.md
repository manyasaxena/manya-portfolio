
# Spectra — Portfolio Case Study Build Spec

**How to read this:** each section is a stack of typed content blocks. Block types tell Claude Code what to render:
`[HERO]` `[STAT-VIZ]` `[BUBBLE]` `[PULL-QUOTE]` `[CARD-ROW]` `[IMAGE]` `[SPLIT]` `[DEMO]`.
Copy is final — keep it tight, don't pad it back into paragraphs. Bolded phrases should render as visually emphasized (color or weight) within their block. Match the visual language of the Haven case study (big colored stat numbers, floating text bubbles, generous whitespace, soft cards).

---

## SECTION 0 — Hero

`[HERO]`
- **Eyebrow:** GLOBALLOGIC (orange) · Product Case Study
- **Title:** Spectra: Building an AI Wellness Product 0-to-1
- **Subtitle (italic):** Taking a wellness platform from a napkin thesis to a working, data-fed prototype — and learning to build like a team of one with agentic AI.
- **Metadata row (3 columns):**
  - TIMELINE — 5 Weeks · Summer 2026
  - ROLE — AI Product Intern · Design, Prototyping & Agentic Backend
  - COMPANY — GlobalLogic, a Hitachi company

`[IMAGE]` → **Spectra hero/logo slide** (the prism-heart title slide). Full-bleed or framed card under the hero.

---

## SECTION 1 — The Problem

`[PULL-QUOTE]` (large, centered, the thesis in one breath)
> **We're drowning in metrics and starving for insight — and doing it alone.**

`[BUBBLE]` Ask someone how they're doing and you get one word — *"good"* — while their phone stacks up notifications from apps that **don't talk to each other.**

`[IMAGE]` → **"How are you?" / "..Good." slide** (the four app icons with unread badges). Place directly beside or under the bubble above — it *is* the visual punchline.

`[STAT-VIZ]` — three animated stat modules in a row (mirror Haven's big-number treatment):
| Stat | Label | Suggested viz |
|------|-------|---------------|
| **45%** | admit they feel **burnt out** from manually feeding dashboards | radial progress ring, fills on scroll |
| **6 apps** | the average person juggles to track basic wellness | count-up number in a dashed circle |
| **4.1 days** | mean engagement before users quietly quit *(Stanford)* | radial ring or short decay curve |

`[BUBBLE]` The tools don't fail at data — **they fail at meaning, and at each other.**

`[CARD-ROW]` — competitive teardown, 3 cards (reuse "The Current Landscape" slide content):
- **Apple Health** — *Strength:* trusted passive aggregation. *Pitfall:* **hoards numbers with no context**, only speaks up when something drops into a danger zone.
- **Strava** — *Strength:* unmatched workout tracking. *Pitfall:* a **high-pressure athletic feed** that ignores sleep, nutrition, and mindfulness.
- **Whoop / Oura** — *Strength:* deep biometrics. *Pitfall:* seals you in a **private data silo**, cut off from the people you live alongside.

`[IMAGE]` (optional) → **"The Current Landscape" slide** if you'd rather show the slide than rebuild it as cards. Pick one, not both.

`[PULL-QUOTE]`
> Humans are social creatures. **Why are we doing wellness alone?**

`[BUBBLE]` (framing the bet + HMW)
Spectra's bet: the missing layer isn't more tracking — it's **synthesis and company.**
Two questions drove everything:
**How might we turn isolated wellness silos into shared spaces of growth?**
**How might we move users from tracking data to uncovering insight?**

---

## SECTION 2 — Research & Discovery

`[SPLIT]` — persona layout (image left, text right), reuse the "Meet Sam" slide:
`[IMAGE]` → **"Meet Sam" persona slide** (or just her portrait + stat tags).

Text side:
- **Meet Sam** — 37, project manager & mother of two, NYC. Hectic, fast-paced.
- **Quote bubble:** *"My apps give me plenty of numbers, but they leave me completely out of the loop."*
- **Goals:** balance fitness, nutrition & connection **without burnout**; stay bonded to family and peers.
- **Frustrations:** fragmented, sterile data; a creeping sense of disconnection.

`[BUBBLE]` Mapping the landscape against Sam made the whitespace obvious: every player was **strong on one axis, blind to the rest** — and all of them treated wellness as a **solo, quantified performance.** The opening wasn't to out-track anyone. It was to be the layer that **reads across the data and folds people back in.**

---

## SECTION 3 — Ideation: The Five-Axis Model

`[BUBBLE]` The core move: reframe wellness from **scores to be maxed** into **five spheres to be understood.** On each, the AI does two jobs — say **how you're doing in plain language,** then hand you **one specific action** to do better.

`[IMAGE]` → **"The New Value Capture" slide** (the prism-heart with five colored rays). Use as the visual anchor for this section.

`[CARD-ROW]` — five axis cards, each keyed to its Spectra color (Movement red, Nutrition orange, Restoration blue, Mindfulness green, Connection yellow):
- **Movement** — consistency over rigid step goals *(Sedentary Fragmentation Index)*
- **Nutrition** — dietary patterns over calorie math *(Nutritional Density Index)*
- **Restoration** — deep-sleep architecture + recovery over time-in-bed
- **Mindfulness** — attention fragmentation & screen friction vs. a daily mental battery
- **Connection** — **no score at all** *(qualitative by design)*

`[PULL-QUOTE]` (the design-personality line — make it a highlight)
> The boldest call was leaving Connection **unscored.** Gamify belonging and you break it.
> **Your circle, in feelings — never numbers.**

---

## SECTION 4 — Building the Prototype (with agentic AI)

`[BUBBLE]` The real lesson was operational: **how to build like a team of several when you're a team of one.** The prototype outgrew static mockups — so I built it.

`[SPLIT]` — two stacked build blocks (add a screen-recording GIF or screenshot beside each if you have one):

**Frontend**
Generated and iterated in **Lovable/Fable**, exported as **React components** for local dev. Centerpiece: a full reimagining of the Home tab into a **"Carousel of Light"** — a rotating ring of your circle with a magnifying-glass focus curve; tap a friend and the whole dashboard flips from *your* stats to a **no-numbers glimpse of theirs.**
`[IMAGE]` → **Carousel of Light** screenshot or screen-capture GIF.

**Backend**
Scaffolded a **mock Node / Express** backend with **Claude Code** for the multi-file, terminal-driven work — a **fully offline dev environment** serving structured test data. Included:
- a **formula engine** for all four scored axes
- a `safeDiv` helper so edge cases return **clean zeros, not NaN**
- a rule-based **AI daily-synthesis generator**
- **five stress-test personas** — desk-bound PM, midnight doomscroller, social explorer, recovered athlete, and an empty **zero-biometric** case

`[BUBBLE]` (honesty callout — style as a small tinted note)
**Honest status:** a working prototype on mock data. The architecture is built so swapping in **real wearable and phone sources is a data-layer change, not a rebuild.**

`[DEMO]` → **Interactive demo / walkthrough embeds here.**

---

## SECTION 5 — Where It Landed & What's Next

`[PULL-QUOTE]`
> The highest-value thing an AI wellness product can do isn't collect one more metric — it's **read across all of them, say something true and human, and put your people back in the frame.**

`[BUBBLE]` **What shifted in how I work:** orchestrating agentic tools — a generated frontend, a scaffolded backend, a persona-driven test harness — turned **"0-to-1" from an aspiration into a repeatable process.**

`[CARD-ROW]` — "What's next," 3 short cards:
- **Go live** — real wearable & phone integrations past mock data.
- **Validate** — test the five-axis model with real users like Sam; does qualitative framing actually cut the burnout?
- **Pressure-test the bold call** — keep Connection unscored, and prove an **unquantified social layer** does what a leaderboard never could.

---

## Global build notes for Claude Code
- **Palette:** carry Spectra's prism colors as the accent system (Movement red, Nutrition orange, Restoration blue, Mindfulness green, Connection yellow); soft lavender/ivory washes like the slides.
- **Stat numbers:** big, serif or bold display weight, in a saturated accent color (Haven used deep blue) — animate count-up / ring-fill on scroll into view.
- **Bubbles:** rounded, soft-shadow cards, one idea each, plenty of air between them — never a wall of text.
- **Bolded phrases** inside blocks = the scannable spine of the page; someone skimming only the bold should still get the whole story.
- **Image slots** marked `[IMAGE]` map to existing pitch slides you already have — drop them in; `[DEMO]` is the one live embed you'll add yourself.
