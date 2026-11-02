---
layout: default
date_published: 2026-10-26
title: "What's inside a Squarespace blog export"
description: "Squarespace exports a blog as a WordPress .xml file. Here is what we found inside a real one, what it leaves out, and what to check before you cancel."
permalink: /guides/squarespace-export-xml/
og_image: /og-blog-import.png
---

# What's inside a Squarespace blog export

Squarespace has one export format for blogs, and it isn't its own: it writes a WordPress file (WXR, an `.xml` file). You get it from the Import & export panel by choosing Export, then WordPress. Squarespace's help page lists what goes in and what stays behind; this is what one real file looked like when we opened it.

## A real export, item by item

We opened the export of a small personal blog written between 2013 and 2017. The file was 227 KB and held 72 items:

| Items | Count | What they are |
|---|---|---|
| Posts | 18 | 17 published, 1 draft |
| Pages | 2 | Basic pages, text only |
| Attachments | 52 | One entry per image, separate from the posts |
| Comments | 15 | Inside the posts they belong to |

It also listed 1 author and 1 category. The blog never used tags, so there were none.

## Where the images are

The file holds no images, only addresses. All 157 image addresses in this one pointed at `static1.squarespace.com`, Squarespace's image host, in a form like `static1.squarespace.com/static/.../img.jpg`. Those addresses are what your new site will load unless the images are copied somewhere else, and Squarespace notes they can stop working once the site is closed.

The 52 attachment items list images as entries of their own. Most importers, including WordPress itself, use them to rebuild a media library. For a Framer blog you can ignore them, since each image is already referenced from the post it appears in.

## What the file leaves out

- **Every blog after the first.** One export holds one blog page. A second blog needs its own export.
- **Audio, video and product blocks.** Squarespace's help page says these are left out; text from other blocks comes through as plain text.
- **Drafts, usually.** The help page says drafts are left out, yet this older file still held one. Don't count on yours being there.
- **Embedded code.** In this file, code that had been embedded with GitHub Gist scripts came through as plain links to gist.github.com.
- **Your design.** Styles, fonts and layout don't export at all; you rebuild those in Framer.

## Something to be careful with

The comments carry more than the comment text. Each one includes the commenter's name, email address and IP address. If you move comments anywhere, think about whether the new place should show or store those details. If you share the file with someone helping you migrate, it carries them too.

## Old post addresses

Each post keeps its Squarespace address, with the date in it: `/a-blog/2014/6/15/a-post-title`. Your Framer posts will live somewhere like `/blog/a-post-title`, so each old address needs a redirect if you want old links and search results to keep working. Our guide on [keeping old blog links working](/guides/framer-blog-redirects/) covers how.

## Before you cancel Squarespace

1. Export, open the file in a text editor, and search for the title of your newest and your oldest post to confirm both are there.
2. Count the `<item>` entries with a post type of `post`, and compare that with the number of posts you expect.
3. Move the posts into Framer and check that the images inside them load from Framer, not `static1.squarespace.com`.
4. Keep the Squarespace site running until all of that checks out.

## Moving it into Framer

[Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, reads this file as it is: it skips the attachment entries, keeps drafts as drafts, turns authors and categories into linked collections, copies images from `static1.squarespace.com` into Framer and adds a redirect for each old address. It doesn't import comments. The newest 25 posts import for free. The step-by-step version is in [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/).

Before you import, the free [export inspector](/tools/blog-export-inspector/) shows what's in your export file: posts, drafts, images and old addresses. It reads the file in your browser and uploads nothing.
