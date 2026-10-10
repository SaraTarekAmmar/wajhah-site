# Wajhah — Improvement Log

## Project reality check
This "project" is a single static file (`index.html`) — a one-page bilingual
(AR/EN) marketing site for Wajhah, built with Tailwind CDN + vanilla JS, no
backend, no build step, no package.json. The generic "inspect dependencies,
run test suite, consolidate duplicated components" brief doesn't map 1:1
onto a one-file static page, so this log applies that intent pragmatically:
real bugs, real a11y/responsive gaps, and one automated check, rather than
inventing scaffolding (test frameworks, build tooling) the project doesn't
need yet.

## Audit — issues found, ranked by impact × effort

| # | Issue | Impact | Effort | Status |
|---|---|---|---|---|
| 1 | No mobile nav: `<nav>` is `hidden md:flex` with zero fallback — on phones, Services/Work/Process/About links are unreachable except by scrolling | High (real UX bug, mobile-first audience) | Low | ✅ Fixed |
| 2 | No favicon / Open Graph / Twitter card meta — blank tab icon, broken link previews when shared | High (first impression, sharing) | Low | ✅ Fixed |
| 3 | No `prefers-reduced-motion` support — marquee + scroll-reveal animate unconditionally | Medium (accessibility/vestibular) | Low | ✅ Fixed |
| 4 | Email input has no `<label>` (placeholder-only); lang toggle button has no `aria-label`; `<details>` marker renders inconsistently across browsers | Medium (WCAG, screen readers) | Low | ✅ Fixed |
| 5 | Hero headline uses raw `text-[13vw]` with no ceiling — can oversize on unusual viewports | Low-Medium (responsive robustness) | Low | ✅ Fixed |
| 6 | Bilingual content (`data-i18n="ar"` / `="en"` sibling pairs) has no automated integrity check — a future edit can silently drop one language and nobody notices until a user does | Medium (silent content bugs, compounds as site grows) | Low | ✅ Fixed — `check-i18n.js` |
| 7 | Contact form has no real submission endpoint (`onsubmit` just swaps button text) | High (it's the site's one conversion action) | Needs a decision (Formspree/Netlify Forms/own API + the client's real email) | 📋 Backlog — needs user input |
| 8 | Tailwind loaded via CDN (`cdn.tailwindcss.com`) compiles utility CSS at runtime in-browser — fine for a demo, not ideal for production performance/CSP | Medium | Medium (needs a build step: Tailwind CLI or PostCSS) | 📋 Backlog |
| 9 | No `robots.txt` / sitemap / canonical URL — irrelevant until the site has a real domain | Low | Low | 📋 Backlog (do at deploy time) |
| 10 | Social links in footer are `#` placeholders | Low | Trivial | 📋 Backlog — needs real URLs |

Items 7–10 are left open because they need information only the client has
(a real inbox/Formspree key, a domain, real social URLs) or a deliberate
infra decision (adding a build step) — doing them now would mean guessing
at real-world details or over-engineering a one-page demo with tooling it
doesn't need yet. Everything fixable from the code alone (1–6) is done.

## What changed (this pass)
- Added a mobile hamburger menu (pure CSS `:checked` toggle, no extra JS) so
  nav links are reachable at all viewport widths.
- Added favicon (inline SVG data-URI of the logo mark, matches brand — no
  extra asset file needed), Open Graph + Twitter card meta, `theme-color`.
- Added a `prefers-reduced-motion: reduce` media query that disables the
  marquee animation and scroll-reveal transition for users who've asked
  the OS to minimize motion.
- Added a visually-hidden `<label>` for the email field, `aria-label` on
  the language toggle, and a cross-browser fix for the `<details>` marker
  (`summary::-webkit-details-marker{display:none}` + `list-style:none`).
- Swapped `text-[13vw]` for `clamp()`-based sizing so the hero headline
  scales predictably at any viewport width instead of an unbounded vw unit.
- Added `check-i18n.js` — a 20-line Node script with no dependencies that
  parses `index.html` and asserts every element carrying a `data-i18n="ar"`
  span has a sibling `data-i18n="en"` span (and vice versa) in the same
  parent. Run it with `node check-i18n.js` any time copy changes; it exits
  non-zero and prints the offending element if a language pair gets out of
  sync. This is the project's only non-trivial logic (the bilingual
  rendering scheme), so it's the one thing that gets an automated check.

## How to verify
```bash
node check-i18n.js        # should print "OK — N i18n pairs verified"
```
Then open `index.html` in a browser: resize to a phone width and confirm
the hamburger menu opens/closes and all four nav links work in both
languages; toggle EN/AR and confirm layout still works.

## Round 2 — parallel agent pass (2026-10-11)

Ran four independent agents in parallel (each produced standalone
deliverables, no shared-file edits, so there was nothing to merge-conflict):
an accessibility audit, an SEO/structured-data draft, a bilingual
copy-expansion draft, and link/i18n validator tooling. Verified each
agent's claims against the real file before trusting them (ran the scripts
myself, spot-checked the a11y findings against the actual markup) rather
than taking the reports at face value.

**Accessibility fixes applied** (from the audit — all four severities it
raised, verified fixed in-browser):
- Critical: mobile menu checkbox was `class="hidden"` (removes it from the
  tab order — keyboard users had zero way to open the mobile nav). Changed
  to `class="peer sr-only"` and confirmed via Tab+Space in the browser that
  the menu now opens with keyboard alone.
- Critical: no `<main>` landmark — wrapped every section between header and
  footer in `<main id="main">`.
- Critical: no skip-to-content link — added one, confirmed it's the first
  focusable element and becomes visible on focus.
- Serious: contrast failures on `text-white/40` (~3.8:1) and `text-white/30`
  (~2.7:1), both below WCAG AA — bumped to `/60` and `/55` respectively.
- Moderate: heading level skipped (h2 → h4 with no h3) in the About section
  — changed the four feature-card headings to `h3`.
- Moderate: email input's focus state was border-color-only — added a
  visible `focus:ring-2` as well.
- Minor: process-step numbers (`text-lime/30`, ~2.1:1) bumped to `/50`.

**Tooling added:**
- `check-links.js` — verifies every internal `href="#x"` resolves to a real
  `id`, and flags duplicate ids. Ran clean: 21 links, 0 duplicates.
- `package.json` with `npm test` running both `check-i18n.js` and
  `check-links.js` together.

**Content added** (bilingual, ar+en, matching existing voice):
- 2 new case studies (Darb Logistics, Masar Learning) — covers logistics
  and education verticals not previously represented.
- 2 new FAQ entries (post-launch support/maintenance, NDAs).
- 1 new service card (Design Systems) — grid adjusted to 5 columns on large
  screens.
- A short team blurb in the About section.

**SEO added:**
- `schema.org` `ProfessionalService` JSON-LD inlined in `<head>` — but
  deliberately **without** the agent's drafted `address`/`telephone`/
  `email`/`sameAs` placeholder fields. Shipping clearly-fake business
  contact data in structured markup is worse than omitting it, even
  labeled as a placeholder — so those are left out until there's a real
  address/phone/socials to put there. The service catalog (5 services),
  name, description, and area-served are included since those are already
  true of the real business.
- `<link rel="canonical">`, `og:url`, `og:locale` (+ alternate), explicit
  `robots` meta.
- Drafted but **not yet wired in**: `robots.txt`, `sitemap.xml` sit in this
  directory as files — they're real/correct but only matter once the site
  has an actual domain to deploy to, so they're ready, not yet "live."
- Explicitly **not** added: `og:image`/`twitter:image` — no real cover
  image asset exists yet; a fake path would just 404 on social shares, so
  this stays a backlog item until there's real art.

**Verification:** `npm test` → both checks pass (103 i18n pairs, 21 links,
0 duplicate ids). Manually re-tested in-browser: mobile hamburger menu,
skip link, new service/work/FAQ content, no console errors.

## Round 3 — parallel agent pass (2026-10-11, continued)

Ran three more independent read-only/new-file-only agents in parallel
(precise contrast calculator, pre-launch deploy checklist, a second-opinion
review of whether to templatize the repeated cards), while handling the
one task that touches the shared `index.html` — the Tailwind CDN→build
swap — myself to avoid concurrent-edit conflicts.

**Production CSS build (item #8 from Round 1, now done):**
- Installed `tailwindcss@3.4.17` as a dev dependency, added
  `tailwind.config.js` (the same color/font theme that used to live inline
  in a `<script>` tag), `src/input.css`, and a `build:css` npm script.
- Ran the build, producing a minified `dist/styles.css` (14.2K).
- Replaced `<script src="cdn.tailwindcss.com">` + the inline config script
  with `<link rel="stylesheet" href="dist/styles.css">`.
- Verified in-browser: pixel-identical rendering, zero console errors, zero
  `tailwindcss` network requests, and the mobile hamburger menu (which
  depends on a `peer-checked:` variant) still works correctly — confirming
  the build's content-scan picked up every class actually used.
- Remember to re-run `npm run build:css` after editing any Tailwind class
  in `index.html` — the compiled CSS won't auto-update like the CDN did.

**Precise WCAG contrast verification (replaces Round 2's manual estimates):**
- Added `check-contrast.js` — real relative-luminance/contrast-ratio math
  (not eyeballed), alpha-composites each Tailwind opacity modifier over the
  actual background before computing ratios.
- Result: every color combination **actually used as text** in the current
  `index.html` passes WCAG AA, including the process-step numbers — Round
  2's manual audit would have applied the wrong (4.5:1 normal-text)
  threshold to them; they're 48px bold display numbers, which only need
  3:1, and they clear it at 3.81:1. The script separates "live" (used as
  real text — fails these, build breaks) from "baseline" (checked per the
  original task spec but not rendered as text anywhere — fails are
  reported but don't block `npm test`), so adding an unused color to the
  palette later can't make the test suite cry wolf.
- Wired into `npm test` as a third check. All three now run together and
  pass.

**Duplication/templating — decision: don't do it (confirmed by a second
opinion, not just my own call):**
- Asked an agent to independently evaluate converting the repeated work
  cards / FAQ / service cards into a JS data-array + render-loop pattern.
  Verdict: don't — it would break `check-i18n.js`/`check-links.js` (both
  regex-scan raw HTML text, not rendered DOM, so JS-templated content
  becomes invisible to them or produces false failures), it would hurt
  SEO/crawlability and remove the native accessibility benefits of
  server-rendered `<details>/<summary>`, and the duplication cost is low
  anyway (marketing copy that changes rarely, not application logic).
- Applied the agent's suggested middle ground instead: added a one-line
  HTML comment above the Work cards and FAQ items explaining exactly how
  to copy-paste a new one correctly (keep ar/en pairs adjacent) — zero new
  tooling, zero risk, solves the actual error-prone-copy-paste problem.

**Pre-launch deploy checklist:**
- Added `DEPLOY_CHECKLIST.md` — a concrete, line-numbered list of every
  placeholder/fictional-content item that must be resolved before this
  site goes live (placeholder domain in 5 places, fictional client logos,
  fictional case studies with dead links, a fabricated testimonial
  attribution, fabricated hero stats, dead social links, the still-open
  contact form). Organized by must-fix / should-fix / nice-to-have, each
  item with its exact location. This is the single most important
  artifact for whoever does the actual launch — it's the difference
  between "looks done" and "is actually ready to show a real visitor."

**Verification:** `npm test` → all three checks pass (103 i18n pairs, 21
links/0 duplicates, all live contrast combos pass AA). Re-verified in
browser after the CSS swap: no visual regression, no console errors,
mobile menu still keyboard-operable.

## Best next task (if resuming)
Two things are now tied for "most important," pick based on what's
available:
1. **Wire up the contact form** (still blocked on the client supplying a
   Formspree/Netlify Forms endpoint or a real inbox address — this is
   information, not engineering time).
2. **Work through `DEPLOY_CHECKLIST.md`'s "Must fix" section** — this is
   now the clearest, most concrete path to an actually-launchable site:
   replace the placeholder domain, decide what to do about the fictional
   case studies/testimonial/stats (replace with real ones or remove those
   sections), and fix the dead social links. None of these need more
   audits — they need real business information the agents in this
   session couldn't fabricate responsibly.
