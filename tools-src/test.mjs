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
// Substack: HAND-MADE zip in the structure Substack writes (posts.csv + posts/<post_id>.html), not a real publication's.
// Expected numbers counted by hand from the rows below.
{
  const csv = [
    'post_id,post_date,is_published,email_sent_at,inbox_sent_at,type,audience,title,subtitle,podcast_url',
    '101.first-issue,2024-03-01T15:00:00.000Z,true,,,newsletter,everyone,First Issue,Welcome,',
    '102.paid-deep-dive,2024-04-01T15:00:00.000Z,true,,,newsletter,only_paid,"Paid, deep ""dive""",For supporters,',
    '103.founders-note,2024-05-01T15:00:00.000Z,true,,,newsletter,founding,Founders note,,',
    '104.draft-idea,,false,,,newsletter,everyone,Draft Idea,,',
    '105.episode-one,2024-06-01T15:00:00.000Z,true,,,podcast,everyone,Episode One,,https://example.com/ep1.mp3',
    '106.a-thread,2024-06-02T15:00:00.000Z,true,,,thread,everyone,A Thread,,',
    '107.half-written,2099-01-01T00:00:00.000Z,false,,,newsletter,everyone,Half written,,',
    '108.lost-post,2024-07-01T15:00:00.000Z,true,,,newsletter,everyone,Lost post,,',
  ].join('\n');
  const cdn = 'https://substackcdn.com/image/fetch/w_1456,c_limit/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F';
  const im = (f) => `<img src="${cdn}${f}">`;
  const z = (files) => zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, new Uint8Array(strToU8(v))])));
  const sub = await inspect('substack.zip', z({
    'posts.csv': csv,
    'posts/101.first-issue.html': `<p>Hi</p>${im('one.jpeg')}${im('photo.heic')}`,
    'posts/102.paid-deep-dive.html': `<p>Paid</p>${im('two.png')}`,
    'posts/103.founders-note.html': '<p>Founders</p>',
    'posts/105.episode-one.html': '<p>Show notes</p>',
    'posts/107.half-written.html': `<p>Draft with text</p>${im('three.jpeg')}`,
    'email_list.example.csv': 'email\nreader@example.com\n',
  }));
  console.log('substack', JSON.stringify(sub));
  eq('substack kind routed from zip', sub.kind, 'substack');
  eq('substack published/drafts with text', [sub.published, sub.drafts], [4, 1]);
  eq('substack extras', sub.substack, { threads: 1, podcasts: 1, paid: 2, draftsWithoutText: 1, publishedWithoutText: 1, heic: 1 });
  eq('substack images total + heic', [sub.images.total, sub.substack.heic], [4, 1]);
  eq('substack paths total + sample size', [sub.paths.total, sub.paths.sample.length], [5, 5]);
  eq('substack paths are /p/slug', sub.paths.sample.every((x) => /^\/p\/[a-z-]+$/.test(x)), true);
  eq('substack published paths come before the draft', sub.paths.sample[4], '/p/half-written');
  eq('substack dates ignore draft in 2099', [sub.dates.first.slice(0, 10), sub.dates.last.slice(0, 10)], ['2024-03-01', '2024-06-01']);
  eq('substack no pages/comments/replies/authors/tags', [sub.pages, sub.comments, sub.replies, sub.authors, sub.tags], [null, null, null, 0, 0]);
  const wrapped = await inspect('w.zip', z({ 'export/posts.csv': csv, 'export/posts/101.first-issue.html': '<p>Hi</p>' }));
  eq('substack zip in a folder', [wrapped.kind, wrapped.published], ['substack', 1]);
  // Only a thread and a text-less draft: still a Substack export with nothing to move
  const none = await inspect('n.zip', z({ 'posts.csv': csv.split('\n').filter((l, i) => i === 0 || /104|106/.test(l)).join('\n') }));
  eq('substack with nothing to move', [none.kind, none.published, none.drafts, none.substack.threads, none.substack.draftsWithoutText], ['substack', 0, 0, 1, 1]);
  try { await inspect('bad.zip', z({ 'posts.csv': 'a,b\n1,2\n' })); eq('bad posts.csv throws', false, true); } catch (e) { eq('bad posts.csv throws', true, true); console.log('   ', e.message); }
}
// Hashnode and Webflow: HAND-MADE fixtures in the shape each service writes, not anybody's real blog.
// These run against a build with every BLOG_IMPORT_READS_* constant forced to true (FORCE_ON), because the
// committed build has them off. The committed build is checked for the opposite below.
{
  const { execFileSync } = await import('node:child_process');
  const { mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const tmp = mkdtempSync(path.join(tmpdir(), 'inspector-on-'));
  const onPath = path.join(tmp, 'inspector.js');
  execFileSync('sh', ['tools-src/build.sh'], { env: { ...process.env, FORCE_ON: '1', OUT: onPath }, stdio: 'ignore' });
  const on = await import(pathToFileURL(onPath).href);
  const off = await import(pathToFileURL(path.resolve('assets/tools/inspector.js')).href);
  const u = (s) => new Uint8Array(strToU8(s));
  const text = (v) => [v.summary, ...v.rows.flat(), v.imageNote, v.pathNote, ...v.meaning, ...v.parserNotes, ...v.links.map((l) => l.title)].join('\n');

  // Hashnode
  const front = (title, slug, date, tags, body) => `---\ntitle: "${title}"\nseoDescription: "About ${title}"\ndatePublished: ${date}\ncuid: c${slug.replace(/-/g, '').padEnd(24, 'x').slice(0, 24)}\nslug: ${slug}\ncover: https://cdn.hashnode.com/res/hashnode/image/upload/v1/cover-${slug}.png\ntags: ${tags}\n---\n\n${body}\n`;
  const hn = {
    'cfirstpostxxxxxxxxxxxxxx.md': front('First post', 'first-post', 'Mon Jan 01 2024 20:18:08 GMT+0000 (Coordinated Universal Time)', 'web, css', '![a](https://cdn.hashnode.com/res/hashnode/image/upload/v1/a.png align="center")\n\nText.\n\n![b](https://cdn.hashnode.com/res/hashnode/image/upload/v1/b.png)'),
    'csecondpostxxxxxxxxxxxxx.md': front('Second post', 'second-post', 'Tue Mar 05 2024 09:00:00 GMT+0000 (Coordinated Universal Time)', 'web', '![c](https://cdn.hashnode.com/res/hashnode/image/upload/v1/c.png)\n\nMore.'),
    // Older shape: no front matter, so no date and no slug
    'colderpostxxxxxxxxxxxxxx.md': '# Old post\n\n![d](https://example.org/d.png)\n\nOld text.\n',
    'README.md': '# My backups\n',
    'notes.md': 'just a note, no heading\n',
  };
  const h = await on.inspect('hashnode.zip', zipSync(Object.fromEntries(Object.entries({ ...hn }).map(([k, v]) => [`hashnode-backups-main/${k}`, u(v)]))));
  console.log('hashnode', JSON.stringify(h));
  eq('hashnode kind routed from zip', h.kind, 'hashnode');
  eq('hashnode published/drafts', [h.published, h.drafts], [3, 0]);
  eq('hashnode tags/authors/categories', [h.tags, h.authors, h.categories], [2, 0, 0]);
  eq('hashnode images + hosts', [h.images.total, h.images.hosts], [4, [['cdn.hashnode.com', 3], ['example.org', 1]]]);
  eq('hashnode paths are /slug, older shape has none', [h.paths.total, h.paths.sample.sort()], [2, ['/first-post', '/second-post']]);
  eq('hashnode dates ignore the undated post', [h.dates.first.slice(0, 10), h.dates.last.slice(0, 10)], ['2024-01-01', '2024-03-05']);
  eq('hashnode pages/comments/replies null', [h.pages, h.comments, h.replies], [null, null, null]);
  eq('hashnode notes say undated, skipped file, old addresses', [/1 post has no publish date/.test(h.notes.join('\n')), /1 file is not a Hashnode post/.test(h.notes.join('\n')), h.notes.some((x) => /domain/.test(x))], [true, true, true]);
  // The same files chosen one by one
  const many = await on.inspectFiles(Object.entries(hn).map(([name, v]) => ({ name, bytes: u(v) })));
  eq('hashnode several .md files', [many.kind, many.published, many.fileName], ['hashnode', 3, '5 files']);
  const one = await on.inspectFiles([{ name: 'cfirstpostxxxxxxxxxxxxxx.md', bytes: u(hn['cfirstpostxxxxxxxxxxxxxx.md']) }]);
  eq('hashnode single .md file', [one.kind, one.published, one.images.total], ['hashnode', 1, 2]);
  try { await on.inspectFiles([{ name: 'a.md', bytes: u('# x') }, { name: 'b.xml', bytes: u('<a/>') }]); eq('mixed files throw', false, true); } catch { eq('mixed files throw', true, true); }
  try { await on.inspect('README.md', u('# Readme\n')); eq('md without posts throws', false, true); } catch (e) { eq('md without posts throws', /No Hashnode posts/.test(e.message), true); }
  eq('medium zip still goes to medium with the new routing', (await on.inspect('medium.zip', zip)).kind, 'medium');

  // Webflow
  const wfHead = 'Name,Slug,Collection ID,Item ID,Created On,Updated On,Published On,Post Body,Post Summary,Main Image,Date,Category,Draft,Archived';
  const D = (s) => `${s} GMT+0000 (Coordinated Universal Time)`;
  const row = (name, slug, id, pub, body, date, cat, draft, arch) => [name, slug, 'col1', id, D('Mon Jan 01 2024 10:00:00'), D('Mon Jan 01 2024 10:00:00'), pub ? D(pub) : '', body, `About ${name}`, 'https://cdn.prod.website-files.com/abc/cover.png', date ? D(date) : '', cat, draft, arch].map((v) => `"${v.replace(/"/g, '""')}"`).join(',');
  const wf = [
    wfHead,
    row('One, the first', 'one', 'i1', 'Mon Jan 15 2024 10:00:00', '<p>Hello, "world"</p><img src="https://cdn.prod.website-files.com/abc/a.png"><img src="https://cdn.prod.website-files.com/abc/b.png">', 'Tue Jan 16 2024 00:00:00', 'News;Guides', 'false', 'false'),
    row('Two', 'two', 'i2', 'Fri Mar 01 2024 10:00:00', '<p>Second\nline</p><img src="https://example.org/c.png">', '', 'News', 'false', 'false'),
    row('Three draft', 'three', 'i3', '', '<p>Draft</p>', 'Mon Dec 01 2031 00:00:00', 'Guides', 'true', 'false'),
    row('Four archived', 'four', 'i4', 'Sat Feb 03 2024 10:00:00', '<p>Gone</p>', '', 'News', 'false', 'true'),
  ].join('\r\n');
  const w = await on.inspect('blog.csv', u('﻿' + wf));
  console.log('webflow', JSON.stringify(w));
  eq('webflow kind', w.kind, 'webflow');
  eq('webflow published/drafts (archived left out)', [w.published, w.drafts], [2, 1]);
  eq('webflow authors/categories/tags', [w.authors, w.categories, w.tags], [0, 2, 0]);
  eq('webflow images + hosts', [w.images.total, w.images.hosts], [3, [['cdn.prod.website-files.com', 2], ['example.org', 1]]]);
  eq('webflow paths /blog/slug', [w.paths.total, w.paths.sample.every((x) => /^\/blog\/[a-z]+$/.test(x))], [3, true]);
  eq('webflow dates ignore the draft in 2031', [w.dates.first.slice(0, 10), w.dates.last.slice(0, 10)], ['2024-01-16', '2024-03-01']);
  eq('webflow guessed columns note', w.notes[0], 'Guessed from the column names: body "Post Body", excerpt "Post Summary", cover "Main Image", date "Date", categories "Category". If one is wrong, rename that column in the CSV and choose the file again.');
  eq('webflow note about posts using Published On', w.notes.some((x) => /1 post has no value in "Date"/.test(x)), true);
  eq('webflow note about archived', w.notes.some((x) => /1 archived item was left out/.test(x)), true);
  try { await on.inspect('x.csv', u('a,b\n1,2\n')); eq('other csv throws', false, true); } catch { eq('other csv throws', true, true); }

  // Page text with the constants on
  for (const [label, rep] of [['hashnode', h], ['webflow', w]]) {
    const v = on.describe(rep);
    const t = text(v);
    eq(`${label} on: closing line points to the plugin`, [v.links[0].href.includes('framer.com/marketplace/plugins/blog-import'), /Blog Import (adds|copies|brings)/.test(t)], [true, true]);
    eq(`${label} on: parser notes shown`, v.parserNotes.length, rep.notes.length);
    eq(`${label} on: no em dash, no label colons`, [/—/.test(t), /^[A-Z][^.\n]{0,30}:\s/m.test(v.summary + '\n' + v.meaning.join('\n'))], [false, false]);
  }
  eq('webflow on: rows', on.describe(w).rows, [['Published posts', '2'], ['Drafts', '1'], ['Authors', '0'], ['Categories', '2'], ['Tags', '0']]);
  eq('hashnode on: rows (no drafts, authors, categories)', on.describe(h).rows, [['Published posts', '3'], ['Tags', '2']]);
  eq('hashnode on: dates line', /Published posts run from 1 Jan 2024 to 5 Mar 2024\./.test(on.describe(h).summary + ' ' + on.describe(h).dateNote), true);
  eq('on: accept list', [on.accepted().accept.includes('.csv'), on.accepted().accept.includes('.md'), on.accepted().label], [true, true, 'Export file (.xml, .json, .zip, .csv or .md)']);

  // Constants off: the same results make no claim about Blog Import, and the page does not offer the types
  for (const [label, rep] of [['hashnode', h], ['webflow', w]]) {
    const v = off.describe(rep);
    eq(`${label} off: no claim about Blog Import, no marketplace link, no notes`, [/Blog Import|Framer Pro|free \d+/.test(text(v)), v.links.some((l) => /marketplace/.test(l.href)), v.parserNotes.length], [false, false, 0]);
  }
  eq('off: accept list has no .csv or .md', [off.accepted().accept.includes('.csv'), off.accepted().accept.includes('.md'), off.accepted().label], [false, false, 'Export file (.xml, .json or .zip)']);
  eq('off: error text does not mention Webflow or Hashnode', /Webflow|Hashnode/.test(off.accepted().error), false);

  // The page itself in jsdom: what the input accepts, and what a .csv or .md does when chosen anyway
  const page = (mod) => {
    const d = new JSDOM('<!doctype html><body><label for="export-file">Export file (.xml, .json or .zip)</label><input type="file" id="export-file" accept=".xml,.json,.zip"><div id="result"></div></body>');
    d.window.HTMLElement.prototype.scrollIntoView = () => {};
    mod.mount(d.window.document, mod.inspect);
    return d.window;
  };
  const choose = async (win, files) => {
    const input = win.document.getElementById('export-file');
    Object.defineProperty(input, 'files', { configurable: true, value: files.map(([name, s]) => ({ name, arrayBuffer: async () => u(s).buffer })) });
    input.dispatchEvent(new win.Event('change'));
    await new Promise((r) => setTimeout(r, 50));
    return win.document.getElementById('result').textContent;
  };
  const won = page(on), woff = page(off);
  const inOn = won.document.getElementById('export-file'), inOff = woff.document.getElementById('export-file');
  eq('page on: input accepts .csv and .md, several files', [inOn.accept.includes('.csv'), inOn.accept.includes('.md'), inOn.hasAttribute('multiple'), won.document.querySelector('label').textContent], [true, true, true, 'Export file (.xml, .json, .zip, .csv or .md)']);
  eq('page off: input unchanged, single file', [inOff.accept, inOff.hasAttribute('multiple'), woff.document.querySelector('label').textContent], ['.xml,.json,.zip', false, 'Export file (.xml, .json or .zip)']);
  const outCsv = await choose(woff, [['blog.csv', wf]]);
  eq('page off: a .csv chosen anyway is refused', /can't be read as a blog export/.test(outCsv) && !/Webflow/.test(outCsv), true);
  const outMd = await choose(woff, Object.entries(hn));
  eq('page off: .md files chosen anyway are refused', /can't be read as a blog export/.test(outMd) && !/Hashnode/.test(outMd), true);
  const onCsv = await choose(won, [['blog.csv', wf]]);
  eq('page on: .csv result shows counts, notes and the plugin line', [/This looks like a Webflow export/.test(onCsv), /Guessed from the column names/.test(onCsv), /Open Blog Import in the Framer Marketplace/.test(onCsv)], [true, true, true]);
  const onMd = await choose(won, Object.entries(hn));
  eq('page on: several .md files give a Hashnode result', [/This looks like a Hashnode export/.test(onMd), /Open Blog Import in the Framer Marketplace/.test(onMd)], [true, true]);
}
// Errors
for (const [label, data] of [['not xml', new Uint8Array(strToU8('hello'))], ['plain xml', new Uint8Array(strToU8('<a/>'))]]) {
  try { await inspect('x', data); eq(label + ' throws', false, true); } catch (e) { eq(label + ' throws', true, true); console.log('   ', e.message); }
}
process.exit(fail ? 1 : 0);
