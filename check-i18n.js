// ponytail: regex scan in document order, not a DOM parser — good enough for one static
// file; swap for a real HTML parser if markup nesting ever gets complex enough to fool this.
//
// Invariant this enforces: every bilingual block in index.html is authored as an
// `ar` element immediately followed (in document order) by its `en` counterpart.
// So the full sequence of data-i18n values must strictly alternate: ar, en, ar, en, ...
// If someone adds/edits a block and forgets the other language, the alternation breaks
// and this script fails loudly instead of the gap being invisible until a user hits it.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
const html = fs.readFileSync(file, 'utf8');

const matches = [...html.matchAll(/data-i18n="(ar|en)"/g)];
if (matches.length === 0) {
  console.error('FAILED — no data-i18n attributes found; check the file path / markup.');
  process.exit(1);
}

let expected = 'ar';
const errors = [];
matches.forEach((m, i) => {
  const lang = m[1];
  if (lang !== expected) {
    const before = html.slice(Math.max(0, m.index - 60), m.index).trim();
    errors.push(`Pair #${i}: expected "${expected}" but found "${lang}" — near: ...${before}`);
  }
  expected = expected === 'ar' ? 'en' : 'ar';
});

if (matches.length % 2 !== 0) {
  errors.push(`Odd total count (${matches.length}) — an ar/en pair is missing its other half at the end of the file.`);
}

if (errors.length) {
  console.error(`FAILED — ${errors.length} i18n alternation issue(s):\n`);
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
}

console.log(`OK — ${matches.length / 2} i18n pairs verified (ar/en alternate correctly throughout).`);
