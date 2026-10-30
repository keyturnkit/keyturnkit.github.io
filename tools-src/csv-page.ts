// Page for the WordPress/Squarespace XML to Framer CSV tool. All text goes in with textContent, never innerHTML.
import { convert, csvName, readExport, shapeOf, WxrError } from './csv';
import type { Conversion, Shape, Source } from './csv';
import type { SiteContent } from '@parsers/types';

export const MARKETPLACE = 'https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/';
export const n = (count: number, one: string, many = `${one}s`) => `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`;

export function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, attrs: Record<string, string> = {}, ...kids: (Node | string)[]): HTMLElementTagNameMap[K] {
  const e = doc.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
}

interface Names { name: string; post: string; posts: string; old: string; fileHint: string; page: string }
export const NAMES: Record<Source, Names> = {
  wordpress: { name: 'WordPress', post: 'post', posts: 'posts', old: 'old site', fileHint: 'the .xml file from the WordPress export screen', page: '/tools/wordpress-xml-to-framer-csv/' },
  squarespace: { name: 'Squarespace', post: 'post', posts: 'posts', old: 'old site', fileHint: 'the .xml file from the Squarespace export', page: '/tools/wordpress-xml-to-framer-csv/' },
  blogger: { name: 'Blogger', post: 'post', posts: 'posts', old: 'old blog', fileHint: 'the .xml file from Blogger, Settings, Back up content', page: '/tools/blogger-to-framer-csv/' },
  ghost: { name: 'Ghost', post: 'post', posts: 'posts', old: 'Ghost site', fileHint: 'the .json file from Ghost, Settings, Migration tools, Export', page: '/tools/ghost-to-framer-csv/' },
  medium: { name: 'Medium', post: 'story', posts: 'stories', old: 'Medium', fileHint: 'the .zip file from Medium, Download your information', page: '/tools/medium-to-framer-csv/' },
};

/** Text for the result, kept apart from the DOM so tests can read it. */
export function describeCsv(c: Conversion, includeDrafts: boolean): { summary: string; limits: string[]; blogImport: string; draftLabel: string } {
  const t = NAMES[c.kind];
  const ghost = c.kind === 'ghost';
  const draftOne = ghost ? 'unpublished post' : c.kind === 'medium' ? 'draft story' : 'draft';
  const draftMany = ghost ? 'unpublished posts' : c.kind === 'medium' ? 'draft stories' : 'drafts';
  const draftPart = c.drafts ? (includeDrafts ? ` and ${n(c.drafts, draftOne, draftMany)}` : `. ${n(c.drafts, draftOne, draftMany)} left out`) : '';
  const limits: string[] = [];
  if (ghost) {
    if (c.imagesLeftOut) {
      limits.push(
        `Ghost stored ${n(c.imagesLeftOut, 'image')} (in post text or as covers) without the site address, written as __GHOST_URL__ or as a bare /content/images path. The export does not say which site they were on, so the CSV leaves ${c.imagesLeftOut === 1 ? 'it' : 'them'} out.`,
      );
    }
    limits.push(
      c.bodyImages
        ? `${n(c.bodyImages, 'image')} in these posts ${c.bodyImages === 1 ? 'has' : 'have'} a full address and ${c.bodyImages === 1 ? 'is' : 'are'} kept in the Content column. ${c.bodyImages === 1 ? 'It still points' : 'They still point'} to where ${c.bodyImages === 1 ? 'it is' : 'they are'} hosted now.`
        : 'No image with a full address is left inside the text of these posts.',
    );
  } else if (c.kind === 'wordpress' || c.kind === 'squarespace') {
    limits.push(
      c.bodyImages
        ? `Images inside the posts still point at your old site. ${n(c.bodyImages, 'image')} in these posts will break when the old site goes away.`
        : 'These posts have no images inside the text, so nothing in the post bodies depends on your old site.',
    );
  } else {
    limits.push(
      c.bodyImages
        ? `Images inside the ${t.posts} keep their old addresses, and the CSV does not copy them into Framer. ${n(c.bodyImages, 'image')} in these ${t.posts}.`
        : `These ${t.posts} have no images inside the text.`,
    );
  }
  if (c.coverNotImage) {
    limits.push(
      `${c.coverNotImage} of the ${c.withCover} cover image addresses do not end in .jpg, .jpeg, .png, .gif, .webp or .svg. Framer's CSV Import will offer the Cover image column only as a link. Add an Image field to your collection before importing and map the column to it.`,
    );
  }
  limits.push('Old addresses get no redirects. Links to your old posts will not lead to the new ones.');
  if (c.kind === 'wordpress' || c.kind === 'squarespace') {
    limits.push('Authors, categories and tags come as plain text. They are not linked collections in Framer.');
  } else {
    const extra = ghost
      ? ' Only the first author of a post is kept, and Ghost\'s private tags (the ones starting with #) are left out.'
      : c.kind === 'blogger'
        ? ' Blogger labels are in the Tags column.'
        : '';
    limits.push(`Authors and tags come as plain text. They are not linked collections in Framer. The Categories column stays empty for ${t.name} exports.${extra}`);
  }
  if (c.kind === 'blogger') limits.push('Pages and comments in the file are not in the CSV.');
  if (ghost) {
    limits.push('Pages are not in the CSV.');
    if (c.emptyBodies) limits.push(`${n(c.emptyBodies, 'post')} ${c.emptyBodies === 1 ? 'has' : 'have'} no HTML text in the export, so the Content cell ${c.emptyBodies === 1 ? 'is' : 'cells are'} empty.`);
  }
  limits.push(...c.notes);
  const same = 'does those in Framer (redirects on Framer Pro). It is free, with no limit on posts.';
  return {
    summary: `This is a ${t.name} export with ${n(c.published, `published ${t.post}`, `published ${t.posts}`)}${draftPart}. The CSV has ${n(c.rows, 'row')}, one per ${t.post}. Cover image address found for ${c.withCover} of them.`,
    limits,
    blogImport: ghost
      ? 'copies the images that have a full address into Framer, links authors and tags, and adds redirects on Framer Pro. It is free, with no limit on posts.'
      : same,
    draftLabel: ghost ? ' Include unpublished posts (drafts, scheduled and sent)' : ' Include drafts',
  };
}

export function renderCsv(doc: Document, out: HTMLElement, fileName: string, content: SiteContent): void {
  const draw = (includeDrafts: boolean) => {
    const c = convert(content, includeDrafts);
    const d = describeCsv(c, includeDrafts);
    const nodes: HTMLElement[] = [];
    nodes.push(el(doc, 'h2', { tabindex: '-1', id: 'result-title' }, 'Your CSV'));
    nodes.push(el(doc, 'p', {}, d.summary));
    if (c.drafts) {
      const box = el(doc, 'input', { type: 'checkbox', id: 'with-drafts' });
      box.checked = includeDrafts;
      box.addEventListener('change', () => draw(box.checked));
      nodes.push(el(doc, 'p', { class: 'tool-opt' }, box, el(doc, 'label', { for: 'with-drafts' }, d.draftLabel)));
    }
    const link = el(doc, 'a', { class: 'btn btn-primary', id: 'download', download: csvName(fileName), href: URL.createObjectURL(new Blob([c.csv], { type: 'text/csv;charset=utf-8' })) }, 'Download CSV');
    nodes.push(el(doc, 'p', {}, link));
    if (c.preview.length) {
      const t = el(doc, 'table', { id: 'preview' });
      t.append(el(doc, 'thead', {}, el(doc, 'tr', {}, ...['Title', 'Slug', 'Date'].map((h) => el(doc, 'th', { scope: 'col' }, h)))));
      t.append(el(doc, 'tbody', {}, ...c.preview.map((r) => el(doc, 'tr', {}, ...r.map((v) => el(doc, 'td', {}, v))))));
      nodes.push(el(doc, 'p', {}, `First ${n(c.preview.length, 'row')} of the CSV.`), t);
    }
    nodes.push(el(doc, 'h2', {}, 'What a CSV cannot carry'));
    nodes.push(el(doc, 'ul', {}, ...d.limits.map((m) => el(doc, 'li', {}, m))));
    nodes.push(el(doc, 'p', { id: 'blog-import-line' }, el(doc, 'a', { href: MARKETPLACE }, 'Blog Import'), ` ${d.blogImport}`));
    out.replaceChildren(...nodes);
    out.dataset.rows = String(c.rows);
  };
  draw(false);
  doc.getElementById('result-title')?.focus({ preventScroll: true });
  out.scrollIntoView({ block: 'start' });
}

const SHAPE_PAGE: Record<Shape, { name: string; page: string } | null> = {
  wxr: null,
  blogger: { name: 'Blogger', page: NAMES.blogger.page },
  ghost: { name: 'Ghost', page: NAMES.ghost.page },
  zip: { name: 'Medium', page: NAMES.medium.page },
};
/** Which file shapes each source page reads. */
const SHAPE_OF: Record<Source, Shape> = { wordpress: 'wxr', squarespace: 'wxr', blogger: 'blogger', ghost: 'ghost', medium: 'zip' };

export function mount(doc: Document): void {
  const input = doc.getElementById('export-file') as HTMLInputElement | null;
  const out = doc.getElementById('result');
  if (!input || !out) return;
  const allowed = (input.dataset.sources ?? 'wordpress squarespace').split(/\s+/).filter((s): s is Source => s in NAMES);
  const shapes = new Set(allowed.map((s) => SHAPE_OF[s]));
  const label = allowed[0] === 'wordpress' ? 'WordPress or Squarespace' : NAMES[allowed[0]!].name;
  const say = (...kids: (Node | string)[]) => out.replaceChildren(el(doc, 'p', {}, ...kids));
  input.addEventListener('change', async () => {
    const f = input.files?.[0];
    if (!f) return;
    say('Reading the file on this device.');
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const shape = shapeOf(bytes);
      if (!shapes.has(shape)) {
        const other = SHAPE_PAGE[shape];
        if (other) return say(`This looks like a ${other.name} export, not a ${label} one. Use `, el(doc, 'a', { href: other.page }, `${other.name} to Framer CSV`), '.');
        return say(`This file can't be read as a ${label} export. Choose ${NAMES[allowed[0]!].fileHint}.`);
      }
      renderCsv(doc, out, f.name, await readExport(bytes));
    } catch (e) {
      say(e instanceof WxrError ? e.message : `This file can't be read as a ${label} export. Choose ${NAMES[allowed[0]!].fileHint}.`);
    }
  });
}
