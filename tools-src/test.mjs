// Runs the built module against real fixtures in jsdom. Usage: node tools-src/test.mjs <fixtures dir> <medium samples dir>
// Needs jsdom and fflate (BLOG_IMPORT/node_modules).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root = process.env.BLOG_IMPORT ?? `${process.env.HOME}/sandbox/99_sideline/team3-chichi/products/wp-import`;
const require = createRequire(`${root}/package.json`);
const { JSDOM } = require('jsdom');
const { zipSync, strToU8 } = require('fflate');
const [fixtures, samples] = process.argv.slice(2);
const dom = new JSDOM('<!doctype html><body></body>');
globalThis.DOMParser = dom.window.DOMParser;
const { inspect } = await import(pathToFileURL(path.resolve('assets/tools/inspector.js')).href);
const bytes = (s) => new Uint8Array(readFileSync(s));
let fail = 0;
const eq = (label, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fail++; console.log(ok ? 'ok  ' : 'FAIL', label, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };

for (const f of ['squarespace-sample.xml', 'theme-unit-test.xml', 'demo-blog.xml', 'blogger-new.xml']) {
  const p = f.startsWith('blogger') ? `${fixtures}/${f}` : `${fixtures}/${f}`;
  const r = await inspect(f, bytes(p));
  console.log(f, JSON.stringify({ ...r, images: { total: r.images.total, hosts: r.images.hosts.slice(0, 3) } }));
  if (f === 'squarespace-sample.xml') {
    eq('sqs kind', r.kind, 'squarespace');
    // counted by hand with grep on the fixture
    eq('sqs published+drafts', [r.published, r.drafts], [1, 1]);
    eq('sqs pages/attachments/comments', [r.pages, r.attachments, r.comments.total], [1, 0, 0]);
    eq('sqs host', r.images.hosts, [['images.squarespace-cdn.com', 1]]);
  }
  if (f === 'theme-unit-test.xml') {
    eq('wp kind', r.kind, 'wordpress');
    eq('wp published+drafts', [r.published, r.drafts], [56, 2]);
    eq('wp pages/attachments/comments', [r.pages, r.attachments, r.comments.total], [21, 37, 33]);
    eq('wp comment email count', r.comments.withEmail, 29);
    eq('wp example from file', r.paths.example, r.paths.sample[0].match(/\/\d{4}\/\d{1,2}(\/\d{1,2})?\//)[0]);
    eq('wp sample all dated', r.paths.sample.every((x) => /\/\d{4}\/\d{1,2}\//.test(x)), r.paths.withDates >= 5);
    eq('wp images = img tags in post bodies', r.images.total <= 147, true);
  }
}

// Medium: zip of real story and reply samples, plus one draft made from a story
const mk = (f) => new Uint8Array(strToU8(readFileSync(`${samples}/${f}`, 'utf8')));
const zip = zipSync({
  'export/posts/2018-04-07_ICO-Reviews-4ce83a7e81d0.html': mk('a0.html'),
  'export/posts/2018-03-20_ICO-Reviews-9a901e5376b1.html': mk('a1.html'),
  'export/posts/2018-03-18_ICO-Reviews-70c0476cca38.html': mk('a2.html'),
  'export/posts/2018-04-08_Sure--dd01b381b473.html': mk('m0.html'),
  'export/posts/2018-03-19_Hi-Stuart--b17b96de8fef.html': mk('m1.html'),
  'export/posts/draft_Next-steps-aaaaaaaaaaaa.html': new Uint8Array(strToU8(readFileSync(`${samples}/a1.html`, 'utf8').replace(/<time class="dt-published"[^>]*>[^<]*<\/time>/, '').replace(/<a class="p-canonical"[^>]*>[^<]*<\/a>/, ''))),
  'export/profile/profile.html': new Uint8Array(strToU8('<html></html>')),
});
const m = await inspect('medium.zip', zip);
console.log('medium', JSON.stringify(m));
eq('medium counts', [m.kind, m.published, m.drafts, m.replies], ['medium', 3, 1, 2]);
// Ghost: the plugin's own fixture. Expected values from parseGhost and from a raw count of the JSON.
{
  const gp = `${fixtures}/ghost-export-sample.json`;
  const text = readFileSync(gp, 'utf8');
  const raw = JSON.parse(text).db[0].data;
  const live = raw.posts.filter((p) => p.type === 'post' && p.status !== 'deleted');
  const g = await inspect('ghost.json', bytes(gp));
  console.log('ghost', JSON.stringify(g));
  eq('ghost kind', g.kind, 'ghost');
  eq('ghost published (raw)', g.published, live.filter((p) => p.status === 'published').length);
  eq('ghost drafts (raw)', g.drafts, live.filter((p) => p.status !== 'published').length);
  eq('ghost published+drafts literal', [g.published, g.drafts], [3, 2]);
  eq('ghost drafts split', g.ghost.drafts, { draft: 1, scheduled: 1, sent: 0, other: 0 });
  eq('ghost pages (raw)', g.pages, raw.posts.filter((p) => p.type === 'page').length);
  eq('ghost pages literal', g.pages, 1);
  eq('ghost authors/tags (parseGhost: used only, no # tags)', [g.authors, g.tags], [2, 2]);
  eq('ghost internal tags', g.ghost.internalTags, 1);
  eq('ghost __GHOST_URL__ body images (raw grep)', g.ghost.ghostUrlImages, (text.match(/<img src=\\"__GHOST_URL__/g) ?? []).length);
  eq('ghost __GHOST_URL__ literal body/cover', [g.ghost.ghostUrlImages, g.ghost.ghostUrlCovers], [1, 1]);
  eq('ghost image hosts', g.images.hosts, [['images.example.org', 1]]);
  eq('ghost dates ignore scheduled 2099', [g.dates.first.slice(0, 10), g.dates.last.slice(0, 10)], ['2024-01-05', '2024-02-01']);
  eq('ghost paths default /slug/', g.paths.sample.every((x) => /^\/[^/]+\/$/.test(x)) && g.paths.total === 5, true);
  // BOM and bare (unwrapped) shape
  const bare = JSON.stringify(JSON.parse(text).db[0]);
  const g2 = await inspect('bare.json', new Uint8Array(strToU8('\uFEFF' + bare)));
  eq('ghost bare shape + BOM', [g2.kind, g2.published, g2.drafts], ['ghost', 3, 2]);
}
// Errors
for (const [label, data] of [['not xml', new Uint8Array(strToU8('hello'))], ['plain xml', new Uint8Array(strToU8('<a/>'))]]) {
  try { await inspect('x', data); eq(label + ' throws', false, true); } catch (e) { eq(label + ' throws', true, true); console.log('   ', e.message); }
}
process.exit(fail ? 1 : 0);
