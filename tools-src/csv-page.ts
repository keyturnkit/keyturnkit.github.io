// Page for the WordPress/Squarespace XML to Framer CSV tool. All text goes in with textContent, never innerHTML.
import { convert, csvName, readExport, WxrError } from './csv';
import type { Conversion } from './csv';
import type { SiteContent } from '@parsers/types';

const MARKETPLACE = 'https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/';
const n = (count: number, one: string, many = `${one}s`) => `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`;

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, attrs: Record<string, string> = {}, ...kids: (Node | string)[]): HTMLElementTagNameMap[K] {
  const e = doc.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
}

/** Text for the result, kept apart from the DOM so tests can read it. */
export function describeCsv(c: Conversion, includeDrafts: boolean): { summary: string; limits: string[]; blogImport: string } {
  const source = c.kind === 'squarespace' ? 'Squarespace' : 'WordPress';
  const draftPart = c.drafts ? (includeDrafts ? ` and ${n(c.drafts, 'draft')}` : `. ${n(c.drafts, 'draft')} left out`) : '';
  return {
    summary: `This is a ${source} export with ${n(c.published, 'published post')}${draftPart}. The CSV has ${n(c.rows, 'row')}, one per post. Cover image address found for ${c.withCover} of them.`,
    limits: [
      c.bodyImages
        ? `Images inside the posts still point at your old site. ${n(c.bodyImages, 'image')} in these posts will break when the old site goes away.`
        : 'These posts have no images inside the text, so nothing in the post bodies depends on your old site.',
      'Old addresses get no redirects. Links to your old posts will not lead to the new ones.',
      'Authors, categories and tags come as plain text. They are not linked collections in Framer.',
    ],
    blogImport: 'does those in Framer (redirects on Framer Pro). The newest 25 posts are free. $29 for one project, $59 for any number.',
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
      nodes.push(el(doc, 'p', { class: 'tool-opt' }, box, el(doc, 'label', { for: 'with-drafts' }, ' Include drafts')));
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

export function mount(doc: Document): void {
  const input = doc.getElementById('export-file') as HTMLInputElement | null;
  const out = doc.getElementById('result');
  if (!input || !out) return;
  const say = (msg: string) => out.replaceChildren(el(doc, 'p', {}, msg));
  input.addEventListener('change', async () => {
    const f = input.files?.[0];
    if (!f) return;
    say('Reading the file on this device.');
    try {
      const content = readExport(new Uint8Array(await f.arrayBuffer()));
      renderCsv(doc, out, f.name, content);
    } catch (e) {
      say(e instanceof WxrError ? e.message : "This file can't be read as a WordPress or Squarespace export. Choose the .xml file you downloaded from the export screen.");
    }
  });
}
