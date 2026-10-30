---
layout: default
date_published: 2026-10-27
title: "Ghost to Framer: moving a blog from the export file"
description: "How to export a Ghost blog, what comes across into Framer CMS from the export file, and what doesn't, including images and custom routes."
permalink: /guides/ghost-blog-to-framer/
og_image: /og-blog-import.png
---

# Moving a Ghost blog to Framer

Ghost keeps everything you've written in one JSON file you can download from the admin. That file is enough to rebuild the blog in Framer CMS, with one gap you should know about before you cancel Ghost: images.

## Getting the export

In Ghost admin, open Settings, find Migration tools and choose Export. You get a `.json` file. It holds posts, pages, tags, authors and site settings, but not your images or theme.

## What comes across

With [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, choosing that file brings over:

- **Posts**, with title, slug, publish date, excerpt (your custom excerpt, or one made from the text), feature image and body
- **Drafts**, kept as drafts; scheduled posts come in as drafts too
- **Authors and tags**, as linked collections; Ghost's internal tags (the ones starting with `#`) are left out
- **A redirect** for each post's old address on Framer Pro or higher

## What doesn't

- **Images that point at your Ghost site without a domain.** Recent Ghost exports write image addresses as `__GHOST_URL__/content/images/...`, and the file doesn't say what the domain was. The plugin can't fetch those, so it leaves them out and tells you how many before you import. Images with a full address (on a CDN, for example) are copied into Framer. If most of your images are the placeholder kind, keep Ghost running until you've moved them, or download them from Ghost first.
- **Pages.** Only posts are imported.
- **Co-authors.** A post gets its first author.
- **Members, newsletters and paid content settings.** Member-only posts come in as ordinary posts.
- **Custom routes.** The redirects assume Ghost's default address, `/your-post-slug/`. If you changed routes in Ghost, check the redirects after importing.

## A free template for a newsletter archive

If your Ghost site was mainly a newsletter, [Slack Tide](/slack-tide/) is a free Framer template we made for it: a grid of issues, newest first, and a reading page per issue with links to the one before and after. Remix it, then open Blog Import on its Issues collection, choose your Ghost export file, pick "1 collection, everything inside each post" and tick "Remove the 16 posts already in this collection" so the samples go.

## Ghost to Framer with a site that's still running

If your Ghost site is still live, Specter is a Framer plugin that reads it through Ghost's Content API with a key you create. Blog Import works from the export file instead, so it also works after the Ghost site is gone, apart from the images above.

More on the [Blog Import page](/blog-import/).

If you want a CSV for Framer's CMS import instead, the free [Ghost to Framer CSV](/tools/ghost-to-framer-csv/) converter makes one in your browser and tells you how many images it had to leave out.

Before you import, the free [export inspector](/tools/blog-export-inspector/) shows what's in your export file: posts, drafts, images and old addresses. It reads the file in your browser and uploads nothing.

Rather not do it yourself? [Email us](/blog-move/) and we'll see how we can help.
