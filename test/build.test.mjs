import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from '../tools/build-css.mjs';

test('public/css/site.css is up to date (run: npm run build)', () => {
  const { out, hash } = build();
  assert.equal(fs.readFileSync(new URL('../public/css/site.css', import.meta.url), 'utf8'), out);
  assert.ok(fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8').includes(`css/site.css?v=${hash}`));
});
