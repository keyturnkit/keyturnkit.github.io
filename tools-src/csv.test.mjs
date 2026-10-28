// Tests the built assets/tools/csv.js in jsdom: the five CSV converters and the image list.
// Usage: node tools-src/csv.test.mjs <fixtures dir> [dev-data dir] [extra dir with ghost-real/*.json]
// Counts are made from the raw files (regex, JSON.parse, unzip), not with the parsers under test.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root = process.env.BLOG_IMPORT ?? `${process.env.HOME}/sandbox/99_sideline/team3-chichi/products/wp-import`;
const require = createRequire(`${root}/package.json`);
const { JSDOM } = require('jsdom');
const { unzipSync, strFromU8 } = require('fflate');
const [fixtures, devData = `${fixtures}/../../.dev-data`, extra] = process.argv.slice(2);
globalThis.DOMParser = new JSDOM('').window.DOMParser;
const m = await import(pathToFileURL(path.resolve(process.env.CSV_JS ?? 'assets/tools/csv.js')).href);
let fail = 0;
const eq = (label, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fail++; console.log(ok ? 'ok  ' : 'FAIL', label, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };

// Independent RFC 4180 reader
function parse(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\r' && text[i + 1] === '\n') { row.push(f); rows.push(row); row = []; f = ''; i++; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}

// Escaping
eq('plain stays bare', m.csvField('hello'), 'hello');
eq('comma quoted', m.csvField('a,b'), '"a,b"');
eq('quote doubled', m.csvField('say "hi"'), '"say ""hi"""');
eq('newline quoted', m.csvField('a\nb'), '"a\nb"');
eq('CRLF quoted', m.csvField('a\r\nb'), '"a\r\nb"');
eq('empty', m.csvField(''), '');
const nasty = ['<p class="x">Hi, "you"</p>\n<p>line2\r\nline3</p>', 'a,b', '"', '""', ',', '\n', ' lead and trail ', 'ünï 日本語 🌱'];
const rt = parse(m.toCsv([['h1', 'h2'], ...nasty.map((v) => [v, 'x'])]));
eq('round trip nasty cells', rt.slice(1).map((r) => r[0]), nasty);
eq('round trip columns constant', rt.every((r) => r.length === 2), true);
eq('headers', [m.HEADERS.length, m.HEADERS[9]], [10, ':draft']);
eq('csvName', [m.csvName('My Blog (1).xml'), m.csvName('.xml'), m.csvName('a.json', 'images')], ['My-Blog-1-framer.csv', 'blog-framer.csv', 'a-images.csv']);
// Framer's own test for an image column (copied from framer/plugins csv-import typeInference.ts)
eq('image test', ['https://a.com/x.jpg', 'http://a.com/x.PNG', 'https://a.com/x.jpg?format=1500w', 'https://a.com/x', '/x.jpg'].map((u) => m.FRAMER_IMAGE_URL.test(u)), [true, true, false, false, false]);

// ---- independent counters on the raw files
const IMG = /<img\b[^>]*>/gi;
const imgs = (s) => (s.match(IMG) ?? []).length;
const rawWxr = (xml) => {
  let pub = 0, other = 0, bodyImgs = 0, galleries = /\[gallery/.test(xml);
  for (const it of xml.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
    if (!/<wp:post_type>(?:<!\[CDATA\[)?post(?:\]\]>)?<\/wp:post_type>/.test(it)) continue;
    const st = it.match(/<wp:status>(?:<!\[CDATA\[)?([^\]<]*)(?:\]\]>)?<\/wp:status>/)?.[1];
    if (['trash', 'auto-draft', 'inherit'].includes(st)) continue;
    st === 'publish' ? pub++ : other++;
    bodyImgs += imgs(it.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] ?? '');
  }
  return { pub, other, bodyImgs, galleries };
};
const rawBlogger = (xml) => {
  let pub = 0, other = 0, bodyImgs = 0;
  for (const e of xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []) {
    const type = e.match(/<blogger:type>(\w+)</)?.[1];
    const isPost = type ? type === 'POST' : /kind#post'/.test(e);
    if (!isPost || /<blogger:status>DELETED</.test(e)) continue;
    (/<blogger:status>DRAFT</.test(e) || /<app:draft>yes</.test(e)) ? other++ : pub++;
    bodyImgs += (e.match(/&lt;img\b/gi) ?? []).length;
  }
  return { pub, other, bodyImgs };
};
const GHOST_REL = /^(?:__GHOST_URL__|\/(?!\/))/;
const rawGhost = (json) => {
  const root = JSON.parse(json);
  const data = (Array.isArray(root.db) ? root.db[0] : root).data;
  let pub = 0, other = 0, bodyImgs = 0, relBody = 0, relCover = 0, covers = 0, emptyBodies = 0, firstHttpCover = 0, firstRelCover = 0;
  for (const p of data.posts) {
    if ((p.type && p.type !== 'post') || p.status === 'deleted') continue;
    p.status === 'published' ? pub++ : other++;
    const html = typeof p.html === 'string' ? p.html : '';
    if (!html.trim()) emptyBodies++;
    const tags = html.match(IMG) ?? [];
    bodyImgs += tags.length;
    relBody += tags.filter((t) => GHOST_REL.test(t.match(/\ssrc\s*=\s*["']([^"']*)/i)?.[1] ?? '')).length;
    const feat = (p.feature_image ?? '').trim();
    if (feat) { covers++; if (GHOST_REL.test(feat)) relCover++; }
    else if (tags[0]) {
      // No feature image: the reader takes the first image of the post as the cover. With Ghost's stand-in address a relative first image counts too.
      const src = tags[0].match(/\ssrc\s*=\s*["']([^"']*)/i)?.[1] ?? '';
      if (/^https?:/.test(src)) firstHttpCover++;
      else if (GHOST_REL.test(src)) firstRelCover++;
    }
  }
  return { pub, other, bodyImgs, relBody, relCover, covers, emptyBodies, firstHttpCover, firstRelCover };
};
const rawMedium = (zip) => {
  const files = unzipSync(zip, { filter: (f) => /(?:^|\/)posts\/[^/]+\.html$/i.test(f.name) });
  let pub = 0, other = 0, replies = 0, bodyImgs = 0;
  for (const [name, data] of Object.entries(files)) {
    const html = strFromU8(data);
    const body = html.indexOf('data-field="body"');
    if (body < 0 || !/graf--title/.test(html.slice(body))) { replies++; continue; }
    (/^draft_/i.test(name.split('/').pop()) || !/class="dt-published"/.test(html)) ? other++ : pub++;
    bodyImgs += imgs(html.slice(body));
  }
  return { pub, other, replies, bodyImgs };
};

// ---- fixtures: every source file the repo has
const cases = [
  { dir: fixtures, f: 'squarespace-sample.xml', kind: 'squarespace', raw: (b) => rawWxr(strFromU8(b)) },
  { dir: fixtures, f: 'theme-unit-test.xml', kind: 'wordpress', raw: (b) => rawWxr(strFromU8(b)) },
  { dir: fixtures, f: 'demo-blog.xml', kind: 'squarespace', raw: (b) => rawWxr(strFromU8(b)) },
  { dir: devData, f: 'squarespace-2017.xml', kind: 'squarespace', raw: (b) => rawWxr(strFromU8(b)) },
  { dir: devData, f: 'video-test.xml', kind: 'squarespace', raw: (b) => rawWxr(strFromU8(b)) },
  { dir: fixtures, f: 'blogger-new.xml', kind: 'blogger', raw: (b) => rawBlogger(strFromU8(b)) },
  { dir: fixtures, f: 'blogger-old.xml', kind: 'blogger', raw: (b) => rawBlogger(strFromU8(b)) },
  { dir: fixtures, f: 'ghost-export-sample.json', kind: 'ghost', raw: (b) => rawGhost(strFromU8(b)) },
  { dir: devData, f: 'medium-test.zip', kind: 'medium', raw: rawMedium },
];
if (extra) for (const f of readdirSync(`${extra}/ghost-real`).filter((x) => x.endsWith('.json'))) cases.push({ dir: `${extra}/ghost-real`, f, kind: 'ghost', raw: (b) => rawGhost(strFromU8(b)) });
if (extra && existsSync(`${extra}/real-exports/blogger-real.xml`)) cases.push({ dir: `${extra}/real-exports`, f: 'blogger-real.xml', kind: 'blogger', raw: (b) => rawBlogger(strFromU8(b)) });
if (extra && existsSync(`${extra}/real-exports/squarespace-real.xml`)) cases.push({ dir: `${extra}/real-exports`, f: 'squarespace-real.xml', kind: 'squarespace', raw: (b) => rawWxr(strFromU8(b)) });

const bad = /[—·…]|\b(?:Note|Warning|Tip):|\.\.\./;
const hype = /\b(?:powerful|seamless(?:ly)?|effortless(?:ly)?|amazing|blazing|revolutionary|game-changing|supercharge|magic(?:al)?|ultimate|lightning)\b/i;
const label = /^[A-Z][\w ]{0,20}: /;
const textOk = (s) => !bad.test(s) && !hype.test(s) && !label.test(s);
const counts = [];
for (const c of cases) {
  const bytes = new Uint8Array(readFileSync(`${c.dir}/${c.f}`));
  const raw = c.raw(bytes);
  const tag = c.f;
  eq(`${tag} shape`, m.shapeOf(bytes), { squarespace: 'wxr', wordpress: 'wxr', blogger: 'blogger', ghost: 'ghost', medium: 'zip' }[c.kind]);
  // CSV
  const content = await m.readExport(bytes);
  const a = m.convert(content, false), b = m.convert(content, true);
  eq(`${tag} kind`, a.kind, c.kind);
  eq(`${tag} published/other = raw`, [a.published, a.drafts], [raw.pub, raw.other]);
  const ra = parse(a.csv), rb = parse(b.csv);
  eq(`${tag} CSV rows (no drafts) = raw published`, ra.length - 1, raw.pub);
  eq(`${tag} CSV rows (with drafts) = raw published+other`, rb.length - 1, raw.pub + raw.other);
  eq(`${tag} every row has 10 cells`, rb.every((r) => r.length === 10), true);
  eq(`${tag} header row`, rb[0], [...m.HEADERS]);
  eq(`${tag} titles survive`, rb.slice(1).map((r) => r[0]), content.posts.map((p) => p.title));
  eq(`${tag} content survives`, rb.slice(1).map((r) => r[4]), content.posts.map((p) => p.html));
  eq(`${tag} slugs non-empty and unique`, new Set(rb.slice(1).map((r) => r[1])).size === rb.length - 1 && rb.slice(1).every((r) => r[1]), true);
  eq(`${tag} dates ISO or empty`, rb.slice(1).every((r) => r[2] === '' || /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(r[2])), true);
  eq(`${tag} :draft is true/false only`, rb.slice(1).every((r) => r[9] === 'true' || r[9] === 'false'), true);
  eq(`${tag} :draft true count = raw drafts (with drafts)`, rb.slice(1).filter((r) => r[9] === 'true').length, raw.other);
  eq(`${tag} :draft all false without drafts`, ra.slice(1).every((r) => r[9] === 'false'), true);
  const coverCells = rb.slice(1).map((r) => r[5]).filter(Boolean);
  eq(`${tag} cover cells not image-like = coverNotImage`, coverCells.filter((u) => !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(u.trim())).length, b.coverNotImage);
  eq(`${tag} withCover = non-empty cover cells`, coverCells.length, b.withCover);
  if (c.kind !== 'wordpress' && c.kind !== 'squarespace') eq(`${tag} Categories column empty`, rb.slice(1).every((r) => r[7] === ''), true);
  const d = m.describeCsv(a, false), d2 = m.describeCsv(b, true);
  eq(`${tag} page text clean`, [d, d2].every((x) => [x.summary, ...x.limits, x.blogImport, x.draftLabel].every(textOk)), true);
  eq(`${tag} summary mentions the source and counts`, d.summary.startsWith(`This is a ${{ wordpress: 'WordPress', squarespace: 'Squarespace', blogger: 'Blogger', ghost: 'Ghost', medium: 'Medium' }[c.kind]} export with ${raw.pub} published`) && d.summary.includes(`The CSV has ${raw.pub} row`), true);
  eq(`${tag} cover-not-image sentence appears iff count > 0`, d2.limits.some((l) => /Add an Image field to your collection before importing/.test(l)), b.coverNotImage > 0);

  // per source facts
  if (c.kind === 'ghost') {
    eq(`${tag} ghost: images left out = raw relative (body + cover)`, [b.imagesLeftOut, b.bodyImages], [raw.relBody + raw.relCover, raw.bodyImgs - raw.relBody]);
    eq(`${tag} ghost: no __GHOST_URL__ left in Content`, rb.slice(1).some((r) => /__GHOST_URL__/.test(r[4]) && /<img[^>]*__GHOST_URL__/.test(r[4])), false);
    eq(`${tag} ghost: empty bodies = raw`, b.emptyBodies, raw.emptyBodies);
    eq(`${tag} ghost: left-out sentence iff any`, d2.limits.some((l) => /without the site address/.test(l)), b.imagesLeftOut > 0);
  }
  if (c.kind === 'medium') eq(`${tag} medium: replies note = raw replies`, b.notes.length ? Number(b.notes[0].match(/^(\d+)/)?.[1] ?? 1) : 0, raw.replies);
  if (c.kind !== 'ghost') eq(`${tag} body images in CSV = raw img tags${raw.galleries ? ' (>=, gallery shortcodes add some)' : ''}`, raw.galleries ? b.bodyImages >= raw.bodyImgs : b.bodyImages, raw.galleries ? true : raw.bodyImgs);

  // Image list (all posts)
  const il = await m.readForImages(bytes);
  const l = m.listImages(il, true), lp = m.listImages(il, false);
  const rl = parse(l.csv);
  eq(`${tag} image CSV header`, rl[0], ['Post title', 'Post status', 'Image kind', 'Image address', 'Address type']);
  eq(`${tag} image CSV rows = list rows, 5 cells each`, [rl.length - 1, rl.every((r) => r.length === 5)], [l.rows.length, true]);
  eq(`${tag} image list: in-body rows ${c.kind === 'ghost' ? '= raw img tags' : raw.galleries ? '>= raw img tags' : '= raw img tags'}`, raw.galleries ? l.inBody >= raw.bodyImgs : l.inBody, raw.galleries ? true : raw.bodyImgs);
  eq(`${tag} image list: Draft rows only from drafts`, rl.slice(1).filter((r) => r[1] === 'Draft').every((r) => content.posts.some((p) => p.draft && p.title === r[0])), true);
  eq(`${tag} image list without drafts <= with drafts`, lp.rows.length <= l.rows.length && lp.postsListed === raw.pub, true);
  eq(`${tag} covers+inBody = rows`, l.covers + l.inBody, l.rows.length);
  eq(`${tag} address types add up`, l.rows.filter((r) => r.type === 'full').length + l.relative + l.embedded, l.rows.length);
  eq(`${tag} full addresses all start http(s)`, rl.slice(1).filter((r) => r[4] === 'Full address').every((r) => /^https?:\/\//.test(r[3])), true);
  eq(`${tag} no stand-in host leaks into the list`, rl.some((r) => /ghost-export\.invalid/.test(r.join(','))), false);
  if (c.kind === 'ghost') {
    eq(`${tag} ghost list: relative = raw relative body + feature covers + relative first-image covers`, l.relative, raw.relBody + raw.relCover + raw.firstRelCover);
    eq(`${tag} ghost list: cover rows = raw feature images + first-image covers`, l.covers, raw.covers + raw.firstHttpCover + raw.firstRelCover);
    eq(`${tag} ghost list: relative rows start with /`, rl.slice(1).filter((r) => r[4].startsWith('Relative')).every((r) => r[3].startsWith('/')), true);
  } else eq(`${tag} non-Ghost list has no relative or embedded rows`, [l.relative, l.embedded], [0, 0]);
  const di = m.describeImages(l, true);
  eq(`${tag} image page text clean`, [di.summary, ...di.notes, di.last].every(textOk), true);
  eq(`${tag} relative note iff relative`, di.notes.some((x) => /relative/.test(x)), l.relative > 0);
  counts.push({ f: c.f, kind: c.kind, published: raw.pub, drafts: raw.other, csvRows: ra.length - 1, csvRowsWithDrafts: rb.length - 1, coverCells: b.withCover, coverNotImage: b.coverNotImage, bodyImgsRaw: raw.bodyImgs, bodyImgsCsv: b.bodyImages, ghostLeftOut: b.imagesLeftOut, listRows: l.rows.length, listCovers: l.covers, listBody: l.inBody, distinct: l.distinct, relative: l.relative });
}
console.table(counts);

// Hand-checked facts on small fixtures
{
  const g = await m.readForImages(new Uint8Array(readFileSync(`${fixtures}/ghost-export-sample.json`)));
  const l = m.listImages(g, true);
  eq('ghost sample list (written out by hand)', l.rows.map((r) => [r.post, r.kind, r.address, r.type]), [
    ['Second post', 'cover', 'https://cdn.example.org/cover2.jpg', 'full'],
    ['Hello Ghost', 'cover', '/content/images/2024/01/cover.jpg', 'relative'],
    ['Hello Ghost', 'in body', '/content/images/2024/01/a.jpg', 'relative'],
    ['Hello Ghost', 'in body', 'https://images.example.org/remote.jpg', 'full'],
  ]);
  const plain = await m.readExport(new Uint8Array(readFileSync(`${fixtures}/ghost-export-sample.json`)));
  const cc = m.convert(plain, false);
  eq('ghost sample CSV: 2 left out, 1 kept, cover of Hello Ghost empty then first full image', [cc.imagesLeftOut, cc.bodyImages, parse(cc.csv)[2][5]], [2, 1, 'https://images.example.org/remote.jpg']);
}
{
  // Edge cases of the image list on a hand-made WordPress export: lazy images, relative, embedded, no address
  const xml = `<?xml version="1.0"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wp="http://wordpress.org/export/1.2/" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>t</title><link>https://t.example</link><wp:wxr_version>1.2</wp:wxr_version>
<item><title>Edge</title><link>https://t.example/edge/</link><dc:creator>a</dc:creator><wp:post_id>1</wp:post_id><wp:post_date_gmt>2024-01-01 00:00:00</wp:post_date_gmt><wp:post_name>edge</wp:post_name><wp:status>publish</wp:status><wp:post_type>post</wp:post_type><content:encoded><![CDATA[<p><img src="/wp-content/uploads/a.jpg"><img data-src="https://cdn.example/lazy.jpg" src="data:image/gif;base64,R0lGOD"><img src="data:image/png;base64,AAAA"><img alt="none"><img src="https://cdn.example/x.png?format=1500w"></p>]]></content:encoded></item></channel></rss>`;
  const l = m.listImages(await m.readExport(new TextEncoder().encode(xml)), true);
  eq('edge list', l.rows.map((r) => [r.kind, r.address, r.type]), [
    ['in body', '/wp-content/uploads/a.jpg', 'relative'],
    ['in body', 'https://cdn.example/lazy.jpg', 'full'],
    ['in body', 'data:image/png;base64', 'embedded'],
    ['in body', 'https://cdn.example/x.png?format=1500w', 'full'],
  ]);
  eq('edge: one tag without an address counted', l.noAddress, 1);
  const cv = m.convert(await m.readExport(new TextEncoder().encode(xml)), false);
  eq('edge: no cover when the first image has no full address (reader behaviour)', [cv.withCover, cv.coverNotImage], [0, 0]);
}

// Not an export
try { await m.readExport(new TextEncoder().encode('<rss><channel></channel></rss>')); eq('non-WordPress xml throws', false, true); } catch (e) { eq('non-WordPress xml throws WxrError (instanceof, survives minify)', e instanceof m.WxrError, true); }
try { await m.readExport(new TextEncoder().encode('{"db":[{"data":{}}]}')); eq('ghost json without posts throws', false, true); } catch (e) { eq('ghost json without posts throws WxrError', e instanceof m.WxrError, true); }
try { await m.readExport(new Uint8Array([0x50, 0x4b, 3, 4, 0, 0])); eq('broken zip throws', false, true); } catch (e) { eq('broken zip throws WxrError', e instanceof m.WxrError, true); }

// Page markdown files in the repo
const site = path.resolve('.');
const pages = ['tools/wordpress-xml-to-framer-csv', 'tools/blogger-to-framer-csv', 'tools/ghost-to-framer-csv', 'tools/medium-to-framer-csv', 'tools/blog-export-image-list', 'tools/blog-export-inspector'];
for (const p of pages) {
  const f = `${site}/${p}/index.md`;
  if (!existsSync(f)) { eq(`${p} exists`, false, true); continue; }
  const text = readFileSync(f, 'utf8');
  eq(`${p} copy clean (no em dash, middle dot, ellipsis, colon label, hype)`, [bad.test(text.replace(/^---[\s\S]*?---/, '')), hype.test(text), /^[A-Z][\w ]{0,20}: /m.test(text.replace(/^---[\s\S]*?---/, ''))], [false, false, false]);
  eq(`${p} loads csv.js or inspector.js, no other script`, [...text.matchAll(/<script[^>]*src="([^"]+)"/g)].map((x) => x[1].split('?')[0]).every((s) => ['/assets/tools/csv.js', '/assets/tools/inspector.js'].includes(s)), true);
  if (p !== 'tools/blog-export-inspector') eq(`${p} sitemap lists it`, readFileSync(`${site}/sitemap.txt`, 'utf8').includes(`https://keyturnkit.github.io/${p}/`), true);
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
