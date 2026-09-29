# Startup Conclave '26

Static event website for Startup Conclave '26 by AKGEC IDEA Lab, taking place on 15–16 October 2026 at AKGEC, Ghaziabad.

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
    ├── new-poster.png
    ├── pop_up_poster.png
    └── unnamed.webp
```

## Run locally

The site uses plain HTML, CSS, and JavaScript. It has no build step, package manager, or backend service.

From this directory, start a local static server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. The `index.html` file can also be opened directly in a browser.

## How it works

- `index.html` contains the page sections, dialogs, registration forms, metadata, and asset references.
- `css/style.css` contains layout, responsive rules, components, and light/dark theme styles. `css/poster-theme.css` applies the event's poster-inspired color overrides.
- `js/script.js` initializes the theme control, navigation, countdown, dialogs, schedule filters, form controls, and other page interactions after the document loads.
- The startup poster dialog opens on every page load. It can be dismissed with its close button, by clicking the backdrop, or with Escape. The hero poster has a separate lightbox.
- The selected light/dark theme is stored in browser `localStorage` under `sc26-theme`.

### Image roles

- `new-poster.png` is the hero poster; `conclave-poster.jpg` is used in the poster lightbox.
- `conclave-poster.png` is used for the social sharing preview; `pop_up_poster.png` is the automatic startup dialog.
- `conclave-logo.png` is the event logo. `akgec-logo.png`, `idealab-logo.png`, and `unnamed.webp` are partner logos.
- `favicon.png` supplies the browser and home-screen icon.

## External services and registration

Google Fonts and the embedded Google Map load from Google. Registration actions are configured in `js/script.js` in `GOOGLE_FORM_URLS` (`exhibit`, `pitch`, and `attendee`). Those values are currently empty, so registration buttons show a setup message until the published form URLs are added. The site itself has no database or server-side data storage.

The project has no server-side backend, dependency installation, or build process. GitHub Pages can host it as a static site from the repository root.

## Updating the site

- Edit copy, dates, section content, and asset references in `index.html`.
- Update colors and layout in `css/style.css`; poster-specific overrides belong in `css/poster-theme.css`.
- Update interactions, countdown deadline, and Google Form URLs in `js/script.js`.
- Replace images in `images/` while retaining the filenames referenced by `index.html`.

## Validation

Check JavaScript syntax with:

```powershell
node --check js/script.js
```

The site has no automated test suite or build command.