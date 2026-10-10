// ponytail: fixed palette hardcoded from index.html's Tailwind theme (ink/white/lime/mint/teal),
// not parsed from the file — usages/sizes below were confirmed by reading index.html directly.
// Re-check this list if the palette or its usages change.
const INK = hex('#07140f');

function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// WCAG 2.1 relative luminance: sRGB -> linear -> weighted sum.
function relativeLuminance([r, g, b]) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// WCAG 2.1 contrast ratio: (L1 + 0.05) / (L2 + 0.05), L1 = lighter.
function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

// Standard "over" alpha compositing of a foreground color at `alpha` over an opaque background.
function blend(fg, bg, alpha) {
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
}

// Each case: real usage(s) in index.html drive which threshold applies.
// large text = >=24px regular or >=18.66px(14pt) bold, per WCAG AA.
// `live: false` means this combo isn't actually rendered as text anywhere in index.html right
// now (checked as a conservative baseline only) — it's reported but never fails the exit code,
// so adding an unused shade to the palette can't make `npm test` cry wolf about a non-bug.
const cases = [
  { color: hex('#ffffff'), alpha: 1.00, label: 'white (opaque) on ink', usage: 'headings, body default — normal text', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.80, label: 'white/80 on ink', usage: 'nav links, text-sm font-medium (14px) — normal text', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.70, label: 'white/70 on ink', usage: 'comparison table cells, text-base (16px) — normal text', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.65, label: 'white/65 on ink', usage: 'hero subhead, text-lg (18px) regular weight — normal text (18px regular < 24px large-text floor)', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.60, label: 'white/60 on ink', usage: 'footer copyright + table cells, text-sm/text-base — normal text', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.55, label: 'white/55 on ink', usage: 'card/section descriptions, text-sm and text-lg regular — normal text', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.50, label: 'white/50 on ink', usage: 'stat captions, text-xs — normal text', large: false, live: true },
  { color: hex('#ffffff'), alpha: 0.40, label: 'white/40 on ink', usage: 'not used as a text color in current index.html — checked as conservative baseline', large: false, live: false },
  { color: hex('#ffffff'), alpha: 0.30, label: 'white/30 on ink', usage: 'not used as a text color in current index.html — checked as conservative baseline', large: false, live: false },

  { color: hex('#8CE562'), alpha: 1.00, label: 'lime (opaque) on ink', usage: 'nav hover, link labels, font-bold accents — normal text', large: false, live: true },
  { color: hex('#8CE562'), alpha: 0.90, label: 'lime/90 on ink', usage: 'eyebrow label, text-xs font-bold uppercase (12px bold) — normal text (below 18.66px bold floor)', large: false, live: true },
  { color: hex('#8CE562'), alpha: 0.50, label: 'lime/50 on ink', usage: 'process-step numbers, text-5xl font-black (48px bold) — large text', large: true, live: true },
  { color: hex('#8CE562'), alpha: 0.45, label: 'lime/45 on ink', usage: 'not used as a text color in current index.html — checked as conservative baseline', large: false, live: false },
  { color: hex('#8CE562'), alpha: 0.30, label: 'lime/30 on ink', usage: 'only used as a background tint (selection:bg-lime/30), not as text — checked as conservative baseline', large: false, live: false },

  { color: hex('#4ADE80'), alpha: 1.00, label: 'mint (opaque) on ink', usage: 'not used as a text color in current index.html (gradient tint only) — checked as conservative baseline', large: false, live: false },
  { color: hex('#1FA384'), alpha: 1.00, label: 'teal (opaque) on ink', usage: 'not used as a text color in current index.html (gradient tint only) — checked as conservative baseline', large: false, live: false },
];

console.log('WCAG contrast check — real sRGB/relative-luminance math, alpha-composited over ink (#07140f)\n');

let liveFailed = 0;
let baselineFailed = 0;
for (const c of cases) {
  const effective = c.alpha < 1 ? blend(c.color, INK, c.alpha) : c.color;
  const ratio = contrastRatio(effective, INK);
  const threshold = c.large ? 3.0 : 4.5;
  const pass = ratio >= threshold;
  if (!pass) { c.live ? liveFailed++ : baselineFailed++; }
  console.log(
    `${c.label}: ${ratio.toFixed(2)}:1 — ${pass ? 'PASS' : 'FAIL'}${c.live ? '' : ' (not live)'} (needs ${threshold}:1 for ${c.large ? 'large' : 'normal'} text) [${c.usage}]`
  );
}

console.log('');
if (liveFailed) {
  console.error(`FAILED — ${liveFailed} combination(s) actually used as text in index.html fail their WCAG AA threshold.`);
  process.exit(1);
}
if (baselineFailed) {
  console.log(`OK — all LIVE text combinations pass WCAG AA (${baselineFailed} unused baseline combo(s) fail but aren't rendered as text, so they don't block the build).`);
} else {
  console.log('OK — all checked combinations meet WCAG AA for their applicable text size/weight.');
}
