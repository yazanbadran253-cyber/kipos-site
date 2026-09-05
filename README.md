# kipos-site

The marketing site for **Kipos**, served at <https://kipostracker.com> by GitHub
Pages from the `main` branch, root folder.

Plain HTML and CSS. No build step, no dependencies, no Jekyll (`.nojekyll` is
present, so files are served exactly as committed).

## `index.html` is a throwaway placeholder

It is not the website. It exists to prove the deploy and the TLS certificate
work. Delete it wholesale when the real home page lands. Do not build on it.

## The legal pages are COPIES. Keep them in sync.

`privacy.html` and `terms.html` are served at two URLs:

1. <https://yazanbadran253-cyber.github.io/kipos-legal-v2/> — the original.
   **The shipped app links here** (`LEGAL_URLS` in the app's `src/data.js`), and
   these URLs are filed with Apple. They can never move or 404.
2. <https://kipostracker.com/> — this repo. A second copy, for the website.

**Legal text has exactly one source: `legal-site/*.md` in the Kipos app repo.**
Edit it there. Never edit the HTML in this repo by hand, and never edit only one
of the two copies. Two copies of a legal document that disagree are a real
problem, not a cosmetic one.

### To update the legal pages

1. Edit `legal-site/privacy.md` or `legal-site/terms.md` in the Kipos app repo.
2. Push that change to `kipos-legal-v2`. Wait for its Pages build to finish.
3. Re-run the sync below.
4. Check the diff. Only the asset paths in the table below may differ.
5. Commit and push this repo.

```bash
OLD="https://yazanbadran253-cyber.github.io/kipos-legal-v2"
curl -sSL -o privacy.html "$OLD/privacy.html"
curl -sSL -o terms.html   "$OLD/terms.html"
sed -i \
  -e 's|href="/kipos-legal-v2/assets/css/style\.css[^"]*"|href="assets/css/style.css"|g' \
  -e 's|src="/kipos-legal-v2/assets/js/scale\.fix\.js"|src="assets/js/scale.fix.js"|g' \
  -e 's|href="/kipos-legal-v2/favicon\.ico"|href="assets/favicon.png"|g' \
  privacy.html terms.html
```

Fetching the rendered HTML, rather than re-rendering the Markdown, is what
guarantees the two copies say the same thing.

### The three edits the sync makes, and why

| Original path | Rewritten to | Reason |
|---|---|---|
| `/kipos-legal-v2/assets/css/style.css?v=…` | `assets/css/style.css` | Root-relative. Would 404 here. Vendored — 7.5 KB, one file. |
| `/kipos-legal-v2/assets/js/scale.fix.js` | `assets/js/scale.fix.js` | Same. Vendored — 907 bytes. |
| `/kipos-legal-v2/favicon.ico` | `assets/favicon.png` | Already 404s on the original. It sits inside an HTML comment, so it is inert either way. |

### Two things that are deliberate, so nobody "fixes" them

1. **The theme fonts stay absolute**, pointing at `kipos-legal-v2`. See the
   `url(…)` values in `assets/css/style.css`. That repo is permanent — the
   shipped app depends on it — and copying 20 font files here to style a page of
   prose is not worth it. If the fonts ever 404, the browser falls back to the
   system sans-serif and the text still reads.
2. **`<link rel="canonical">` still points at the `kipos-legal-v2` URL.** That
   is correct. It tells search engines which of the two identical copies is
   authoritative, and stops them competing as duplicate content. Leave it.

## Do not put a custom domain on the user site

The custom domain belongs on **this project repo only**. Setting one on
`yazanbadran253-cyber.github.io` remaps every project page under the account.
`kipos-legal-v2/` would move, which breaks the URLs hardcoded in the shipped app
and filed with Apple.

## Do not delete `google30d89a1fc54799eb.html`

It is a Google Search Console verification token, 54 bytes. The same filename
verifies every property on this Google account, and three copies are live: this
repo, `kipos-legal-v2`, and the root user-site repo. All must keep returning 200.
