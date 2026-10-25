const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exts = ['', '.js', '.jsx', '.ts', '.tsx', '.json'];
const tracked = execSync('git ls-files', { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const exact = new Set(tracked);
const lower = new Map(tracked.map((t) => [t.toLowerCase(), t]));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const rel = (abs) => path.relative(process.cwd(), abs).split(path.sep).join('/');

function walk(dir, out = []) {
  for (const n of fs.readdirSync(dir)) {
    const f = path.join(dir, n);
    if (fs.statSync(f).isDirectory()) walk(f, out);
    else if (/\.(jsx?|tsx?)$/.test(n)) out.push(f);
  }
  return out;
}

const re = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
let bad = 0;

for (const file of walk('src')) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(re)) {
    const spec = m[1] || m[2] || m[3];
    if (!spec) continue;

    if (!spec.startsWith('.')) {
      if (spec.startsWith('/') || spec.startsWith('@/') || spec.includes(':')) continue;
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (!deps[name]) { bad++; console.log(`${rel(path.resolve(file))}\n   package "${name}" is not in package.json -> run: npm install ${name}\n`); }
      continue;
    }

    const base = path.resolve(path.dirname(file), spec.split('?')[0]);
    const r = rel(base);
    const c = [...exts.map((e) => r + e), ...exts.slice(1).map((e) => r + '/index' + e)];
    if (c.some((p) => exact.has(p))) continue;
    bad++;
    const hint = c.map((p) => lower.get(p.toLowerCase())).find(Boolean);
    console.log(`${rel(path.resolve(file))}\n   import: ${spec}\n   ${hint ? 'Git has it as: ' + hint + '  (fix the capital/small letters)' : 'NOT in Git, run: git add <that file>'}\n`);
  }
}
console.log(bad ? `${bad} problem(s) found` : 'All imports OK');