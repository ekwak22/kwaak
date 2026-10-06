# Kwaak YoungHoon — official website

Live website: https://yhkwaak.com

## Files

- `index.html` — landing page with Person, Nation and World entrances.
- `person.html`, `nation.html`, `world.html` — bilingual stories and original visuals.
- `styles.css` — shared appearance and responsive layouts.
- `app.js` — language selection, search, image enlargement and forum city selector.
- `data.js` — searchable bilingual story content.
- `CNAME` — custom domain, yhkwaak.com.
- `.nojekyll` — static-site marker.
- `.github/workflows/static.yml` — deploys the site to GitHub Pages after a push to main.

## Preview and editing

Open index.html locally, or serve this folder with a static web server. No build step or dependencies are required.

Images are embedded directly in the HTML, including the World page’s city-image collection. Image enlargement uses these same embedded images; no separate asset folders are needed.

Visible copy uses paired data-en / data-ko attributes. Keep story text in data.js aligned with the corresponding page. Language choice is remembered and carried through navigation links.

## Repository cleanup

Only the live website and its publishing files are kept in the current branch. Superseded page exports, duplicate image folders, source documents and extraction materials were removed from the current tree on October 6, 2026. They remain recoverable from earlier commits; this cleanup does not erase Git history. The original source collection remains separate from this website.
