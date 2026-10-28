// Turns a WordPress, Squarespace, Blogger, Ghost or Medium export file into a CSV for Framer's CMS import. Runs in the browser; nothing is sent anywhere.
// Parsing is done by the Blog Import plugin's own readers (wxr.ts, blogger.ts, ghost.ts, medium.ts), so the post text, slugs and dates match what the plugin makes.
import { isBloggerExport, parseBlogger } from '@parsers/blogger';
import { isGhostExport, parseGhost } from '@parsers/ghost';
import { mediumFilesFromZip, parseMediumFiles } from '@parsers/medium';
import { parseWxr, WxrError } from '@parsers/wxr';
import type { SiteContent } from '@parsers/types';

export const HEADERS = ['Title', 'Slug', 'Date', 'Excerpt', 'Content', 'Cover image', 'Author', 'Categories', 'Tags', ':draft'] as const;

/**
 * Framer's CSV Import plugin (github.com/framer/plugins, csv-import/src/utils/typeInference.ts) infers a column as an image
 * only when every non-empty value matches this. Otherwise an all-URL column is inferred as a link.
 */
export const FRAMER_IMAGE_URL = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i;

/** One CSV field, quoted when it holds a comma, quote or line break (RFC 4180). */
export function csvField(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(csvField).join(',')).join('\r\n') + '\r\n';
}

export type Source = 'wordpress' | 'squarespace' | 'blogger' | 'ghost' | 'medium';

const SOURCES: Record<SiteContent['source'], Source | undefined> = {
  'wordpress-file': 'wordpress',
  'squarespace-file': 'squarespace',
  'blogger-file': 'blogger',
  'ghost-file': 'ghost',
  'medium-file': 'medium',
  'wordpress-api': undefined,
  'substack-file': undefined,
  'hashnode-file': undefined,
  'webflow-file': undefined,
};

export function sourceOf(content: SiteContent): Source {
  const s = SOURCES[content.source];
  if (!s) throw new WxrError('This kind of export is not supported here.');
  return s;
}

export interface Conversion {
  kind: Source;
  published: number;
  drafts: number;
  /** Rows written: published posts, plus drafts when asked. */
  rows: number;
  /** Rows whose Cover image cell is filled. */
  withCover: number;
  /** Image tags in the post text of the rows written, which still point at the old host. */
  bodyImages: number;
  /** Ghost: images (in post text or as covers) the export stores without the site address, which the reader leaves out. */
  imagesLeftOut: number;
  /** Rows whose Cover image address does not end in .jpg, .jpeg, .png, .gif, .webp or .svg (Framer's test for an image column). */
  coverNotImage: number;
  /** Rows written whose post text is empty. */
  emptyBodies: number;
  /** The reader's own notes (Medium: replies left out). */
  notes: string[];
  csv: string;
  /** First rows as written, for the preview: title, slug, date. */
  preview: [string, string, string][];
}

/** Names as the export writes them. The reader keeps the key (login or nicename) and the display name apart. */
function names(keys: string[], list: { key: string; name: string }[]): string {
  const byKey = new Map(list.map((t) => [t.key, t.name]));
  return keys.map((k) => byKey.get(k) ?? k).join(', ');
}

export function convert(content: SiteContent, includeDrafts: boolean): Conversion {
  const posts = content.posts.filter((p) => includeDrafts || !p.draft);
  const authors = new Map(content.authors.map((a) => [a.key, a.name]));
  const rows = posts.map((p) => [
    p.title,
    p.slug,
    p.date,
    p.excerpt,
    p.html,
    p.coverUrl ?? '',
    p.authorKey ? (authors.get(p.authorKey) ?? p.authorKey) : '',
    names(p.categoryKeys, content.categories),
    names(p.tagKeys, content.tags),
    // Framer's CSV Import reads a column named ":draft" (true or false) to make draft items.
    p.draft ? 'true' : 'false',
  ]);
  return {
    kind: sourceOf(content),
    published: content.posts.filter((p) => !p.draft).length,
    drafts: content.posts.filter((p) => p.draft).length,
    rows: posts.length,
    withCover: posts.filter((p) => p.coverUrl).length,
    bodyImages: posts.reduce((n, p) => n + (p.html.match(/<img\b/gi)?.length ?? 0), 0),
    imagesLeftOut: content.imagesWithoutAddress ?? 0,
    coverNotImage: posts.filter((p) => p.coverUrl && !FRAMER_IMAGE_URL.test(p.coverUrl.trim())).length,
    emptyBodies: posts.filter((p) => !p.html.trim()).length,
    notes: content.source === 'medium-file' ? (content.notes ?? []) : [],
    csv: toCsv([[...HEADERS], ...rows]),
    preview: posts.slice(0, 5).map((p) => [p.title, p.slug, p.date ? p.date.slice(0, 10) : '']),
  };
}

const isZip = (b: Uint8Array) => b.length > 3 && b[0] === 0x50 && b[1] === 0x4b;
const decode = (bytes: Uint8Array) => new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '');

/** What the file looks like, from its first bytes only. 'wxr' is the fallback: WordPress and Squarespace share one format. */
export type Shape = 'wxr' | 'blogger' | 'ghost' | 'zip';
export function shapeOf(bytes: Uint8Array): Shape {
  if (isZip(bytes)) return 'zip';
  const head = decode(bytes.subarray(0, 4100));
  if (isGhostExport(head)) return 'ghost';
  if (isBloggerExport(head)) return 'blogger';
  return 'wxr';
}

/**
 * Reads the file and parses it with the plugin's reader for its kind. Throws WxrError with a plain message when it
 * cannot be read. ghostSite stands in for Ghost's missing site address (the image list uses it to keep relative images).
 */
export async function readExport(bytes: Uint8Array, opts: { ghostSite?: string } = {}): Promise<SiteContent> {
  const shape = shapeOf(bytes);
  if (shape === 'zip') return parseMediumFiles(await mediumFilesFromZip(bytes));
  const text = decode(bytes);
  if (shape === 'ghost') return parseGhost(text, { siteUrl: opts.ghostSite ?? null });
  if (shape === 'blogger') return parseBlogger(text);
  return parseWxr(text);
}

export { WxrError };

export const csvName = (fileName: string, suffix = 'framer') => `${fileName.replace(/\.[^.]*$/, '').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'blog'}-${suffix}.csv`;
