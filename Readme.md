# Startup Conclave '26

Official event website for Startup Conclave '26, hosted by AKGEC IDEA Lab on 15-16 October 2026 in Ghaziabad.

## Overview

This is a static, single-page website built with HTML, CSS, and vanilla JavaScript. It requires no package installation, build process, or application server. GitHub Pages can serve it directly.

## Features

- Responsive event information, venue, contact details, and partner branding.
- Light and dark themes, with the selected theme preference saved in browser storage.
- Event schedule with day and session-type filters, plus downloadable calendar files.
- Registration links for exhibition, pitching, and attendee categories.
- Startup poster popup on page load and a separate poster lightbox.
- FAQ and event-guidelines tabs.
- Countdown to the registration deadline: 10 October 2026 at 23:59:59 India Standard Time.

## Run locally

From the project directory, start a static file server:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000` in a browser. Alternatively, open `index.html` directly.

## Session and data behavior

The website has no sign-in, authenticated session, or server-side session storage. **A five-minute session or inactivity timeout is not implemented and does not apply.** The only persistent browser value is the light/dark theme preference (`sc26-theme` in `localStorage`). Toast notifications disappear after four seconds; this is only a display timer, not a session timeout.

Registration buttons open the configured Google Forms in a new tab. Google processes responses submitted through those forms; this website does not store registration data. Google Fonts and the embedded Google Map are also external services.

## Project structure

```text
startupconclave/
├── index.html
├── Readme.md
├── css/
│   ├── poster-theme.css
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── akgec-logo.png
    ├── conclave-logo.png
    ├── conclave-poster.jpg
    ├── conclave-poster.png
    ├── favicon.png
    ├── idealab-logo.png
    ├── final-poster.png
    ├── pop_up_poster.png
    └── unnamed.webp
```

## Maintenance

- Page copy, dates, and section markup: `index.html`.
- Layout, responsive behavior, and themes: `css/style.css` and `css/poster-theme.css`.
- Interactions, countdown, and Google Forms configuration (`GOOGLE_FORM_URLS`): `js/script.js`.
- Image roles: `final-poster.png` is the hero poster, `conclave-poster.jpg` is used by the lightbox, `conclave-poster.png` is the social preview, and `pop_up_poster.png` is the startup popup. The remaining images provide the event logo, partner logos, and favicon.

Registration form URLs are maintained in `GOOGLE_FORM_URLS` in `js/script.js`. Update those values when registration links change.

## Validation

Check JavaScript syntax with:

```powershell
node --check js/script.js
```

There is currently no automated test suite or build command.
