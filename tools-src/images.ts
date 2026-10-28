// Lists every cover image and every image inside the posts of a blog export. Runs in the browser; nothing is sent anywhere.
// The posts come from the Blog Import plugin's own readers (see csv.ts), so the list matches the images the plugin sees.
import { csvField, readExport, sourceOf, toCsv } from './csv';
import type { Source } from './csv';
import type { SiteContent } from '@parsers/types';

export { readExport };

/** Stands in for Ghost's missing site address, so Ghost keeps its relative images instead of dropping them. Never shown. */
export const GHOST_SITE = 'https://ghost-export.invalid';

export const IMAGE_HEADERS = ['Post title', 'Post status', 'Image kind', 'Image address', 'Address type'] as const;

export type AddressType = 'full' | 'relative' | 'embedded';
export const TYPE_LABEL: Record<AddressType, string> = {
  full: 'Full address',
  relative: 'Relative, no site address, cannot be fetched',
  embedded: 'Embedded in the post, no address',
};

export interface ImageRow {
  post: string;
  draft: boolean;
  kind: 'cover' | 'in body';
  address: string;
  type: AddressType;
}

export interface ImageList {
  source: Source;
  posts: number;
  drafts: number;
  /** Posts written to the list (drafts only when asked). */
  postsListed: number;
  postsWithImages: number;
  rows: ImageRow[];
  covers: number;
  inBody: number;
  distinct: number;
  relative: number;
  embedded: number;
  /** <img> tags with no address at all. */
  noAddress: number;
  /** Hosts of the full addresses, most images first. */
  hosts: [string, number][];
  csv: string;
}

const ATTRS = ['data-image', 'data-src', 'src'];
const attr = (tag: string, name: string) => tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1]?.trim() ?? '';
const isFull = (u: string) => /^https?:\/\//i.test(u);

/** Address and type for one value as the reader gives it. Ghost's stand-in site address is cut off so only the path shows. */
export function classify(value: string): { address: string; type: AddressType } {
  if (value.startsWith(GHOST_SITE)) return { address: value.slice(GHOST_SITE.length) || '/', type: 'relative' };
  if (isFull(value)) return { address: value, type: 'full' };
  if (/^data:/i.test(value)) return { address: value.split(',')[0]!, type: 'embedded' };
  return { address: value, type: 'relative' };
}

/** The address an <img> tag points to, in the order the plugin looks (lazy-loaded images keep the real address in data-image or data-src). */
export function imageAddress(tag: string): string {
  const values = ATTRS.map((a) => attr(tag, a)).filter(Boolean);
  return values.find(isFull) ?? values[0] ?? '';
}

export function listImages(content: SiteContent, includeDrafts: boolean): ImageList {
  const posts = content.posts.filter((p) => includeDrafts || !p.draft);
  const rows: ImageRow[] = [];
  let noAddress = 0;
  const withImages = new Set<string>();
  for (const p of posts) {
    const add = (kind: ImageRow['kind'], value: string) => {
      rows.push({ post: p.title, draft: p.draft, kind, ...classify(value) });
      withImages.add(p.id);
    };
    if (p.coverUrl) add('cover', p.coverUrl);
    for (const tag of p.html.match(/<img\b[^>]*>/gi) ?? []) {
      const v = imageAddress(tag);
      if (v) add('in body', v);
      else noAddress++;
    }
  }
  const hostCount = new Map<string, number>();
  for (const r of rows) {
    if (r.type !== 'full') continue;
    let h = '';
    try { h = new URL(r.address).hostname.toLowerCase(); } catch { h = ''; }
    if (h) hostCount.set(h, (hostCount.get(h) ?? 0) + 1);
  }
  return {
    source: sourceOf(content),
    posts: content.posts.filter((p) => !p.draft).length,
    drafts: content.posts.filter((p) => p.draft).length,
    postsListed: posts.length,
    postsWithImages: withImages.size,
    rows,
    covers: rows.filter((r) => r.kind === 'cover').length,
    inBody: rows.filter((r) => r.kind === 'in body').length,
    distinct: new Set(rows.map((r) => r.address)).size,
    relative: rows.filter((r) => r.type === 'relative').length,
    embedded: rows.filter((r) => r.type === 'embedded').length,
    noAddress,
    hosts: [...hostCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    csv: toCsv([[...IMAGE_HEADERS], ...rows.map((r) => [r.post, r.draft ? 'Draft' : 'Published', r.kind, r.address, TYPE_LABEL[r.type]])]),
  };
}

/** Reads any export the inspector reads (WordPress, Squarespace, Blogger, Ghost, Medium). */
export const readForImages = (bytes: Uint8Array) => readExport(bytes, { ghostSite: GHOST_SITE });

export { csvField };
