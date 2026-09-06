# kipos-site

The marketing site for **Kipos**, served at <https://kipostracker.com> by GitHub
Pages from the `main` branch, root folder.

Plain HTML and CSS. No build step and no Jekyll (`.nojekyll` is present, so
files are served exactly as committed).

**One dependency, on one page.** The home page loads GSAP and ScrollTrigger
3.13.0 from cdnjs for its scroll animation. Nothing else on the site uses it,
and the home page still works without it — see "Motion" below.

## Domain and hosting

`kipostracker.com` is hosted by GitHub Pages from this repository. Porkbun still
manages DNS, but Porkbun parking is disabled for the root domain.

Current DNS records that matter for the site:

| Type | Host | Value |
|---|---|---|
| A | `kipostracker.com` | `185.199.108.153` |
| A | `kipostracker.com` | `185.199.109.153` |
| A | `kipostracker.com` | `185.199.110.153` |
| A | `kipostracker.com` | `185.199.111.153` |
| CNAME | `www.kipostracker.com` | `yazanbadran253-cyber.github.io` |

GitHub Pages is configured with custom domain `kipostracker.com` and **Enforce
HTTPS** enabled. `www.kipostracker.com` redirects to `https://kipostracker.com/`.

Do not restore Porkbun's default parking records for the site. In particular,
`kipostracker.com` must not point at `uixie.porkbun.com`.

## The site

Four hand-written pages, no build step. Shared `assets/css/site.css`, and one
small `assets/js/site.js`.

| File | What it is |
|---|---|
| `index.html` | Home: hero, how it works, features, three screenshot blocks, FAQ teaser, CTA |
| `faq.html` | Full FAQ, native `<details>`, no JavaScript |
| `support.html` | Contact form, subscription/deletion/privacy shortcuts |
| `press.html` | Press form, boilerplate, downloadable assets, brand hexes |

### The App Store link is one constant

Kipos is not released, so every store badge renders as a non-clickable
"Coming soon" pill. On release day set **one value** at the top of
`assets/js/site.js`:

```js
const APP_STORE_URL = 'https://apps.apple.com/app/id6798338126';
```

Every badge on every page becomes a real link, and the "coming soon" notes
under them are removed. Nothing else needs editing. The badge markup ships in
the honest coming-soon state, so a browser with JavaScript off never sees a
download link that does not work.

### Motion (home page only)

`assets/js/home.js` drives the scroll animation with GSAP + ScrollTrigger. The
other three pages do not load either file.

**Nothing on the page depends on it.** `home.js` returns before touching the DOM
if GSAP is missing or the visitor asked for reduced motion, and every hidden
state is applied *by* GSAP — so no GSAP means no hiding, and the page renders
finished. There is a test for this: strip the two cdnjs tags, load the page, and
confirm nothing is left invisible.

Three rules worth keeping:

1. **The hero entrance animates transform only, never opacity.** It is above the
   fold and uses `backwards` fill, so a fade would leave the headline blank in
   any context that does not advance the animation clock — a crawler, a
   link-preview bot, a screenshot service. A slide cannot hide text. Below the
   fold GSAP does the fading, which is safe for the reason above.
2. **One property per element.** The hero phone is four nested layers —
   `.phone-par` (parallax y), `.phone-tilt` (cursor rotation), `.phone-float`
   (CSS idle bob), `.phone` (entrance). Two tweens writing `y` to one element
   fight and jump.
3. **`fromTo`, never `from`.** A `from` tween re-reads its end value when
   ScrollTrigger refreshes; if the start state is already applied it records
   that as the destination, and the element animates 26px to 26px and sits there
   looking broken. This actually happened.

The showcase is one sticky phone whose screen crossfades. Below 900px the sticky
stage is hidden and each block shows its own phone, which is why the three
screenshots appear twice in the markup — same files, so no extra bytes.

### The forms have no backend

GitHub Pages serves files and runs nothing, so `site.js` builds a `mailto:` to
`support@getgardenai.com` and hands it to the visitor's own mail app. Every form
also prints that address as a plain link beside it, which is the path when the
machine has no mail client. If you ever want silent submission, that needs a
third-party form service — it cannot be done from Pages alone.

### Colour: the site is not a pixel copy of the app palette

`site.css` takes its palette from the app (`src/theme.js` in the Kipos repo),
with three deliberate darkenings, each because the app value fails WCAG AA as
**web text on a light background**:

| Token | App value | Site value | Why |
|---|---|---|---|
| `--muted` | `#69737a` | `#5b666d` | 3.81:1 on the hero gradient's dark end |
| `--green-deep` | `#137738` | `#126f34` | 4.44:1 under the eyebrow labels |
| `--blue-text` | `#007db9` | `#00699c` | 3.57:1 as link text (fine as a button *fill*) |

`--blue-deep` (`#007db9`) is still the button fill — white text *on* it scores
4.53:1. That is the opposite test to blue text *on* near-white, which is why
those are two tokens and not one.

These are website text-contrast fixes, not a rebrand. The press page's swatches
deliberately show the app's real brand hexes.

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
