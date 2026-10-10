# Wajhah — Pre-Launch Deploy Checklist

Scanned `index.html` (+ `robots.txt`, `sitemap.xml`) directly for placeholders,
fictional content, and dead links. Items already resolved or consciously
deferred in `PROJECT_IMPROVEMENTS.md` (i18n integrity check, link checker,
a11y fixes, reduced-motion, mobile nav) are not repeated here.

---

## Must fix before launch
*(would actively embarrass or mislead a real visitor)*

- [ ] **Placeholder domain `wajhah.studio` baked into structured data/meta** — replace with the real production domain everywhere it appears:
  - `og:url` — line 13
  - JSON-LD `"url"` — line 30
  - `<link rel="canonical">` — line 46
  - `robots.txt` line 4 (`Sitemap: https://wajhah.studio/sitemap.xml`)
  - `sitemap.xml` line 4 (`<loc>https://wajhah.studio/</loc>`)
- [ ] **Six fake client logos presented as real customers** in the marquee — `FINTECH CO`, `NOVA RETAIL`, `ORBIT HEALTH`, `KANZ GROUP`, `LOOP MOBILITY`, `DAR LOGISTICS` (search for `FINTECH CO` — lines 233 & 235, duplicated for the scroll loop). Either swap for real client names/logos (with permission) or remove the section entirely.
- [ ] **Six fictional case studies with invented metrics, styled as real portfolio work** — search for `Nabd Banking App` (line ~373) through `Masar Learning` (line ~438): "+64% activation", "+2.1x sales", "4.9★ rating", "-38% booking time", "-45% delivery time", "+3x course completion" are all made up, and every card's `href="#"` (lines 366, 379, 392, 405, 418, 431) goes nowhere. Replace with real case studies and real metrics, or remove the Work section until real ones exist — a reviewer who clicks through to a dead `#` link on invented numbers is the single worst first impression on this page.
- [ ] **Fabricated testimonial attributed to a named, fictional person** — "Sara Al-Mutairi, Head of Product, Nova Retail" (lines 615–617), quote presented as a real customer quote. Replace with a real quote + real attribution (with permission), or remove the testimonial section.
- [ ] **Fabricated hero stats stated as fact** — "40+ Projects shipped", "6+ Years in the field", "98% Client satisfaction" (lines 211–224). Replace with real, defensible numbers (or remove the row) before this is a real company's public page.
- [ ] **Footer social links are dead `#` stubs** — Instagram/LinkedIn/Behance, lines 659–661. Either link real profiles or remove the links (a visitor clicking "Instagram" and landing back on the same page reads as broken, not "coming soon").
- [ ] **Contact form has no real submission endpoint** — `onsubmit` (line 633) only swaps the button's text to "✓"; no email is ever sent anywhere. This is the site's only conversion path. Wire it to Formspree/Netlify Forms/a real backend + the client's real inbox before launch (flagged already in `PROJECT_IMPROVEMENTS.md` #7, still open).

## Should fix before launch
*(real but missing — won't mislead anyone, but weakens launch quality)*

- [ ] **No `og:image` / `twitter:image`** — social shares (Slack, X, WhatsApp, iMessage) will render with no preview image. Add a real cover image once one exists, plus `twitter:card` should become `summary_large_image` to match.
- [ ] **JSON-LD `ProfessionalService` is missing `address`, `telephone`, `email`, `sameAs`** (see the comment at lines 19–22 — deliberately left out, not a bug). Fill these in once there's a real business address/phone/social accounts; don't launch with placeholder values either.
- [ ] **`robots.txt` / `sitemap.xml` exist but aren't deployed/verified** — they're correct files sitting in this directory; confirm they actually get served at `/robots.txt` and `/sitemap.xml` on the real domain once it's live, and re-check the domain swap above didn't get missed in either file.
- [ ] **Tailwind loaded from `cdn.tailwindcss.com` at runtime** (line 51) — fine for a demo, not for production: adds a render-blocking script, compiles CSS client-side on every load, and can't be locked down by a strict CSP. Move to a build step (Tailwind CLI/PostCSS) before this is a real production site (flagged already as `PROJECT_IMPROVEMENTS.md` #8).

## Nice to have / can wait

- [ ] Google Fonts (`fonts.googleapis.com`/`fonts.gstatic.com`, lines 48–50) could be self-hosted to shave a render-blocking round trip, but it's preconnected already and low priority.
- [ ] `<meta name="robots" content="index, follow">` (line 47) is correct for launch day, but double check it wasn't accidentally left as `noindex` on a staging deploy before the real domain goes live — opposite failure mode, worth a one-line manual check.
- [ ] Additional case studies / FAQ / content growth — no blocker, backlog only.
