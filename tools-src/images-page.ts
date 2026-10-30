// Page for the blog export image list. All text goes in with textContent, never innerHTML.
import { csvName, WxrError } from './csv';
import { el, MARKETPLACE, n } from './csv-page';
import { listImages, readForImages, TYPE_LABEL } from './images';
import type { ImageList } from './images';
import type { SiteContent } from '@parsers/types';

const SHOWN = 200;
const NAME: Record<ImageList['source'], string> = { wordpress: 'WordPress', squarespace: 'Squarespace', blogger: 'Blogger', ghost: 'Ghost', medium: 'Medium' };

/** Text for the result, kept apart from the DOM so tests can read it. */
export function describeImages(l: ImageList, includeDrafts: boolean): { summary: string; notes: string[]; last: string } {
  const draftPart = l.drafts ? (includeDrafts ? ` and ${n(l.drafts, 'draft')}` : `. ${n(l.drafts, 'draft')} left out`) : '';
  const notes: string[] = [];
  if (l.relative) {
    notes.push(
      l.source === 'ghost'
        ? `${n(l.relative, 'address', 'addresses')} ${l.relative === 1 ? 'is' : 'are'} relative. Ghost writes its own address as __GHOST_URL__ (older versions write a bare /content/images path) and the export does not say which site it was, so the list can show only the path.`
        : `${n(l.relative, 'address', 'addresses')} ${l.relative === 1 ? 'is' : 'are'} relative, with no site address in front. ${l.relative === 1 ? 'It' : 'They'} cannot be fetched from this list alone.`,
    );
  }
  if (l.embedded) notes.push(`${n(l.embedded, 'image')} ${l.embedded === 1 ? 'is' : 'are'} embedded in the post text as data, so there is no address to save.`);
  if (l.noAddress) notes.push(`${n(l.noAddress, 'image tag')} in the posts ${l.noAddress === 1 ? 'has' : 'have'} no address and ${l.noAddress === 1 ? 'is' : 'are'} not listed.`);
  return {
    summary: `This is a ${NAME[l.source]} export with ${n(l.posts, 'published post')}${draftPart}. ${l.postsWithImages.toLocaleString('en-US')} of the ${n(l.postsListed, 'listed post')} ${l.postsWithImages === 1 ? 'has' : 'have'} images. The list has ${n(l.rows.length, 'row')}, ${n(l.covers, 'cover image')} and ${n(l.inBody, 'image')} inside posts, at ${n(l.distinct, 'different address', 'different addresses')}.`,
    notes,
    last: 'copies cover and body images into Framer during the import. It is free, with no limit on posts.',
  };
}

export function renderImages(doc: Document, out: HTMLElement, fileName: string, content: SiteContent): void {
  const draw = (includeDrafts: boolean) => {
    const l = listImages(content, includeDrafts);
    const d = describeImages(l, includeDrafts);
    const nodes: HTMLElement[] = [];
    nodes.push(el(doc, 'h2', { tabindex: '-1', id: 'result-title' }, 'Your image list'));
    nodes.push(el(doc, 'p', {}, d.summary));
    if (l.drafts) {
      const box = el(doc, 'input', { type: 'checkbox', id: 'with-drafts' });
      box.checked = includeDrafts;
      box.addEventListener('change', () => draw(box.checked));
      nodes.push(el(doc, 'p', { class: 'tool-opt' }, box, el(doc, 'label', { for: 'with-drafts' }, ' Include drafts')));
    }
    if (l.rows.length) {
      const link = el(doc, 'a', { class: 'btn btn-primary', id: 'download', download: csvName(fileName, 'images'), href: URL.createObjectURL(new Blob([l.csv], { type: 'text/csv;charset=utf-8' })) }, 'Download CSV');
      nodes.push(el(doc, 'p', {}, link));
    }
    if (d.notes.length) nodes.push(el(doc, 'ul', { id: 'image-notes' }, ...d.notes.map((m) => el(doc, 'li', {}, m))));
    if (l.hosts.length) {
      nodes.push(el(doc, 'h2', {}, 'Where the full addresses point'));
      nodes.push(el(doc, 'ul', { id: 'image-hosts' }, ...l.hosts.slice(0, 8).map(([h, c]) => el(doc, 'li', {}, `${h}, ${n(c, 'image')}`))));
    }
    if (l.rows.length) {
      const t = el(doc, 'table', { id: 'image-table' });
      t.append(el(doc, 'thead', {}, el(doc, 'tr', {}, ...['Post title', 'Image kind', 'Image address', 'Address type'].map((h) => el(doc, 'th', { scope: 'col' }, h)))));
      t.append(el(doc, 'tbody', {}, ...l.rows.slice(0, SHOWN).map((r) => el(doc, 'tr', {}, el(doc, 'td', {}, r.post), el(doc, 'td', {}, r.kind), el(doc, 'td', { class: 'tool-addr' }, r.address), el(doc, 'td', {}, TYPE_LABEL[r.type])))));
      nodes.push(el(doc, 'p', {}, l.rows.length > SHOWN ? `The first ${SHOWN} of ${l.rows.length.toLocaleString('en-US')} rows. The CSV has all of them.` : `All ${n(l.rows.length, 'row')}.`), el(doc, 'div', { class: 'tool-scroll' }, t));
    } else {
      nodes.push(el(doc, 'p', {}, 'No images found in these posts.'));
    }
    nodes.push(el(doc, 'p', { id: 'blog-import-line' }, el(doc, 'a', { href: MARKETPLACE }, 'Blog Import'), ` ${d.last}`));
    out.replaceChildren(...nodes);
    out.dataset.rows = String(l.rows.length);
  };
  draw(true);
  doc.getElementById('result-title')?.focus({ preventScroll: true });
  out.scrollIntoView({ block: 'start' });
}

export function mountImages(doc: Document): void {
  const input = doc.getElementById('export-file') as HTMLInputElement | null;
  const out = doc.getElementById('result');
  if (!input || !out) return;
  const say = (msg: string) => out.replaceChildren(el(doc, 'p', {}, msg));
  input.addEventListener('change', async () => {
    const f = input.files?.[0];
    if (!f) return;
    say('Reading the file on this device.');
    try {
      renderImages(doc, out, f.name, await readForImages(new Uint8Array(await f.arrayBuffer())));
    } catch (e) {
      say(e instanceof WxrError ? e.message : "This file can't be read as a blog export. Choose the .xml, .json or .zip file you downloaded from WordPress, Squarespace, Blogger, Ghost or Medium.");
    }
  });
}
