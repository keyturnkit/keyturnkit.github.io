// Turns a Report into page content. All text goes in with textContent, never innerHTML.
import type { Kind, Report } from './inspect';
import { inspectFiles } from './inspect';

const MARKETPLACE = 'https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/';
const SOURCE_NAME: Record<Kind, string> = { squarespace: 'Squarespace', wordpress: 'WordPress', blogger: 'Blogger', medium: 'Medium', ghost: 'Ghost', substack: 'Substack', hashnode: 'Hashnode', webflow: 'Webflow' };
const GUIDE: Partial<Record<Kind, { href: string; title: string }>> = {
  squarespace: { href: '/guides/squarespace-export-xml/', title: "What's inside a Squarespace blog export" },
  wordpress: { href: '/guides/wordpress-blog-to-framer/', title: 'Move a WordPress blog to Framer' },
  blogger: { href: '/guides/blogger-blog-to-framer/', title: 'Move a Blogger blog to Framer' },
  medium: { href: '/guides/medium-export/', title: "What's inside a Medium export" },
  ghost: { href: '/guides/ghost-blog-to-framer/', title: 'Move a Ghost blog to Framer' },
};
const FREE_POSTS = 25;
/**
 * Blog Import does not read Substack on the live Marketplace yet. While this is false, a Substack result makes no
 * claim about what Blog Import does: no free-post count, no "Blog Import copies/converts/adds", no Marketplace link.
 * Set it to true in the release that ships Substack and rebuild.
 */
export const BLOG_IMPORT_READS_SUBSTACK = true;
/**
 * The same for the Hashnode GitHub backup (.md files or the repo zip) and the Webflow CMS CSV. While a flag is false
 * the page does not offer that file type and a result for it (should one get through) makes no claim about Blog Import.
 * Set it to true in the release that ships the reader and rebuild.
 */
export const BLOG_IMPORT_READS_HASHNODE = true;
export const BLOG_IMPORT_READS_WEBFLOW = true;

/** Whether Blog Import reads this source on the live Marketplace. Sources not listed here always do. */
const readsKind = (k: Kind) => (k === 'substack' ? BLOG_IMPORT_READS_SUBSTACK : k === 'hashnode' ? BLOG_IMPORT_READS_HASHNODE : k === 'webflow' ? BLOG_IMPORT_READS_WEBFLOW : true);

const n = (count: number, one: string, many = `${one}s`) => `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`;
const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const size = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export interface View {
  summary: string;
  rows: [string, string][];
  commentNote: string | null;
  imageRows: [string, string][];
  imageNote: string;
  ghostImageNote: string | null;
  ghostNotes: string[];
  parserNotes: string[];
  substackImageNote: string | null;
  substackNotes: string[];
  pathNote: string;
  pathSample: string[];
  dateNote: string | null;
  meaning: string[];
  links: { href: string; title: string }[];
}

export function describe(r: Report): View {
  const rows: [string, string][] = [];
  rows.push([r.kind === 'medium' ? 'Stories' : 'Published posts', String(r.published)]);
  if (r.kind !== 'hashnode') rows.push([r.kind === 'ghost' ? 'Drafts, scheduled and sent' : r.kind === 'substack' ? 'Drafts with text' : 'Drafts', String(r.drafts)]);
  if (r.replies !== null) rows.push(['Replies to other stories', String(r.replies)]);
  if (r.pages !== null) rows.push(['Pages', String(r.pages)]);
  if (r.attachments !== null) rows.push(['Attachment entries', String(r.attachments)]);
  if (r.comments) rows.push(['Comments', String(r.comments.total)]);
  if (r.kind !== 'substack' && r.kind !== 'hashnode') rows.push(['Authors', String(r.authors)]);
  if (r.kind !== 'medium' && r.kind !== 'ghost' && r.kind !== 'substack' && r.kind !== 'hashnode') rows.push(['Categories', String(r.categories)]);
  if (r.kind !== 'substack') rows.push(['Tags', String(r.tags)]);
  const sub = r.substack;
  if (sub) {
    rows.push(['Drafts without text', String(sub.draftsWithoutText)]);
    rows.push(['Posts for paid subscribers', String(sub.paid)]);
    rows.push(['Podcast episodes', String(sub.podcasts)]);
    rows.push(['Threads', String(sub.threads)]);
  }

  const c = r.comments;
  const commentNote =
    c && c.total && r.kind !== 'blogger'
      ? `${c.withName} of ${n(c.total, 'comment')} carry a commenter name, ${c.withEmail} an email address and ${c.withIp} an IP address. They are counted here and never shown.`
      : null;

  const imageRows = r.images.hosts.map(([h, count]): [string, string] => [h, String(count)]);
  const g = r.ghost;
  const imageNote = r.images.total
    ? `${n(r.images.total, 'image')} in post bodies, from ${n(r.images.hosts.length, 'host')}.`
    : 'No images with a full web address were found in post bodies.';
  const ghostImages = g ? g.ghostUrlImages + g.ghostUrlCovers : 0;
  const ghostImageNote = !g
    ? null
    : ghostImages
      ? `${n(ghostImages, 'image')} use${ghostImages === 1 ? 's' : ''} __GHOST_URL__ instead of a web address (${g.ghostUrlImages} in post bodies, ${n(g.ghostUrlCovers, 'cover image')}). Blog Import can't copy ${ghostImages === 1 ? 'it' : 'them'}.`
      : 'No image uses __GHOST_URL__.';

  const live = readsKind(r.kind);
  const quiet = !live;
  const substackImageNote = !sub
    ? null
    : sub.heic
      ? `${sub.heic} of them ${sub.heic === 1 ? 'is a .heic photo' : 'are .heic photos'}. Browsers can't show .heic, so ${sub.heic === 1 ? 'it needs' : 'they need'} to become ${sub.heic === 1 ? 'a JPEG' : 'JPEGs'}${live ? '. Blog Import does that on import' : ''}.`
      : 'None of them is a .heic photo.';

  const p = r.paths;
  const pathNote = !p.total
    ? 'No post carries an old address.'
    : r.kind === 'substack'
      ? `${n(p.total, 'post')} ${p.total === 1 ? 'carries' : 'carry'} an old address of the form /p/slug. The first ${Math.min(5, p.total)} are below, published posts first.`
    : r.kind === 'hashnode'
      ? `${n(p.total, 'post')} ${p.total === 1 ? 'carries' : 'carry'} an old address of the form /slug.${r.published > p.total ? ` ${n(r.published - p.total, 'post')} ${r.published - p.total === 1 ? 'has' : 'have'} none, because older backups leave the slug out.` : ''} The domain is not in the backup. The first ${Math.min(5, p.total)} are below.`
    : r.kind === 'webflow'
      ? `${n(p.total, 'post')} ${p.total === 1 ? 'carries' : 'carry'} an old address assumed to be /blog/slug, because the CSV does not say where the collection page lived. The first ${Math.min(5, p.total)} are below.`
    : r.kind === 'ghost'
      ? `${n(p.total, 'old post address', 'old post addresses')} assume Ghost's default /slug/ form. Custom routes are not in the file, so a site that used them has different addresses. ${Math.min(5, p.total)} are below.`
    : r.kind === 'medium'
      ? `${n(p.total, 'story', 'stories')} carry a Medium address. None has a date in it.`
      : p.withDates
        ? `${p.withDates} of ${n(p.total, 'old post address', 'old post addresses')} carry a date, like ${p.example}. ${Math.min(5, p.total)} are below, dated ones first.`
        : `None of the ${n(p.total, 'old post address', 'old post addresses')} carries a date. The first ${Math.min(5, p.total)} are below.`;
  const dateNote = r.dates ? `${r.kind === 'ghost' || r.kind === 'substack' || r.kind === 'hashnode' || r.kind === 'webflow' ? 'Published posts run' : 'Posts run'} from ${day(r.dates.first)} to ${day(r.dates.last)}.` : null;

  const ghostNotes: string[] = [];
  if (g) {
    const d = g.drafts;
    ghostNotes.push(`Of the ${n(r.drafts, 'draft')}, ${d.draft} ${d.draft === 1 ? 'is' : 'are'} unpublished, ${d.scheduled} scheduled and ${d.sent} sent as email only${d.other ? `, and ${d.other} have another status` : ''}. Scheduled and sent posts count as drafts here.`);
    ghostNotes.push(`Pages are counted from the file. Blog Import skips them.${g.internalTags ? ` ${n(g.internalTags, 'internal tag')} (names starting with #) ${g.internalTags === 1 ? 'is' : 'are'} not counted in Tags.` : " Internal tags (names starting with #) aren't counted in Tags."}`);
  }
  const meaning: string[] = [];
  const name = SOURCE_NAME[r.kind];
  for (const [host, count] of r.images.hosts.slice(0, 3)) {
    if (quiet && !sub) {
      meaning.push(`${n(count, 'image')} still ${count === 1 ? 'loads' : 'load'} from ${host}. ${count === 1 ? 'It stays' : 'They stay'} at that address, so copy ${count === 1 ? 'it' : 'them'} into Framer before the old site closes.`);
      continue;
    }
    if (sub && !live) {
      meaning.push(`${n(count, 'image')} still ${count === 1 ? 'loads' : 'load'} from ${host}. ${count === 1 ? 'It is' : 'They are'} stored by Substack, so copy ${count === 1 ? 'it' : 'them'} into Framer before you close the publication.`);
      continue;
    }
    const why = r.kind === 'squarespace' ? 'Squarespace notes they can stop working when the Squarespace site closes' : 'They stay with the old site';
    meaning.push(`${n(count, 'image')} still ${count === 1 ? 'loads' : 'load'} from ${host}. ${why}, so Blog Import copies them into Framer.`);
  }
  if (r.images.hosts.length > 3) meaning.push(`${n(r.images.hosts.length - 3, 'more image host')} ${r.images.hosts.length - 3 === 1 ? 'is' : 'are'} listed above.`);
  if ((sub || quiet) && p.total) meaning.push(`${n(p.total, 'old address', 'old addresses')} will change in Framer, so each one needs a redirect.${live ? ' Blog Import adds them on Framer Pro or higher.' : ''}`);
  else if (p.withDates) meaning.push(`${n(p.withDates, 'old address', 'old addresses')} ${p.withDates === 1 ? 'has' : 'have'} dates in ${p.withDates === 1 ? 'it' : 'them'}. Your Framer posts get shorter addresses, so each one needs a redirect. Blog Import adds them on Framer Pro or higher.`);
  else if (p.total && r.kind !== 'medium' && !sub) meaning.push(`${n(p.total, 'old address', 'old addresses')} will change in Framer, so each one needs a redirect. Blog Import adds them on Framer Pro or higher.`);
  if (g && ghostImages) meaning.push(`${n(ghostImages, 'image')} use${ghostImages === 1 ? 's' : ''} __GHOST_URL__ and won't be copied. Keep the Ghost site until you've saved ${ghostImages === 1 ? 'it' : 'them'}, then add ${ghostImages === 1 ? 'it' : 'them'} in Framer.`);
  if (g && p.total) meaning.push("Redirects assume Ghost's default /slug/ addresses. If your site used custom routes, check them before you publish.");
  if (quiet) {
    // No statement about what Blog Import does with these posts.
  } else if (r.published > FREE_POSTS) meaning.push(`Blog Import brings in the newest ${FREE_POSTS} posts free. A license covers all ${r.published}.`);
  else if (r.published > 0) meaning.push(`${n(r.published, 'published post')} ${r.published === 1 ? 'fits' : 'fit'} within the free ${FREE_POSTS}.`);
  if (r.drafts && !quiet) meaning.push(`${n(r.drafts, 'draft')} stay${r.drafts === 1 ? 's' : ''} as ${r.drafts === 1 ? 'a draft' : 'drafts'} in Framer.${g ? ' Scheduled and sent posts count as drafts.' : ''}`);
  if (r.replies) meaning.push(`${n(r.replies, 'reply', 'replies')} to other people's stories ${r.replies === 1 ? 'is' : 'are'} skipped.`);
  if (r.pages) meaning.push(`${n(r.pages, 'page')} ${r.pages === 1 ? 'is' : 'are'} not imported. Rebuild ${r.pages === 1 ? 'it' : 'them'} in Framer.`);
  if (r.comments?.total) {
    meaning.push(
      `${n(r.comments.total, 'comment')} stay${r.comments.total === 1 ? 's' : ''} behind, because Blog Import doesn't import comments.${r.kind === 'blogger' ? '' : ' The file keeps the commenters\' emails and IP addresses, so share it with care.'}`,
    );
  }
  const substackNotes: string[] = [];
  if (sub) {
    if (sub.paid) substackNotes.push(`${n(sub.paid, 'post')} ${sub.paid === 1 ? 'was' : 'were'} for paid subscribers on Substack. In Framer ${sub.paid === 1 ? 'it' : 'they'} will be public.`);
    if (sub.podcasts) substackNotes.push(`${n(sub.podcasts, 'podcast episode')} ${sub.podcasts === 1 ? 'has' : 'have'} show notes in the export, without the audio.`);
    if (sub.threads) substackNotes.push(`${n(sub.threads, 'thread')} ${sub.threads === 1 ? 'is a chat post' : 'are chat posts'}, not ${sub.threads === 1 ? 'an article' : 'articles'}, so ${sub.threads === 1 ? 'it is' : 'they are'} left out.`);
    if (sub.draftsWithoutText) substackNotes.push(`${n(sub.draftsWithoutText, 'draft')} ${sub.draftsWithoutText === 1 ? 'has' : 'have'} no text in the export, so ${sub.draftsWithoutText === 1 ? 'it is' : 'they are'} left out.`);
    if (sub.publishedWithoutText) substackNotes.push(`${n(sub.publishedWithoutText, 'published post')} ${sub.publishedWithoutText === 1 ? 'has' : 'have'} no text in the export, so ${sub.publishedWithoutText === 1 ? 'it is' : 'they are'} left out.`);
    meaning.push(...substackNotes);
  }
  const taxonomy = r.authors + r.categories + r.tags;
  if (taxonomy && !quiet) meaning.push(r.kind === 'hashnode' ? 'Tags become their own Framer collection. On Framer Basic they can stay inside each post instead.' : `${g ? 'Authors and tags' : 'Authors, categories and tags'} become their own Framer collections. On Framer Basic they can stay inside each post instead.`);
  if (!r.published && !r.drafts) meaning.push('There are no posts here to move.');

  const links: { href: string; title: string }[] = [];
  if (live) links.push({ href: MARKETPLACE, title: 'Open Blog Import in the Framer Marketplace' });
  const guide = GUIDE[r.kind];
  if (guide) links.push(guide);
  if (p.total && r.kind !== 'medium') links.push({ href: '/guides/framer-blog-redirects/', title: 'Keep old blog links working in Framer' });
  return {
    summary: `This looks like a ${name} export. The file is ${size(r.bytes)}.`,
    rows,
    commentNote,
    imageRows,
    imageNote,
    ghostImageNote,
    ghostNotes,
    parserNotes: r.notes && live ? r.notes : [],
    substackImageNote,
    substackNotes,
    pathNote,
    pathSample: p.sample,
    dateNote,
    meaning,
    links,
  };
}

type Child = Node | string;
function el(doc: Document, tag: string, attrs: Record<string, string> = {}, ...kids: Child[]): HTMLElement {
  const e = doc.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  for (const k of kids) e.append(k);
  return e;
}

function table(doc: Document, head: [string, string], rows: [string, string][], codeFirst = false): HTMLElement {
  const t = el(doc, 'table');
  t.append(el(doc, 'thead', {}, el(doc, 'tr', {}, el(doc, 'th', { scope: 'col' }, head[0]), el(doc, 'th', { scope: 'col' }, head[1]))));
  const body = el(doc, 'tbody');
  for (const [a, b] of rows) body.append(el(doc, 'tr', {}, el(doc, 'td', {}, codeFirst ? el(doc, 'code', {}, a) : a), el(doc, 'td', {}, b)));
  t.append(body);
  return t;
}

function card(doc: Document, href: string, title: string): HTMLElement {
  const a = el(doc, 'a', { href }, el(doc, 'span', {}, title));
  a.insertAdjacentHTML('beforeend', '<svg aria-hidden="true"><use href="#i-arrow-right"/></svg>');
  return el(doc, 'li', {}, a);
}

export function renderInto(doc: Document, out: HTMLElement, r: Report): void {
  const v = describe(r);
  const nodes: HTMLElement[] = [];
  nodes.push(el(doc, 'h2', { tabindex: '-1', id: 'result-title' }, 'What is in the file'));
  nodes.push(el(doc, 'p', {}, v.summary + (v.dateNote ? ` ${v.dateNote}` : '')));
  nodes.push(table(doc, ['What', 'Count'], v.rows));
  if (v.commentNote) nodes.push(el(doc, 'p', {}, v.commentNote));
  for (const note of v.ghostNotes) nodes.push(el(doc, 'p', {}, note));
  for (const note of v.parserNotes) nodes.push(el(doc, 'p', {}, note));
  nodes.push(el(doc, 'h2', {}, 'Images'));
  nodes.push(el(doc, 'p', {}, v.imageNote));
  if (v.ghostImageNote) nodes.push(el(doc, 'p', {}, v.ghostImageNote));
  if (v.substackImageNote) nodes.push(el(doc, 'p', {}, v.substackImageNote));
  if (v.imageRows.length) nodes.push(table(doc, ['Host', 'Images'], v.imageRows, true));
  nodes.push(el(doc, 'h2', {}, 'Old post addresses'));
  nodes.push(el(doc, 'p', {}, v.pathNote));
  if (v.pathSample.length) nodes.push(el(doc, 'pre', {}, el(doc, 'code', {}, v.pathSample.join('\n'))));
  nodes.push(el(doc, 'h2', {}, 'What this means if you move to Framer'));
  nodes.push(el(doc, 'ul', {}, ...v.meaning.map((m) => el(doc, 'li', {}, m))));
  if (v.links.length) nodes.push(el(doc, 'ul', { class: 'guide-list' }, ...v.links.map((l) => card(doc, l.href, l.title))));
  out.replaceChildren(...nodes);
}

/** File types the page offers. Hashnode and Webflow are added only once Blog Import reads them. */
export function accepted(): { accept: string; label: string; error: string } {
  const exts = ['.xml', '.json', '.zip'];
  if (BLOG_IMPORT_READS_WEBFLOW) exts.push('.csv');
  if (BLOG_IMPORT_READS_HASHNODE) exts.push('.md');
  const list = exts.length === 3 ? '.xml, .json or .zip' : `${exts.slice(0, -1).join(', ')} or ${exts[exts.length - 1]}`;
  const tail = (BLOG_IMPORT_READS_WEBFLOW ? ', the .csv file from Webflow' : '') + (BLOG_IMPORT_READS_HASHNODE ? ', or the .md files from a Hashnode GitHub backup' : '');
  return {
    accept: [...exts, 'application/xml', 'text/xml', 'application/json', 'application/zip', ...(BLOG_IMPORT_READS_WEBFLOW ? ['text/csv'] : []), ...(BLOG_IMPORT_READS_HASHNODE ? ['text/markdown'] : [])].join(','),
    label: `Export file (${list})`,
    error: `This file can't be read as a blog export. Choose the .xml file from Squarespace, WordPress or Blogger, the .json file from Ghost, or the .zip file from Substack or Medium${tail}.`,
  };
}

export function mount(doc: Document, inspect: (name: string, bytes: Uint8Array) => Promise<Report>): void {
  const input = doc.getElementById('export-file') as HTMLInputElement | null;
  const out = doc.getElementById('result');
  if (!input || !out) return;
  const say = (msg: string) => out.replaceChildren(el(doc, 'p', {}, msg));
  const offer = accepted();
  const label = doc.querySelector('label[for="export-file"]');
  if (BLOG_IMPORT_READS_WEBFLOW || BLOG_IMPORT_READS_HASHNODE) {
    input.setAttribute('accept', offer.accept);
    if (label) label.textContent = offer.label;
  }
  if (BLOG_IMPORT_READS_HASHNODE) input.setAttribute('multiple', '');
  // The file picker can be bypassed (drag and drop onto the input), so the page checks the type as well.
  const allowed = (name: string) => (/\.csv$/i.test(name) ? BLOG_IMPORT_READS_WEBFLOW : /\.md$/i.test(name) ? BLOG_IMPORT_READS_HASHNODE : true);
  input.addEventListener('change', async () => {
    const chosen = Array.from(input.files ?? []);
    if (!chosen.length) return;
    say('Reading the file on this device.');
    try {
      if (!chosen.every((f) => allowed(f.name))) throw new Error('type not offered');
      const files = await Promise.all(chosen.map(async (f) => ({ name: f.name, bytes: new Uint8Array(await f.arrayBuffer()) })));
      const report = files.length === 1 ? await inspect(files[0]!.name, files[0]!.bytes) : await inspectFiles(files);
      renderInto(doc, out, report);
      doc.getElementById('result-title')?.focus({ preventScroll: true });
      out.scrollIntoView({ block: 'start' });
    } catch (e) {
      const known = e instanceof Error && e.constructor.name === 'WxrError';
      say(known ? (e as Error).message : offer.error);
    }
  });
}
