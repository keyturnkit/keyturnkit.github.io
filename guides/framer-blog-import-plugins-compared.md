---
layout: default
title: "Moving a blog to Framer: the import plugins compared"
description: "Six Framer plugins for importing a blog, side by side, with prices and what happens to images and old links."
permalink: /guides/framer-blog-import-plugins-compared/
og_image: /og-blog-import.png
---

# Moving a blog to Framer: the import plugins compared

There are several Framer plugins that bring a blog into the CMS, and they differ in the places that hurt later: whether images move into Framer or stay on the old host, and whether old post addresses keep working. We make one of them, Blog Import, so read this with that in mind. Everything below comes from each plugin's Marketplace listing on 26 October 2026; prices and features change, so check the listing before you buy.

## At a glance

| Plugin | Reads | Price | Images | Old links |
|---|---|---|---|---|
| CSV Import (by Framer) | A CSV you prepare | Free | Cover images by address; images inside posts stay as links to the old host | No redirects |
| Squarespace Import | Squarespace export file | First 25 posts free, then $49 one project or $99 unlimited | Copied into Framer, including images inside posts | Adds redirects (Framer plan with redirects needed) |
| PostPort | WordPress export file | $39 once | You pick image files from your computer | Not mentioned |
| WP Sync | A live WordPress site | Not shown on the listing | Imported with the content | Not mentioned |
| Specter | A Ghost site, with your Content API key | Not shown on the listing | Featured images | Not mentioned |
| Blog Import | Squarespace, WordPress (file or live site), Blogger and Medium exports | First 25 posts free, then $29 one project or $59 any number | Copied into Framer, including images inside posts | Adds redirects (Framer Pro or higher) |

## Which one fits

**A few posts, or data you already have in a spreadsheet.** Use Framer's own CSV Import. It's free and does text well. Before you cancel the old site, check the images: our guide on [CSV imports and missing images](/guides/framer-cms-csv-import-images/) shows how.

**A Squarespace blog.** Squarespace Import and Blog Import both read the Squarespace export, copy the images and add redirects. Squarespace Import also turns Vimeo videos into embeds, which Blog Import doesn't do yet (YouTube works in both). Blog Import costs less. Try both on your 25 newest posts, which are free in each.

**A WordPress site you want to keep in sync.** WP Sync connects to the live site and can import again later, including custom post types and WooCommerce products. If you're leaving WordPress for good, an export file is enough: PostPort, Blog Import and CSV Import all work from one.

**A WordPress blog with a lot of images.** PostPort asks you to choose image files from your computer, which works for a handful of posts. Blog Import fetches the images from the old site and copies them into Framer for you.

**Ghost.** Specter is the one built for it. The other plugins here don't read Ghost.

**Blogger or Medium.** Of the plugins on this list, only Blog Import reads their exports: Blogger's backup file and Medium's "Download your information" zip.

## Before you switch the domain

Whichever plugin you use, do these in order:

1. Import, publish the blog pages, and open a few posts with images.
2. Check that image addresses inside the posts point to Framer, not the old host.
3. Add redirects, then point the domain at Framer.
4. Keep the old site online until all of that checks out.

Our guides go into each step for [Squarespace](/guides/squarespace-blog-to-framer/), [WordPress](/guides/wordpress-blog-to-framer/), [Blogger](/guides/blogger-blog-to-framer/) and [Medium](/guides/medium-blog-to-framer/), and [redirects](/guides/framer-blog-redirects/) have one of their own.
