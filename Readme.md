# Startup Conclave '26 website

Static event website for Startup Conclave '26 by AKGEC IDEA Lab (15–16 October 2026, AKGEC Campus, Ghaziabad).

Plain HTML, CSS and vanilla JavaScript. No build step, no backend, no environment variables.

## Project structure

```
startup-conclave-26/
├── index.html          Page markup (all sections)
├── style.css           Styles, light/dark themes, responsive rules
├── script.js           Interactions
├── README.md
└── images/
    ├── conclave-poster.jpg   Official poster (hero, lightbox, register section)
    ├── conclave-logo.jpg     Event logo (header, about, footer, pass)
    └── favicon.png
```

## Run locally

Open `index.html` in a browser. That's it.

## Deploy

- **GitHub Pages**: push the folder contents to a repository, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repo with no build command and publish directory `/`.
- **Vercel**: import the repo, framework preset "Other", no build command, output directory `.`.

## What works without a backend

- Sticky header, mobile menu, active-section highlighting, smooth scrolling
- Light/dark theme toggle (remembered per browser)
- Live countdown to the 10 October registration deadline; the form closes itself after it
- Schedule day tabs (arrow-key accessible), session-type filter, "Add to calendar" `.ics` downloads
- Speaker role filter and speaker detail dialogs
- "Who it's for" selector that pre-fills the registration form
- Poster lightbox with download
- Exhibition, pitching, and attendee registration buttons open their matching Google Forms
- Newsletter signup with validation
- FAQ accordion, map embed, tap-to-call coordinator numbers

## Google Form registration

Create a Google Form for each registration type, then add their public URLs to `js/script.js`:

```js
const GOOGLE_FORM_URLS = {
    exhibit: 'https://docs.google.com/forms/d/e/your-exhibition-form/viewform',
    pitch: 'https://docs.google.com/forms/d/e/your-pitch-form/viewform',
    attendee: 'https://docs.google.com/forms/d/e/your-attendee-form/viewform'
};
```

The Register buttons redirect to their matching Google Form. Until these URLs are configured, clicking a button displays a setup message. Google Forms receives and stores submitted responses; this website does not store registration data.

## Editing content

- **Dates / deadline**: `DEADLINE` near the top of `script.js`, plus the text in `index.html`.
- **Speakers**: cards in the `#speakers` section of `index.html`; bios in the `SPEAKERS` object in `script.js`. The four names come from the reference site and should be replaced with the confirmed lineup.
- **Schedule**: the two `.timeline` lists in `index.html`. Each session's `data-type` (`talk`, `pitch`, `workshop`, `network`) drives the filter.
- **Fee**: ₹500 per person is carried over from the reference site; confirm before launch.
- **Colours**: tokens at the top of `style.css`.