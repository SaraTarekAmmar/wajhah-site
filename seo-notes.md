# SEO Quick Wins — Wajhah

## Canonical tag
Add to `<head>` (placeholder domain — **swap `https://wajhah.studio/` for the real domain before launch**):

```html
<link rel="canonical" href="https://wajhah.studio/" />
```

## hreflang — not recommended here
`hreflang` tells search engines "this URL is the Arabic version, that URL is the English version." Wajhah's language toggle is client-side JS on one URL (`[data-i18n]` show/hide, no routing). There's no separate `/en` or `/ar` URL to point `hreflang` at, so adding it would either be a no-op or, worse, a self-referencing tag with no real alternate — not useful and arguably misleading to crawlers.

**Recommendation:** skip `hreflang` unless the site later gets real per-language URLs (e.g. `/en/`, `/ar/`). Instead, keep `<html lang="ar">` (already present) accurate and in sync with whichever language is active, and optionally add `content-language` meta.

## Other missing meta quick wins
- `<meta property="og:url" content="https://wajhah.studio/">` and `<meta property="og:locale" content="ar_AR">` (OG tags exist but lack url/locale/image)
- `<meta property="og:image" content="https://wajhah.studio/PLACEHOLDER-cover.png">` — OG card needs an image to render properly on social shares
- `<meta name="twitter:image" content="...">` — same gap on the Twitter card
- `<meta name="robots" content="index, follow">` — explicit, though default behavior is the same
- The JSON-LD block (`seo-jsonld.json`) should be inlined in `<script type="application/ld+json">` in `<head>`

No fake review counts, addresses, or phone numbers were invented — all business-specific fields are marked `PLACEHOLDER` in `seo-jsonld.json`.
