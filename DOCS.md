# Startup Conclave '26 — Website Documentation

> **Repo:** [1767srishtisingh-web/startupconclave](https://github.com/1767srishtisingh-web/startupconclave)  
> **Stack:** Plain HTML · CSS · Vanilla JavaScript · No build step · No backend  
> **Live:** GitHub Pages from `main` branch, root directory

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Run Locally](#2-run-locally)
3. [Deploy / Push Changes](#3-deploy--push-changes)
4. [Page Sections Reference (Slide by Slide)](#4-page-sections-reference-slide-by-slide)
5. [JavaScript Features](#5-javascript-features)
6. [CSS Architecture & Custom Styling](#6-css-architecture--custom-styling)
7. [Images & Assets](#7-images--assets)
8. [Common Edits Cheatsheet](#8-common-edits-cheatsheet)

---

## 1. Project Structure

```
startupconclave/
├── index.html          ← All page sections & slides (single-page site)
├── style.css           ← Main styles, themes, responsive rules, spacing
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

## 4. Page Sections Reference (Slide by Slide)

This site has **19 sections (slides)** in `index.html`. They appear in the following updated order:

| # | Slide / Section | ID / Selector | Purpose |
|---|-----------------|---------------|---------|
| 1 | HEAD (meta) | `<head>` | SEO, meta tags, fonts, theme init |
| 2 | HEADER | `.site-header` | Sticky nav bar (5 links, See More, no theme toggle) |
| 3 | HERO | `#home` | Landing screen — poster, title, live countdown, CTAs |
| 4 | COMPETITION & REWARDS | `.funding` | Prize pool band, Pitch & Exhibition CTAs |
| 5 | EVENT JOURNEY | `#event-journey` | Expandable 7-step waterfall model |
| 6 | QUOTE STRIP | `.quote-strip` | Philosophy tagline band ("From a Thought...") |
| 7 | ABOUT | `#about` | "Why just have an idea?" highlighted + 6 pillars |
| 8 | HIGHLIGHTS | `#highlights` | 4 core event feature cards |
| 9 | HOW IT WORKS | `#how-it-works` | 8-step process guide + experience strip |
| 10 | SCHEDULE | `#schedule` | Full 2-day itinerary (12-hr format, tabs, filters) |
| 11 | PARTICIPATE | `#ways-to-join` | Exhibition vs Pitching cards + How to register |
| 12 | VENUE | `#venue` | Location, timings, Google Maps |
| 13 | REGISTER | `#register` | Registration form + pass generation |
| 14 | TERMS | `#terms` | 12 rules & guidelines |
| 15 | FAQ | `#faq` | 6 expandable questions |
| 16 | CONTACT | `#contact` | Coordinator cards + social links |
| 17 | BOTTOM CTA | `.bottom-register-cta` | Final register push before footer |
| 18 | FOOTER | `.site-footer` | Nav mirror + newsletter + copyright |
| 19 | POSTER MODAL | `[data-poster-modal]` | Lightbox dialog for the event poster |

---

### Slide 1: `<HEAD>` — Meta, SEO & Fonts

**Lines:** 1–70

Contains:
- `<title>` and `<meta name="description">` — used by Google and social share previews.
- Open Graph tags (`og:title`, `og:description`, `og:image`) for WhatsApp/Twitter previews.
- Browser theme color (`#080E1C`).
- Google Fonts: **Archivo** (body), **Bebas Neue** (display headings), **Inter** (UI).
- Stylesheet links: `style.css` → `poster-theme.css`.
- Inline theme script: sets dark theme immediately to prevent layout flashes.

---

### Slide 2: HEADER — Sticky Navigation Bar

**Lines:** 75–139 · **Classes:** `.site-header`, `.main-nav`, `.nav-list`, `.header-actions`

Contains:
- **Brand logo + name** linking to `#home`.
- **Nav links (strictly 5 items):**
  1. `About` (`#about`)
  2. `Schedule` (`#schedule`)
  3. `Participate` (`#ways-to-join`)
  4. `Venue` (`#venue`)
  5. `Register` (`#register` — highlighted in accent color via `.nav-register-link`)
- **"See More ↓"** ghost button (`.header-see-more`) linking to `#about`.
- **Mobile hamburger button** (`data-nav-toggle`) opening the drawer menu on small screens.
- **Theme toggle:** Completely removed/disabled for a cleaner and persistent dark aesthetic.

**JS behavior:**
- Header gains `.is-scrolled` after 8px scroll → shows backdrop blur and border.
- Active navigation item auto-highlights via `IntersectionObserver`.

---

### Slide 3: HERO — Landing Section

**Lines:** 141–217 · **ID:** `#home`  
**Classes:** `.hero`, `.hero-grid`, `.hero-copy`, `.hero-title`, `.hero-actions`, `.hero-facts`, `.hero-poster`

Contains:
- **Presenter tag:** "AKGEC IDEA Lab presents"
- **Main title:** "Startup Conclave '26"
- **Tagline & description:** Focus on turning big ideas into ventures with investors.
- **Primary CTAs:**
  - `Explore the Event ↓` (`.btn-primary`) → scrolls to `#about`
  - `See Itinerary` (`.btn-ghost`) → scrolls to `#schedule`
- **Hero facts bar:**
  - Prize Pool: `~₹50,000`
  - Dates: `15–16 October 2026`
  - Venue: `AKGEC, Ghaziabad`
  - **Live Countdown Component:** Dynamic ticker updating every second with `DD:HH:MM:SS` format (days, hours, minutes, seconds).
- **Official Poster:** `images/conclave-poster.png` with click-to-enlarge lightbox modal. Caption text previously stating "QR code will be updated soon" has been cleanly removed.

---

### Slide 4: COMPETITION & REWARDS (Funding Band)

**Lines:** 219–265 · **Class:** `.funding`

Positioned immediately as **Slide 2 of page content** directly after Hero.

Contains:
- Kicker: *"Competition & Rewards"*
- Large prize display: **"Up to ~₹50,000"**
- Supporting note on pre-incubation pathways and seed-funding access.
- **Action Buttons:**
  - `Register to participate` (`.btn-light`) → scrolls to `#register` with Pitch track pre-selected.
  - `Register for Exhibition` (`.btn-exhibition`) → green gradient button scrolling to `#register` with Exhibition track pre-selected.
- **4 Highlights:**
  1. Pitch Competition
  2. Startup Exhibition (30+ stalls)
  3. IPR & Legal Guidance
  4. VC Roundtable & Incubation

---

### Slide 5: EVENT JOURNEY — Expandable Waterfall

**Lines:** 267–384 · **ID:** `#event-journey`  
**Classes:** `.event-journey`, `.journey-waterfall`, `.journey-step`, `.journey-step-header`, `.journey-step-body`

Contains: 7 expandable steps using native HTML `<details>/<summary>` (zero JS dependency):

| Step | Label | Description Summary | Default State |
|------|-------|---------------------|---------------|
| 01 | Register | Fill out online form, select track, receive pass ID | ✅ Open |
| 02 | Learn | Keynotes by top founders, ecosystem sessions | Closed |
| 03 | Connect | 1-on-1 networking with founders, VCs, and mentors | Closed |
| 04 | Exhibit | Live stall demonstration to mentors & investors | Closed |
| 05 | Pitch | Present on stage to jury and investors on Day 2 | Closed |
| 06 | Get Feedback | Direct actionable mentorship & jury deliberation | Closed |
| 07 | Scale 🚀 | Access to prize pool, pre-incubation & seed support | Closed |

---

### Slide 6: QUOTE STRIP — Philosophy Band

**Lines:** 386–403 · **Class:** `.quote-strip`

Placed right after Event Journey, transitioning smoothly into the About section.

Contains:
- Kicker: *"From a Thought → to a Possibility → to a Venture"*
- Keywords: `IDEATE.` `CONNECT.` `SHOWCASE.` `PITCH.` `GROW.`
- Blockquote: *"Big ventures often begin with one small idea — and the courage to put it out there."*
- Closing: *"Your idea is the starting point. Startup Conclave is where the journey begins."*

---

### Slide 7: ABOUT — Why Just Have an Idea?

**Lines:** 405–458 · **ID:** `#about` · **Classes:** `.about`, `.about-grid`, `.pillars`, `.pillar`

Contains:
- **Highlighted heading:** `<span class="heading-highlight">Why just have an idea?</span> When you can build it. Pitch it. Grow it.`
  - Styled with amber-to-red gradient text and italic emphasis.
- **Optimized logo size:** Responsive image capped at 260px (`max-width: 260px`) for optimal visual proportion.
- **6 Opportunity Pillars:**
  1. 🏆 ~₹50,000 Prize Pool (`--amber`)
  2. 🌱 Pre-Incubation Opportunity (`--green`)
  3. ⚖️ IPR Guidance (`--blue`)
  4. 💰 Seed-Funding Opportunities (`--red`)
  5. 🎤 Take The Stage (`--poster-blue-lt`)
  6. 🌐 Meet The Ecosystem (`--poster-green`)

---

### Slide 8: HIGHLIGHTS — Core Event Pillars

**Lines:** 460–522 · **ID:** `#highlights` · **Classes:** `.highlights`, `.highlights-grid`, `.highlight-card`

Contains 4 feature cards:
1. 🎙️ **Speakers & Keynotes:** Real industry secrets from experienced founders.
2. 💡 **Pitch Ideas:** Present live to investors and earn funding.
3. 🤝 **Networking:** 1-on-1 connections with founders and mentors.
4. 🎪 **Startup Exhibition:** 30+ stalls with direct mentor walkthroughs.

---

### Slide 9: HOW IT WORKS — 8-Step Guide

**Lines:** 524–673 · **ID:** `#how-it-works` · **Classes:** `.how-it-works`, `.steps-grid`, `.step-card`

Contains:
- 8 numbered step cards (01 Register Online → 08 Unlock Funding & Incubation).
- Experience strip at bottom with 6 core takeaways: Learn · Connect · Showcase · Pitch · Feedback · Opportunities.

---

### Slide 10: SCHEDULE — Complete Itinerary

**Lines:** 675–943 · **ID:** `#schedule`  
**Classes:** `.schedule`, `.day-tabs`, `.day-tab`, `.chip-group`, `.chip`, `.day-panel`, `.timeline`, `.session`

Features:
- **Day Tabs:** Day 1 (Thu, 15 Oct · 9:00 AM – 6:00 PM) & Day 2 (Fri, 16 Oct · 10:00 AM – 5:30 PM).
- **Filter Chips:** All · Talks & Sessions · Exhibition & Pitch · Workshops · Networking.
- **12-Hour Format:** All timings strictly rendered in AM/PM format.
- **Add to Calendar (.ics):** Built-in iCalendar generator for instant Google / Apple Calendar imports.

---

### Slide 11: WAYS TO PARTICIPATE

**Lines:** 945–1007 · **ID:** `#ways-to-join` · **Classes:** `.ways`, `.participate-grid`, `.reg-instructions-box`

Contains:
- **Exhibition Card:** For teams with working prototypes seeking visibility and stalls.
- **Pitching Competition Card (Highlighted):** For ventures competing for prizes and investor checks.
- **How to Register Box:** 6 clear bullet instructions for filling the registration form.

---

### Slide 12: VENUE — Location & Map

**Lines:** 1009–1059 · **ID:** `#venue` · **Classes:** `.venue`, `.venue-grid`, `.detail-list`, `.map-frame`

Contains:
- Full venue address: Ajay Kumar Garg Engineering College, Delhi–Meerut Expressway, Ghaziabad, UP 201015.
- Key event facts (dates, times, delegate kit, lunch & high-tea).
- Direct Google Maps directions link & responsive embedded map iframe.

---

### Slide 13: REGISTER — Registration Form

**Lines:** 1061–1315 · **ID:** `#register` · **Classes:** `.register`, `.register-grid`, `.reg-form`

Features:
- **Free Entry badge:** Clearly highlights zero entry fees.
- **Dynamic Fields:** Student year dropdown appears conditionally when role is "Student"; extra fields open when "Exhibition" or "Pitching" tracks are ticked.
- **Live Pass Generation:** Upon submission, generates an instant digital event pass with unique ID, downloadable/printable.
- **Deadline Handling:** Auto-disables after 10 October 2026.

---

### Slide 14: TERMS — Rules & Guidelines

**Lines:** 1317–1364 · **ID:** `#terms` · **Classes:** `.terms`, `.terms-list`

Contains 12 essential operational rules covering eligibility, team size, IP ownership, jury authority, punctuality, and code of conduct.

---

### Slide 15: FAQ — Frequently Asked Questions

**Lines:** 1366–1425 · **ID:** `#faq` · **Classes:** `.faq`, `.faq-list`, `.faq-item`

Contains 6 accordion items covering eligibility, entry costs, pitch guidelines, exhibition logistics, and deadlines.

---

### Slide 16: CONTACT — Coordinators & Socials

**Lines:** 1427–1503 · **ID:** `#contact` · **Classes:** `.contact`, `.contact-grid`, `.contact-card`

Contains direct contact cards for student coordinators (Krishna Goel, Preet Sain, Divi Shrivastava) and official social channels (Instagram `@akgec_idealab`, email `idealab@akgec.ac.in`).

---

### Slide 17: BOTTOM REGISTER CTA

**Lines:** 1505–1536 · **Classes:** `.bottom-register-cta`, `.bottom-cta-actions`

A full-width high-contrast gradient banner with **"Register Now — It's Free"** and **"View Full Schedule"** buttons, catching visitors at the end of their reading journey.

---

### Slide 18: FOOTER

**Lines:** 1538–1608 · **Classes:** `.site-footer`, `.footer-grid`

Contains organizer details, quick navigation mirror, preview newsletter signup, copyright notice, and "Back to top" link.

---

### Slide 19: POSTER MODAL

**Lines:** 1610–1625 · **Element:** `<dialog data-poster-modal>`

A native HTML modal displaying `images/conclave-poster.png` in high resolution with an instant download trigger button.

---

## 5. JavaScript Features

All client-side interactions are located in [`script.js`](./script.js):

| Feature | Key Hook / Selector | Functionality |
|---------|---------------------|---------------|
| **Hero Live Countdown** | `[data-hero-countdown]` | Ticks every second; displays days, hours, mins, secs in tabular cards |
| **Register Countdown** | `[data-countdown]` | Form section countdown timer syncing with `DEADLINE` |
| **Schedule Day Switcher** | `[data-day-tab]` | ARIA-accessible tab navigation between Day 1 and Day 2 |
| **Session Category Filters** | `[data-session-filter]` | Filters schedule items by `data-type` (talk, pitch, workshop, network) |
| **Calendar (.ics) Generator** | `[data-ics]` | Builds and downloads standardized `.ics` calendar events |
| **Track Pre-Selectors** | `data-preselect-pitch`, `data-preselect-exhibit` | Automatically checks the appropriate checkbox when user clicks a CTA |
| **Registration Engine** | `[data-reg-form]` | Validates input, prevents duplicate submissions, stores in `localStorage`, generates pass |
| **Poster Lightbox** | `[data-poster-open]` | Opens `<dialog>` modal with native `.showModal()` |

---

## 6. CSS Architecture & Custom Styling

Main stylesheets: `style.css` & `poster-theme.css`.

### Key Customizations & Tokens
- **Tighter Section Gaps:**
  ```css
  :root { --section-y: clamp(2.25rem, 4.5vw, 3.75rem); }
  ```
  Significantly tightens spacing between all sections for improved content flow.
- **Hero Countdown Card:**
  ```css
  .hero-countdown { display: flex; gap: 2px; }
  .hcd-num { font-size: 1.1rem; font-weight: 800; color: var(--amber); }
  ```
- **Heading Highlight:**
  ```css
  #about-title .heading-highlight {
    background: linear-gradient(135deg, var(--amber) 0%, var(--red) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  ```
- **Exhibition CTA Button:**
  ```css
  .btn-exhibition {
    background: linear-gradient(135deg, var(--green) 0%, #0d7a4a 100%);
    color: #fff;
    font-weight: 700;
  }
  ```

---

## 7. Images & Assets

| File | Purpose | Notes |
|------|---------|-------|
| `conclave-poster.png` | Official Event Poster | Active in Hero, modal, and download |
| `conclave-logo.jpg` | Official Logo | Active in Header, About, Footer, and Pass |
| `favicon.png` | Browser Tab Icon | 512×512 PNG |
| `reg-qr.png` | QR Asset | Replace when official QR is finalized |

---

## 8. Common Edits Cheatsheet

| Task | File | What to change |
|------|------|----------------|
| Change Registration Deadline | `script.js` line 8 | Update `DEADLINE = new Date('YYYY-MM-DDTHH:MM:SS+05:30')` |
| Connect Real Form API | `script.js` line 15 | Enter Formspree or custom endpoint in `FORM_ENDPOINT` |
| Update Poster Image | `images/` | Replace `conclave-poster.png` (keep same filename) |
| Update Logo Image | `images/` | Replace `conclave-logo.jpg` (keep same filename) |
| Update Event Schedule Sessions | `index.html` #schedule | Add or edit `<li class="session" data-type="...">` |
| Update Coordinator Contacts | `index.html` #contact | Edit name, role, phone number, and mailto links |
| Modify Navigation Items | `index.html` #top | Edit `<ul class="nav-list">` (keep to max 5 items) |

---

*Documentation — Startup Conclave '26 · AKGEC IDEA Lab · Last updated: September 2026*
