// Turns a WordPress or Squarespace export file into a CSV for Framer's CMS import. Runs in the browser; nothing is sent anywhere.
// Parsing is done by the Blog Import plugin's own reader (wxr.ts), so the post text, slugs and dates match what the plugin makes.
import { parseWxr, WxrError } from '@parsers/wxr';
import type { SiteContent } from '@parsers/types';

export const HEADERS = ['Title', 'Slug', 'Date', 'Excerpt', 'Content', 'Cover image', 'Author', 'Categories', 'Tags'] as const;

/** One CSV field, quoted when it holds a comma, quote or line break (RFC 4180). */
export function csvField(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(csvField).join(',')).join('\r\n') + '\r\n';
}

export interface Conversion {
  kind: 'wordpress' | 'squarespace';
  published: number;
  drafts: number;
  /** Rows written: published posts, plus drafts when asked. */
  rows: number;
  /** Rows whose Cover image cell is filled. */
  withCover: number;
  /** Image tags in the post text of the rows written, which still point at the old host. */
  bodyImages: number;
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
  ]);
  return {
    kind: content.source === 'squarespace-file' ? 'squarespace' : 'wordpress',
    published: content.posts.filter((p) => !p.draft).length,
    drafts: content.posts.filter((p) => p.draft).length,
    rows: posts.length,
    withCover: posts.filter((p) => p.coverUrl).length,
    bodyImages: posts.reduce((n, p) => n + (p.html.match(/<img\b/gi)?.length ?? 0), 0),
    csv: toCsv([[...HEADERS], ...rows]),
    preview: posts.slice(0, 5).map((p) => [p.title, p.slug, p.date ? p.date.slice(0, 10) : '']),
  };
}

/** Reads the file's text and parses it. Throws WxrError with a plain message when it is not a WordPress or Squarespace export. */
export function readExport(bytes: Uint8Array): SiteContent {
  return parseWxr(new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, ''));
}

export { WxrError };

export const csvName = (fileName: string) => `${fileName.replace(/\.[^.]*$/, '').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'blog'}-framer.csv`;
