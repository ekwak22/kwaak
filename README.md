# Kwaak YoungHoon — Bilingual Website

Open index.html in a modern browser. No installation, internet connection, or build step is needed.

## Pages
- index.html: a simple landing page with three visual choices.
- person.html: life, philosophy, education and service.
- nation.html: Korea’s development, planning ideas and projects.
- world.html: peace, city networks and international work.

Every page has an English / 한국어 selector. Navigation, page text, all 29 story titles and descriptions, search, dialogs, image descriptions and city explorer support both languages. The site remembers a visitor’s choice when browser storage is available. Page links also carry ?lang=en or ?lang=ko so the choice works when opening local files. First visits otherwise use the browser language (Korean or English).

Search accepts English and Korean regardless of the display language. Reference PDFs, the WCO presentation and the source biography excerpt retain their original languages and are labeled accordingly.

Keep the four HTML pages, styles.css, app.js, data.js and the website folder together. The ZIP includes the required assets and references; its size reflects the included source presentation. No source documents have been changed.

For editing: page text pairs are stored in data-en / data-ko attributes in each HTML page. Story translations are stored in the ko object for each entry in data.js. Shared interaction text and city names are in app.js. Layout is in styles.css.

The site is local, not publicly published. The portable package can be uploaded to a static website host.

Verified in a browser at desktop and mobile sizes (including 320px), in both languages, with language persistence, page navigation, search, dialogs, city selection and direct local-file loading.
