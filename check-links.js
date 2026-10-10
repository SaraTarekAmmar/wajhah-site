// ponytail: regex scan in document order, not a DOM parser — good enough for one static
// file; swap for a real HTML parser if markup nesting ever gets complex enough to fool this.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
const html = fs.readFileSync(file, 'utf8');

function context(index) {
  const before = html.slice(Math.max(0, index - 40), index);
  const after = html.slice(index, index + 60);
  return `...${before}${after}...`.replace(/\s+/g, ' ').trim();
}

const ids = new Map(); // id -> [indices]
for (const m of html.matchAll(/\bid="([^"]+)"/g)) {
  const id = m[1];
  if (!ids.has(id)) ids.set(id, []);
  ids.get(id).push(m.index);
}

const duplicates = [...ids.entries()].filter(([, positions]) => positions.length > 1);

const anchors = [...html.matchAll(/href="#([^"]+)"/g)].filter((m) => m[1] !== '');

const missing = [];
for (const m of anchors) {
  const target = m[1];
  if (!ids.has(target)) {
    missing.push(`href="#${target}" has no matching id — near: ${context(m.index)}`);
  }
}

const errors = [];
if (missing.length) {
  errors.push(`${missing.length} broken internal link(s):`);
  missing.forEach((e) => errors.push('  ' + e));
}
if (duplicates.length) {
  errors.push(`${duplicates.length} duplicate id(s):`);
  duplicates.forEach(([id, positions]) => {
    const locations = positions.map((idx) => context(idx)).join(' | ');
    errors.push(`  id="${id}" used ${positions.length} times — near: ${locations}`);
  });
}

if (errors.length) {
  console.error('FAILED —');
  errors.forEach((e) => console.error(e));
  process.exit(1);
}

console.log(`OK — ${anchors.length} internal links verified, 0 duplicate ids`);
