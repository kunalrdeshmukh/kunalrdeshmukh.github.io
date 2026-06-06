// Refresh the "Writing" list in index.html from the Medium RSS feed.
// Replaces everything between <!-- MEDIUM:START --> and <!-- MEDIUM:END -->.
// Newest posts first; the pinned (non-Medium) entries after END are left alone.
// No dependencies — uses Node's built-in fetch (Node 18+).

import { readFile, writeFile } from 'node:fs/promises';

const FEED = 'https://medium.com/feed/@kunaldeshmukh27';
const FILE = new URL('../index.html', import.meta.url);
const START = '<!-- MEDIUM:START — auto-generated from medium.com/@kunaldeshmukh27; do not edit by hand -->';
const END = '<!-- MEDIUM:END -->';

function pick(block, tag) {
  const re = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`);
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function esc(s) {
  return s
    .replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const res = await fetch(FEED, {
  headers: { 'User-Agent': 'Mozilla/5.0 (kunalrdeshmukh.github.io writing updater)' },
});
if (!res.ok) {
  console.error(`Feed fetch failed: HTTP ${res.status}`);
  process.exit(1);
}
const xml = await res.text();

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
const posts = items
  .map((b) => ({ title: pick(b, 'title'), link: pick(b, 'link').split('?')[0] }))
  .filter((p) => p.title && p.link);

if (posts.length === 0) {
  console.error('No posts parsed from feed; leaving index.html unchanged.');
  process.exit(1);
}

const list = posts
  .map((p) => `      <a href="${esc(p.link)}">${esc(p.title)}</a>`)
  .join('\n');

const html = await readFile(FILE, 'utf8');
const re = new RegExp(`${START}[\\s\\S]*?${END}`);
if (!re.test(html)) {
  console.error('MEDIUM markers not found in index.html');
  process.exit(1);
}

const updated = html.replace(re, `${START}\n${list}\n      ${END}`);
if (updated === html) {
  console.log(`No changes (${posts.length} posts already current).`);
} else {
  await writeFile(FILE, updated);
  console.log(`Updated Writing with ${posts.length} Medium posts.`);
}
