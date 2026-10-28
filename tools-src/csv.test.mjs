// Tests the built assets/tools/csv.js in jsdom. Usage: node tools-src/csv.test.mjs <fixtures dir>
// Row counts are counted from the raw XML with a regex, not with the parser under test.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root = process.env.BLOG_IMPORT ?? `${process.env.HOME}/sandbox/99_sideline/team3-chichi/products/wp-import`;
const { JSDOM } = createRequire(`${root}/package.json`)('jsdom');
const fixtures = process.argv[2];
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
eq('headers', m.HEADERS.length, 9);
eq('csvName', [m.csvName('My Blog (1).xml'), m.csvName('.xml')], ['My-Blog-1-framer.csv', 'blog-framer.csv']);

// Real fixtures
const countPosts = (xml) => {
  let pub = 0, other = 0;
  for (const it of xml.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
    if (!/<wp:post_type>(?:<!\[CDATA\[)?post(?:\]\]>)?<\/wp:post_type>/.test(it)) continue;
    const st = it.match(/<wp:status>(?:<!\[CDATA\[)?([^\]<]*)(?:\]\]>)?<\/wp:status>/)?.[1];
    if (['trash', 'auto-draft', 'inherit'].includes(st)) continue;
    st === 'publish' ? pub++ : other++;
  }
  return [pub, other];
};
for (const [f, kind] of [['squarespace-sample.xml', 'squarespace'], ['theme-unit-test.xml', 'wordpress'], ['demo-blog.xml', 'squarespace']]) {
  const bytes = new Uint8Array(readFileSync(`${fixtures}/${f}`));
  const xml = readFileSync(`${fixtures}/${f}`, 'utf8');
  const [pub, other] = countPosts(xml);
  const content = m.readExport(bytes);
  const a = m.convert(content, false), b = m.convert(content, true);
  console.log(f, JSON.stringify({ kind: a.kind, published: a.published, drafts: a.drafts, rows: a.rows, rowsWithDrafts: b.rows, withCover: a.withCover, bodyImages: a.bodyImages, bytes: a.csv.length }));
  eq(`${f} kind`, a.kind, kind);
  eq(`${f} raw count published/other`, [a.published, a.drafts], [pub, other]);
  const ra = parse(a.csv), rb = parse(b.csv);
  eq(`${f} CSV rows (no drafts) = published`, ra.length - 1, pub);
  eq(`${f} CSV rows (with drafts) = published+drafts`, rb.length - 1, pub + other);
  eq(`${f} every row has 9 cells`, rb.every((r) => r.length === 9), true);
  eq(`${f} titles survive`, rb.slice(1).map((r) => r[0]), content.posts.map((p) => p.title));
  eq(`${f} content survives`, rb.slice(1).map((r) => r[4]), content.posts.map((p) => p.html));
  eq(`${f} slugs non-empty and unique`, new Set(rb.slice(1).map((r) => r[1])).size === rb.length - 1 && rb.slice(1).every((r) => r[1]), true);
  eq(`${f} dates ISO or empty`, rb.slice(1).every((r) => r[2] === '' || /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(r[2])), true);
  eq(`${f} published dates all present`, ra.slice(1).every((r) => r[2]), true);
  const quoteNeeded = rb.slice(1).filter((r) => /[",\r\n]/.test(r[4])).length;
  console.log('   rows whose content needs quoting:', quoteNeeded);
}
{
  const content = m.readExport(new Uint8Array(readFileSync(`${fixtures}/squarespace-sample.xml`)));
  const row = m.convert(content, false);
  const r = parse(row.csv)[1];
  console.log('   sqs row:', JSON.stringify(r.map((v) => v.slice(0, 60))));
}
{
  const content = m.readExport(new Uint8Array(readFileSync(`${fixtures}/theme-unit-test.xml`)));
  const r = parse(m.convert(content, true).csv);
  const withCat = r.slice(1).filter((x) => x[7]).length, withTag = r.slice(1).filter((x) => x[8]).length;
  console.log('   theme-unit-test rows with categories/tags/author:', withCat, withTag, r.slice(1).filter((x) => x[6]).length);
  eq('theme-unit-test has categories and tags as comma text', withCat > 0 && withTag > 0, true);
}
// Not an export
try { m.readExport(new TextEncoder().encode('<rss><channel></channel></rss>')); eq('non-WordPress xml throws', false, true); } catch (e) { eq('non-WordPress xml throws WxrError (instanceof, survives minify)', e instanceof m.WxrError, true); console.log('   ', e.message); }
// Page text rules
const bad = /[—·…]|\b(?:Note|Warning|Tip):/;
const c = m.convert(m.readExport(new Uint8Array(readFileSync(`${fixtures}/squarespace-sample.xml`))), false);
const d = m.describeCsv(c, false);
eq('page text has no banned characters', bad.test([d.summary, ...d.limits, d.blogImport].join(' ')), false);
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
