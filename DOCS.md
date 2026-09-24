# Startup Conclave '26 — Website Documentation

> **Repo:** [1767srishtisingh-web/startupconclave](https://github.com/1767srishtisingh-web/startupconclave)  
> **Stack:** Plain HTML · CSS · Vanilla JavaScript · No build step · No backend  
> **Live:** GitHub Pages from `main` branch, root directory

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Run Locally](#2-run-locally)
3. [Deploy / Push Changes](#3-deploy--push-changes)
4. [Page Sections Reference](#4-page-sections-reference)
5. [JavaScript Features](#5-javascript-features)
6. [CSS Files](#6-css-files)
7. [Images & Assets](#7-images--assets)
8. [Common Edits Cheatsheet](#8-common-edits-cheatsheet)

---

## 1. Project Structure

```
startupconclave/
├── index.html          ← All page sections (single-page site)
├── style.css           ← Main styles, themes, responsive rules
├── poster-theme.css    ← Cinematic dark overlay for poster sections
├── script.js           ← All interactions (countdown, form, nav, tabs, etc.)
├── DOCS.md             ← This documentation file
├── Readme.md           ← Developer readme
└── images/
    ├── conclave-poster.png   ← Official event poster (ACTIVE)
    ├── conclave-poster.jpg   ← Old poster (kept for backward compat / OG tag)
    ├── conclave-logo.jpg     ← Event logo (header, about, footer, pass card)
    ├── favicon.png           ← Browser tab icon
    ├── logo.png              ← Alt logo copy
    └── reg-qr.png            ← Registration QR code (update when QR is ready)
```

> This is a **single-page application** — all sections live in one `index.html`.  
> Navigation links use anchor hashes (`#about`, `#schedule`, etc.) to scroll to sections.

---

## 2. Run Locally

No build step required. Just open `index.html` in a browser:

```bash
# Option A: Double-click index.html in File Explorer

# Option B: VS Code → Right-click index.html → "Open with Live Server"

# Option C: Python quick server
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## 3. Deploy / Push Changes

```bash
# 1. Make edits to index.html / style.css / script.js / images/

# 2. Stage all changes
git add -A

# 3. Commit with a clear message
git commit -m "Describe your change here"

# 4. Push — GitHub Pages auto-deploys in ~1–2 minutes
git push origin main
```

---

## 4. Page Sections Reference

This site has **19 sections** in one `index.html` file. They appear in this order:

| # | Section | ID / Selector | Purpose |
|---|---------|---------------|---------|
| 1 | HEAD (meta) | `<head>` | SEO, fonts, theme init |
| 2 | HEADER | `.site-header` | Sticky nav bar |
| 3 | HERO | `#home` | First screen — poster, title, CTAs |
| 4 | QUOTE STRIP | `.quote-strip` | Philosophy tagline band |
| 5 | EVENT JOURNEY | `#event-journey` | Expandable 7-step waterfall |
| 6 | ABOUT | `#about` | Why Attend + 6 opportunity pillars |
| 7 | HIGHLIGHTS | `#highlights` | 4 core event pillars (cards) |
| 8 | FUNDING BAND | `.funding` | Prize pool display band |
| 9 | HOW IT WORKS | `#how-it-works` | 8-step process guide |
| 10 | SCHEDULE | `#schedule` | Full 2-day itinerary with tabs & filters |
| 11 | PARTICIPATE | `#ways-to-join` | Exhibition vs Pitching cards + how to register |
| 12 | VENUE | `#venue` | Location, timings, map |
| 13 | REGISTER | `#register` | Registration form |
| 14 | TERMS | `#terms` | 12 rules & guidelines |
| 15 | FAQ | `#faq` | 6 expandable questions |
| 16 | CONTACT | `#contact` | Coordinator cards + social links |
| 17 | BOTTOM CTA | `.bottom-register-cta` | Final register push before footer |
| 18 | FOOTER | `.site-footer` | Nav, newsletter, copyright |
| 19 | POSTER MODAL | `[data-poster-modal]` | Lightbox dialog for the event poster |

---

### 4.1 HEAD — Meta & Fonts

**Lines:** 1–31

Contains:
- `<title>` and `<meta name="description">` — used by Google and WhatsApp/Twitter previews
- Open Graph tags (`og:title`, `og:description`, `og:image`) for social link previews
- Browser theme color (`#080E1C`)
- Google Fonts: **Archivo** (body), **Bebas Neue** (display headings), **Inter** (UI)
- Stylesheet links: `style.css` → `poster-theme.css`
- Inline script: applies saved theme before first paint (prevents flash of wrong theme)

**Edit to update:**
| Task | Tag to edit |
|------|-------------|
| Page title | `<title>` |
| SEO description | `<meta name="description" content="...">` |
| Social share image | `<meta property="og:image" content="...">` |
| Favicon | `<link rel="icon" href="...">` |

---

### 4.2 HEADER — Navigation Bar

**Lines:** 35–73 · **Classes:** `.site-header`, `.main-nav`, `.nav-list`, `.header-actions`

Contains:
- **Brand logo + name** linking to `#home`
- **Nav links** (10 items): About · Highlights · Journey · Schedule · Participate · Venue · Terms · FAQ · Contact · **Register** (accent coloured via `.nav-register-link`)
- **"See More ↓"** ghost button → `#about`
- **Dark/Light theme toggle** (moon ↔ sun icon)
- **Hamburger button** — mobile only, toggles the nav drawer

**JS behaviour:**
- Gains `.is-scrolled` after 8px scroll → shadow/background appears
- Active nav link highlighted via `IntersectionObserver`
- Mobile nav closes on outside click or Escape key

**Edit to update:**
- **Add nav link:** `<li><a class="nav-link" href="#section-id">Label</a></li>`
- **Remove nav link:** Delete the `<li>` element
- **Change logo:** Replace `images/conclave-logo.jpg`

---

### 4.3 HERO — Landing Section

**Lines:** 77–127 · **ID:** `#home`  
**Classes:** `.hero`, `.hero-grid`, `.hero-copy`, `.hero-title`, `.hero-actions`, `.hero-facts`, `.hero-poster`

Contains:
- **Left — copy:** Presenter line, main title, tagline, lede paragraph
- **Buttons:**
  - `Explore the Event ↓` (primary) → `#about`
  - `See Itinerary` (ghost) → `#schedule`
- **Fact bar:** Prize Pool · Dates · Venue · Registration Countdown
- **Right — poster:** `images/conclave-poster.png` (clickable → opens lightbox modal)
- **Figcaption:** *"📌 QR code will be updated soon with the official registration link."*

**Edit to update:**
| Task | Location |
|------|----------|
| Update poster | Replace `images/conclave-poster.png` |
| Remove QR note | Delete or edit `<figcaption>` text |
| Change prize amount | Edit `<dd>` under `<dt>Prize Pool</dt>` |
| Change dates | Edit `<dd>` under `<dt>Dates</dt>` |
| Registration deadline countdown | `DEADLINE` in `script.js` line 8 |

---

### 4.4 QUOTE STRIP — Philosophy Band

**Classes:** `.quote-strip`, `.quote-kicker`, `.quote-keywords`, `.quote-text`, `.quote-closing`

Contains:
- Kicker: *"From a Thought → to a Possibility → to a Venture"*
- Keywords: IDEATE · CONNECT · SHOWCASE · PITCH · GROW
- Blockquote: *"Big ventures often begin with one small idea..."*

**Position:** Immediately after the hero — the first thing users see when scrolling.  
**No JS dependency.** Edit text directly in HTML.

---

### 4.5 EVENT JOURNEY — Expandable Waterfall

**ID:** `#event-journey`  
**Classes:** `.event-journey`, `.journey-waterfall`, `.journey-step`, `.journey-step-header`, `.journey-step-body`

Contains: 7 expandable steps using native HTML `<details>/<summary>` (no JS needed):

| Step | Label | Open by default? |
|------|-------|-----------------|
| 01 | Register | ✅ Yes |
| 02 | Learn | No |
| 03 | Connect | No |
| 04 | Exhibit | No |
| 05 | Pitch | No |
| 06 | Get Feedback | No |
| 07 | Scale 🚀 | No |

**Edit to update:**
- **Add a step:** Copy a `<li><details>...</details></li>` block, update the number, label, and `<p>` description
- **Open by default:** Add `open` attribute to `<details class="journey-step">`
- **Change step description:** Edit the `<p>` inside `.journey-step-body`

---

### 4.6 ABOUT — Why Attend / Opportunities

**ID:** `#about` · **Classes:** `.about`, `.about-grid`, `.pillars`, `.pillar`

Contains:
- Heading, intro text, event logo image (left)
- 6 opportunity pillars (right), each with emoji, title, and description:
  1. 🏆 ~₹50,000 Prize Pool
  2. 🌱 Pre-Incubation Opportunity
  3. ⚖️ IPR Guidance
  4. 💰 Seed-Funding Opportunities
  5. 🎤 Take The Stage
  6. 🌐 Meet The Ecosystem

**Edit:** Pillar colour set via `style="--pillar: var(--amber)"`. Available tokens: `--amber`, `--green`, `--blue`, `--red`, `--poster-blue-lt`, `--poster-green`.

---

### 4.7 HIGHLIGHTS — Core Event Pillars

**ID:** `#highlights` · **Classes:** `.highlights`, `.highlights-grid`, `.highlight-card`

Contains: 4 feature cards:
1. 🎙️ Speakers & Keynotes
2. 💡 Pitch Ideas
3. 🤝 Networking
4. 🎪 Startup Exhibition

**Edit:** Update `<h3>`, `<p class="highlight-main">`, `<p class="highlight-sub">` in each card.

---

### 4.8 FUNDING BAND — Prize Display

**Classes:** `.funding`, `.funding-grid`, `.funding-amount`, `.store-list`

Contains: Dark band with large `~₹50,000` display + 4 "what's in store" items.  
**Edit:** Change prize amount in `<h2 id="funding-title">` and update store list `<li>` items.

---

### 4.9 HOW IT WORKS — 8-Step Guide

**ID:** `#how-it-works` · **Classes:** `.steps-grid`, `.step-card`, `.experience-strip`

Contains: 8 numbered step cards + 6-bullet experience strip below.

**Edit:** Update `<h3>` and `<p>` inside each `.step-card`. Step numbers are static text.

---

### 4.10 SCHEDULE — Complete Itinerary

**ID:** `#schedule`  
**Classes:** `.schedule`, `.day-tabs`, `.day-tab`, `.chip-group`, `.chip`, `.day-panel`, `.timeline`, `.session`

Contains:
- **Day tab switcher** (keyboard accessible, ARIA roles): Day 1 / Day 2
- **Session filter chips:** All · Talks & Sessions · Exhibition & Pitch · Workshops · Networking
- **"Add to Calendar"** button per day (generates `.ics` file via JS)
- **Timeline lists** with sessions for both days — all in 12-hour AM/PM format

**Day 1 sessions:**
| Time | Session | Type |
|------|---------|------|
| 9:00 AM – 10:00 AM | Registration & Welcome Kit Distribution | `network` |
| 10:00 AM – 10:30 AM | Inaugural Ceremony & Lamp Lighting | `talk` |
| 10:30 AM – 11:15 AM | Keynote Address: "Building Scalable Startups in Emerging India" | `talk` |
| 11:15 AM – 11:30 AM | Tea Break & Networking | `network` |
| 11:30 AM – 12:45 PM | Expert Ecosystem Session: "Startup Ecosystem & Funding Landscape in UP" | `talk` |
| 12:45 PM – 1:30 PM | Founder Talk: "From Idea to Market: Lessons from the Trenches" | `talk` |
| 1:30 PM – 2:15 PM | Lunch Break | `network` |
| 2:15 PM – 5:30 PM | Startup Exhibition & Mentor Walkthrough | `pitch` |
| 3:30 PM – 5:00 PM | Parallel Workshop: Incubation & Technology Commercialization | `workshop` |
| 5:30 PM – 6:00 PM | Day 1 Wrap-up & Announcements | `talk` |

**Day 2 sessions:**
| Time | Session | Type |
|------|---------|------|
| 10:00 AM – 11:00 AM | IPR & Startup Protection Strategies | `workshop` |
| 11:00 AM – 11:15 AM | Tea Break | `network` |
| 11:15 AM – 1:00 PM | Investor / VC Roundtable Interaction | `talk` |
| 1:00 PM – 1:45 PM | Lunch Break | `network` |
| 1:45 PM – 3:30 PM | Startup Pitching Competition | `pitch` |
| 3:30 PM – 4:15 PM | Jury Evaluation & Feedback Session | `talk` |
| 4:15 PM – 5:00 PM | Award Ceremony & Winner Recognition | `talk` |
| 5:00 PM – 5:30 PM | Closing Remarks & Vote of Thanks | `talk` |

**To add a session:**
```html
<li class="session" data-type="talk">
  <time>10:00 AM – 11:00 AM</time>
  <div>
    <h4>Session Title Here</h4>
    <p>Brief description of the session.</p>
  </div>
  <span class="tag tag-talk">Label</span>
</li>
```
`data-type` must be one of: `talk` · `pitch` · `workshop` · `network`

---

### 4.11 WAYS TO PARTICIPATE

**ID:** `#ways-to-join` · **Classes:** `.ways`, `.participate-grid`, `.reg-instructions-box`

Contains:
- **2 participation cards:** Startup Exhibition · Startup Pitching Competition
- **6-step How to Register guide** in a styled box

**Edit:** Update card descriptions and step list items directly in HTML.

---

### 4.12 VENUE — Location & Map

**ID:** `#venue` · **Classes:** `.venue`, `.venue-grid`, `.detail-list`, `.map-frame`

Contains: Details list (dates, timings, address, prizes, food, deadline) + Google Maps iframe.

**Edit:**
| Task | Where |
|------|-------|
| Change address | `<dd>` under `<dt>Location</dt>` |
| Update map | `<iframe src="...">` — change Google Maps query URL |
| Update directions link | `<a href="https://www.google.com/maps/dir/?...">` |

---

### 4.13 REGISTER — Registration Form

**ID:** `#register` · **Classes:** `.register`, `.register-grid`, `.register-aside`, `.register-card`, `.reg-form`  
**JS:** Fully managed by `script.js` — validation, pass generation, state management

**Left aside:** Countdown timer + Free Entry badge + poster thumbnail  
**Form fields:** Full name · Joining as (Student/Startup/Innovator/Entrepreneur) · Year of study (students only) · Email · Mobile · College/Org · Pass type · Exhibition track · Pitching track · Terms agreement

**Three states:**
| State | When shown |
|-------|-----------|
| Form visible | Before deadline & not yet registered |
| Success state | After successful form submission — shows generated pass card |
| Closed state | Auto-shown after 10 October 2026 deadline |

**Key config in `script.js`:**
```js
// Line 8 — Change registration deadline:
var DEADLINE = new Date('2026-10-10T23:59:59+05:30');

// Line 15 — Connect to real form backend (e.g. Formspree):
var FORM_ENDPOINT = 'https://formspree.io/f/your-form-id';
```

---

### 4.14 TERMS — Rules & Guidelines

**ID:** `#terms` · **Classes:** `.terms`, `.terms-list`

Contains: 12 numbered rules covering eligibility, IP ownership, jury decisions, code of conduct, etc.

**Edit:** Add/remove `<li>` items in `.terms-list`.

---

### 4.15 FAQ — Frequently Asked Questions

**ID:** `#faq` · **Classes:** `.faq`, `.faq-list`, `.faq-item`

Contains: 6 expandable FAQ items using `<details>/<summary>`.

**To add a FAQ:**
```html
<details class="faq-item">
  <summary>Your question here?</summary>
  <p>Your answer here.</p>
</details>
```

---

### 4.16 CONTACT — Team Coordinators

**ID:** `#contact` · **Classes:** `.contact`, `.contact-grid`, `.contact-card`, `.avatar`

Contains: 3 coordinator cards + 1 social links card.

| Person | Phone/Email |
|--------|-------------|
| Krishna Goel | +91 95487 08361 |
| Preet Sain | +91 79827 56664 |
| Divi Shrivastava | idealab@akgec.ac.in |

Social: Instagram `@akgec_idealab` · Email `idealab@akgec.ac.in` · Website `akgec.ac.in`

**To update a coordinator:**
```html
<li class="contact-card">
  <span class="avatar avatar-sm" style="--avatar: var(--blue)">KG</span>
  <div>
    <p class="contact-name">Name</p>
    <p class="contact-role">Role</p>
    <a class="contact-link" href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a>
  </div>
</li>
```

---

### 4.17 BOTTOM REGISTER CTA

**Classes:** `.bottom-register-cta`, `.bottom-cta-actions`

Full-width gradient section just before the footer. Catches users who scrolled the whole page.  
Contains: Kicker · Heading · Description · "Register Now — It's Free" (primary) + "View Full Schedule" (ghost)

---

### 4.18 FOOTER

**Classes:** `.site-footer`, `.footer-grid`, `.footer-brand`, `.footer-nav`, `.footer-news`, `.footer-bottom`

Contains: Brand column · Nav links mirror · Newsletter signup form · Copyright + "Back to top" link.

> **Newsletter form** runs in preview mode — stores email in `localStorage` and shows a toast. To receive real signups, connect to Mailchimp or similar.

---

### 4.19 POSTER MODAL — Lightbox Dialog

**Element:** `<dialog data-poster-modal>` · **Classes:** `.modal`, `.poster-modal`, `.poster-modal-actions`

A native HTML `<dialog>` lightbox. Triggered by any `[data-poster-open]` element.  
Displays `images/conclave-poster.png` full-size with a Download button.

**To update poster in modal:** Replace `images/conclave-poster.png` (same filename), or update `src` and `href` in the `<dialog>` block.

---

## 5. JavaScript Features

All in [`script.js`](./script.js) — one IIFE, strict mode, zero dependencies.

| Feature | Trigger | Description |
|---------|---------|-------------|
| Toast notifications | `toast(msg)` function | Auto-dismisses after 3.2s |
| Dark/light theme toggle | `[data-theme-toggle]` button | Saved in `localStorage` |
| Scrolled header | `window.scroll` | `.is-scrolled` class after 8px |
| Mobile nav | `[data-nav-toggle]` | Closes on outside click / Escape |
| Active nav highlighting | `IntersectionObserver` | Highlights nav link for visible section |
| Registration countdown | Every 1s via `setInterval` | Shows "Registration Closed" when expired |
| Schedule day tabs | `[data-day-tab]` buttons | ARIA `tablist`; arrow-key accessible |
| Session filter chips | `[data-session-filter]` | Filters sessions by `data-type` attribute |
| Calendar download | `[data-ics]` buttons | Generates and downloads `.ics` file |
| Registration form | `[data-reg-form]` | Validates → generates pass → stores in `localStorage` |
| Poster lightbox | `[data-poster-open]` | Opens `<dialog>` natively |
| Newsletter form | `[data-news-form]` | Email validation + preview toast |

---

## 6. CSS Files

### `style.css`
- CSS custom property tokens at the top (colours, spacing)
- `[data-theme="light"]` and `[data-theme="dark"]` token overrides
- Component styles for every section
- Responsive breakpoints with `@media (max-width: ...)`
- Bottom of file: journey waterfall · bottom CTA · free entry badge · nav register highlight

### `poster-theme.css`
- Secondary stylesheet applied after `style.css`
- Cinematic dark aesthetic matching the official poster
- Poster-specific colour tokens: `--poster-blue-lt`, `--poster-green`, etc.
- Controls hero section cinematic feel and dark background gradients

---

## 7. Images & Assets

| File | Used in | Notes |
|------|---------|-------|
| `conclave-poster.png` | Hero · Register aside · Lightbox · Download | **Active poster** — replace when QR is updated |
| `conclave-poster.jpg` | OG image meta tag | Kept for backward compat |
| `conclave-logo.jpg` | Header · About · Footer · Pass card | Replace to update logo |
| `favicon.png` | Browser tab · Apple touch icon | Recommend 512×512px PNG |
| `reg-qr.png` | Currently unused in HTML | Replace with actual QR when ready |

> **⚠️ When the official QR code is ready:**
> 1. Replace `images/conclave-poster.png` with the version containing the correct QR
> 2. Remove the *"📌 QR code will be updated soon"* note from hero `<figcaption>` and register aside
> 3. Optionally update `images/reg-qr.png` as a standalone QR image

---

## 8. Common Edits Cheatsheet

| Task | File | What to change |
|------|------|----------------|
| Update registration deadline | `script.js` line 8 | `DEADLINE = new Date('...')` |
| Connect form to email service | `script.js` line 15 | `FORM_ENDPOINT = 'https://...'` |
| Update poster | `images/` | Replace `conclave-poster.png` (keep filename) |
| Update logo | `images/` | Replace `conclave-logo.jpg` (keep filename) |
| Change event dates everywhere | `index.html` | Search `15–16 October 2026`, update all |
| Update coordinator contacts | `index.html` · `#contact` | Edit `href="tel:..."` and display text |
| Add a FAQ | `index.html` · `#faq` | Add `<details class="faq-item">` block |
| Add a schedule session | `index.html` · `#schedule` | Add `<li class="session">` in correct `.timeline` |
| Change prize amount | `index.html` | Search `₹50,000`, update all occurrences |
| Update entry fee message | `index.html` · `#register` | Edit `.fee-box.fee-free` div content |
| Add a rule/term | `index.html` · `#terms` | Add `<li>` to `.terms-list` |
| Change map location | `index.html` · `#venue` | Update `<iframe src>` and directions `<a href>` |
| Update social share image | `index.html` line 11 | Update `og:image` content attribute |

---

*Documentation — Startup Conclave '26 · AKGEC IDEA Lab · Last updated: September 2026*
