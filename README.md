# Maryam Hojati — personal website

A bilingual (English / Persian) static site. No build step. Fonts are bundled in `fonts/` so the page does not depend on Google Fonts.

## Preview locally

```
python3 -m http.server 8080
```

Then open http://127.0.0.1:8080/

## Publish on GitHub Pages

1. Create a repository and upload **this whole folder**, including `fonts/` and `assets/`.
2. GitHub → **Settings** → **Pages**.
3. Source: **Deploy from a branch** → `main` → folder **`/ (root)`**.
4. The live URL will be:
   - `https://YOURUSER.github.io/` if the repo is named `YOURUSER.github.io`
   - `https://YOURUSER.github.io/REPO/` if the repo has another name

All paths are relative (`styles.css`, `assets/…`, `fonts/…`), so both of those URL shapes work.

`.nojekyll` is included so GitHub does not run Jekyll on the files.

## Files

- `index.html` — page content and language strings
- `styles.css` — layout, RTL, local `@font-face`
- `script.js` — language, coffee copy, photograph viewer
- `fonts/` — DM Sans and Vazirmatn (static woff2)
- `assets/` — photographs and writing thumbnails

The page always opens in English. Persian is a switch, not a stored default, so returning visitors are not dropped into an RTL layout before fonts and CSS have loaded.
