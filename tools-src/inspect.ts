// Reads a blog export file and reports what is in it. Everything runs in the browser; nothing is sent anywhere.
// Parsing is done by the Blog Import plugin's own parsers (wxr.ts, blogger.ts, medium.ts, ghost.ts).
import { strFromU8 } from 'fflate';
import { isBloggerExport, parseBlogger } from '@parsers/blogger';
import { isGhostExport, parseGhost } from '@parsers/ghost';
import { mediumFilesFromZip, parseMediumFiles } from '@parsers/medium';
import { parseWxr, parseXml, WxrError } from '@parsers/wxr';
import type { Post, SiteContent } from '@parsers/types';

export type Kind = 'squarespace' | 'wordpress' | 'blogger' | 'medium' | 'ghost';

export interface Report {
  kind: Kind;
  fileName: string;
  bytes: number;
  published: number;
  drafts: number;
  /** null when the source has no such thing (Medium has no pages or comments). */
  pages: number | null;
  attachments: number | null;
  /** Medium only: files in posts/ that are replies, not stories. */
  replies: number | null;
  comments: { total: number; withName: number; withEmail: number; withIp: number } | null;
  authors: number;
  categories: number;
  tags: number;
  images: { total: number; hosts: [string, number][] };
  paths: { total: number; withDates: number; example: string | null; sample: string[] };
  dates: { first: string; last: string } | null;
  /** Ghost only, counted from the raw JSON because the plugin skips pages and drops these images. */
  ghost?: {
    /** Posts the plugin brings in as drafts, by Ghost status. */
    drafts: { draft: number; scheduled: number; sent: number; other: number };
    /** Images using __GHOST_URL__ in post bodies, and cover images using it. The plugin cannot copy either. */
    ghostUrlImages: number;
    ghostUrlCovers: number;
    /** Tags Ghost keeps private (name starts with "#" or visibility internal). Not counted in Tags. */
    internalTags: number;
  };
}

const text = (el: Element | null | undefined) => (el?.textContent ?? '').trim();
const child = (el: Element, tag: string) => el.getElementsByTagName(tag)[0] ?? null;

/** Same attribute order the plugin uses: lazy-loaded images keep the real address in data-image or data-src. */
function imageHost(tag: string): string | null {
  for (const attr of ['data-image', 'data-src', 'src']) {
    const m = tag.match(new RegExp(`(?:^|\\s)${attr}\\s*=\\s*["']([^"']+)["']`, 'i'));
    if (m && /^https?:\/\//i.test(m[1]!)) {
      try {
        return new URL(m[1]!).hostname.toLowerCase();
      } catch {
        return null;
      }
    }
  }
  return null;
}

function imageHosts(bodies: string[]): Report['images'] {
  const counts = new Map<string, number>();
  let total = 0;
  for (const html of bodies) {
    for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
      const host = imageHost(tag);
      if (!host) continue;
      total++;
      counts.set(host, (counts.get(host) ?? 0) + 1);
    }
  }
  return { total, hosts: [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])) };
}

const DATED_PATH = /\/(?:19|20)\d\d\/\d{1,2}(?:\/\d{1,2})?(?=\/|$)/;

function pathFacts(posts: Post[]): Report['paths'] {
  // Published posts first: a draft's address is not one anybody has linked to.
  const withPath = [...posts.filter((p) => !p.draft), ...posts.filter((p) => p.draft)].filter((p) => p.oldPath);
  const dated = withPath.filter((p) => DATED_PATH.test(p.oldPath!));
  // Dated addresses first in the sample, so the example shown matches what is listed.
  const ordered = [...dated, ...withPath.filter((p) => !DATED_PATH.test(p.oldPath!))];
  return {
    total: withPath.length,
    withDates: dated.length,
    example: dated.length ? `${dated[0]!.oldPath!.match(DATED_PATH)![0]}/` : null,
    sample: ordered.slice(0, 5).map((p) => p.oldPath!),
  };
}

function dateRange(posts: Post[]): Report['dates'] {
  const dates = posts.map((p) => p.date).filter(Boolean).sort();
  return dates.length ? { first: dates[0]!, last: dates[dates.length - 1]! } : null;
}

function base(content: SiteContent, bodies = content.posts.map((p) => p.html)): Pick<Report, 'published' | 'drafts' | 'authors' | 'categories' | 'tags' | 'images' | 'paths' | 'dates'> {
  return {
    published: content.posts.filter((p) => !p.draft).length,
    drafts: content.posts.filter((p) => p.draft).length,
    authors: content.authors.length,
    categories: content.categories.length,
    tags: content.tags.length,
    images: imageHosts(bodies),
    paths: pathFacts(content.posts),
    dates: dateRange(content.posts),
  };
}

/** Counts that come from the XML itself rather than from the parsed posts. Only counts are kept, never the values. */
function wxrExtras(xml: string) {
  const doc = parseXml(xml);
  let pages = 0;
  let attachments = 0;
  // Post bodies as written in the file. The parser's HTML also has gallery images added from attachment entries.
  const bodies: string[] = [];
  for (const it of Array.from(doc.getElementsByTagName('item'))) {
    const type = text(child(it, 'wp:post_type'));
    const status = text(child(it, 'wp:status'));
    if (type === 'post' && status !== 'trash' && status !== 'auto-draft' && status !== 'inherit') bodies.push(text(child(it, 'content:encoded')));
    if (type === 'attachment') attachments++;
    else if (type === 'page' && text(child(it, 'wp:status')) !== 'trash') pages++;
  }
  const comments = { total: 0, withName: 0, withEmail: 0, withIp: 0 };
  for (const c of Array.from(doc.getElementsByTagName('wp:comment'))) {
    comments.total++;
    if (text(child(c, 'wp:comment_author'))) comments.withName++;
    if (text(child(c, 'wp:comment_author_email'))) comments.withEmail++;
    if (text(child(c, 'wp:comment_author_IP'))) comments.withIp++;
  }
  return { pages, attachments, comments, bodies };
}

function bloggerExtras(xml: string) {
  const feed = parseXml(xml).documentElement;
  let pages = 0;
  let comments = 0;
  for (const e of Array.from(feed.children).filter((c) => c.localName === 'entry')) {
    const type = text(Array.from(e.getElementsByTagName('*')).find((c) => c.localName === 'type'));
    const kind = Array.from(e.children).find((c) => c.localName === 'category' && (c.getAttribute('scheme') ?? '').endsWith('#kind'))?.getAttribute('term') ?? '';
    if (type === 'PAGE' || kind.endsWith('#page')) pages++;
    else if (type === 'COMMENT' || kind.endsWith('#comment')) comments++;
  }
  return { pages, comments };
}

/** Counts from Ghost's JSON itself. Only counts are kept. Mirrors parseGhost: posts only, "deleted" skipped. */
function ghostExtras(json: string) {
  const root = JSON.parse(json) as { db?: unknown };
  const exported = (Array.isArray(root.db) ? root.db[0] : root) as { data?: Record<string, unknown> };
  const rows = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter((r) => r && typeof r === 'object') : []);
  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const data = exported.data ?? {};
  let pages = 0;
  let ghostUrlImages = 0;
  let ghostUrlCovers = 0;
  const drafts = { draft: 0, scheduled: 0, sent: 0, other: 0 };
  const bodies: string[] = [];
  const dates: string[] = [];
  for (const p of rows(data.posts)) {
    const type = s(p.type);
    const status = s(p.status);
    if (status === 'deleted') continue;
    if (type && type !== 'post') {
      if (type === 'page') pages++;
      continue;
    }
    if (status !== 'published') drafts[status === 'draft' || status === 'scheduled' || status === 'sent' ? status : 'other']++;
    const html = typeof p.html === 'string' ? p.html : '';
    bodies.push(html);
    for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) if (/\ssrc\s*=\s*["']__GHOST_URL__/i.test(tag)) ghostUrlImages++;
    if (s(p.feature_image).startsWith('__GHOST_URL__')) ghostUrlCovers++;
  }
  const internalTags = rows(data.tags).filter((t) => s(t.name).startsWith('#') || s(t.visibility) === 'internal').length;
  return { pages, bodies, ghost: { drafts, ghostUrlImages, ghostUrlCovers, internalTags } };
}

const isZip = (b: Uint8Array) => b.length > 3 && b[0] === 0x50 && b[1] === 0x4b;

export async function inspect(fileName: string, bytes: Uint8Array): Promise<Report> {
  const common = { fileName, bytes: bytes.length };
  if (isZip(bytes)) {
    const files = await mediumFilesFromZip(bytes);
    let content: SiteContent;
    try {
      content = await parseMediumFiles(files);
    } catch (e) {
      if (!(e instanceof WxrError)) throw e;
      // Only replies in the zip: still a Medium export, with nothing to move.
      content = { source: 'medium-file', siteUrl: null, posts: [], authors: [], categories: [], tags: [] };
    }
    return {
      ...common,
      kind: 'medium',
      ...base(content),
      pages: null,
      attachments: null,
      replies: files.length - content.posts.length,
      comments: null,
    };
  }
  const xml = strFromU8(bytes).replace(/^\uFEFF/, '');
  if (isGhostExport(xml)) {
    const content = await parseGhost(xml);
    const { pages, bodies, ghost } = ghostExtras(xml);
    // Only published posts set the date range: a scheduled post can sit years in the future.
    const published = { ...content, posts: content.posts.filter((p) => !p.draft) };
    return {
      ...common,
      kind: 'ghost',
      ...base(content, bodies),
      dates: dateRange(published.posts),
      pages,
      attachments: null,
      replies: null,
      comments: null,
      ghost,
    };
  }
  if (isBloggerExport(xml)) {
    const content = parseBlogger(xml);
    const extra = bloggerExtras(xml);
    return {
      ...common,
      kind: 'blogger',
      ...base(content),
      pages: extra.pages,
      attachments: null,
      replies: null,
      comments: { total: extra.comments, withName: 0, withEmail: 0, withIp: 0 },
    };
  }
  const content = parseWxr(xml);
  const { bodies, ...extra } = wxrExtras(xml);
  return { ...common, kind: content.source === 'squarespace-file' ? 'squarespace' : 'wordpress', ...base(content, bodies), ...extra, replies: null };
}

export { WxrError };
