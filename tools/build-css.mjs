// Joins the site's stylesheets (in cascade order) into one minified file: public/css/site.css.
// Run after editing any file in public/css:  npm run build
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
export const ORDER = ['app', 'apple', 'watch', 'dash', 'pro', 'cf', 'finish', 'app2', 'polish'];
export function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')       // comments
    .replace(/\s+/g, ' ')                     // whitespace runs
    .replace(/\s*([{};,])\s*/g, '$1')         // around braces, semicolons, commas
    .replace(/;}/g, '}')
    .trim();
}
export function build() {
  const css = ORDER.map(n => `/* ${n} */\n` + fs.readFileSync(path.join(root, 'public/css', n + '.css'), 'utf8')).join('\n');
  const out = minify(css) + '\n';
  return { out, hash: crypto.createHash('sha256').update(out).digest('hex').slice(0, 10) };
}
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const { out, hash } = build();
  fs.writeFileSync(path.join(root, 'public/css/site.css'), out);
  const idx = path.join(root, 'public/index.html');
  const html = fs.readFileSync(idx, 'utf8').replace(/css\/site\.css\?v=[0-9a-f]+/, `css/site.css?v=${hash}`);
  fs.writeFileSync(idx, html);
  console.log('site.css', out.length, 'bytes, v=' + hash);
}
