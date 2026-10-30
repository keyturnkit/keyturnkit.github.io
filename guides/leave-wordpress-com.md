---
layout: default
date_published: 2026-10-28
title: "Leaving WordPress.com after the Automattic shake-up: export your blog and keep your links"
description: "Nothing about WordPress.com's prices changed this autumn, but if the news has you thinking about leaving, here is how to export the blog, what the file holds, and how to move it to Framer without breaking old links. Written by the makers of Blog Import."
permalink: /guides/leave-wordpress-com/
og_image: /og-blog-import.png
---

# Leaving WordPress.com after the Automattic shake-up

Automattic, the company behind WordPress.com, had an unusual autumn: its board put CEO Matt Mullenweg on leave on 9 September 2026 and he was back as CEO about 33 hours later (TechCrunch, 12 September), and layoffs that include WordPress.com staff began on 21 October (TechCrunch, 21 October). To be clear about what that means for a site owner: no WordPress.com price, plan or policy change came with it. Your site works the same today as last month. If the news still has you looking at the exit, this is what leaving involves. We make Blog Import, a Framer plugin, so we have a stake in where you go.

[Blog Import on the Framer Marketplace](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/) is the plugin this page refers to.

## Get your content out

In your WordPress.com dashboard, open Tools, then Export, and export all content. You get an `.xml` file (zipped) with posts, pages, comments, categories, tags and authors. The images are not inside it: the file holds their addresses on WordPress.com, which keep working while the site is up. Download the media library separately as a backup if your plan offers it.

Do this first even if you're not sure you'll leave. It costs nothing and it's your only copy.

## What changes if you move to Framer

- Your design is rebuilt in Framer, from a template or by a designer. WordPress themes and plugins don't come across.
- The posts can be moved. [Blog Import](/blog-import/) reads that export file inside Framer and puts each post into Framer CMS with its date, author, categories, tags and cover, and copies the images into Framer so they stay after the WordPress.com site is gone. It is free, with no limit on posts.
- Old links: WordPress.com addresses often look like /2024/03/09/my-post/. On Framer Pro or higher, the plugin adds a redirect from each old address to the new one. Framer Basic has no redirects, so add them after you upgrade; each post keeps its old address in the Old URL field.
- Comments, forms, shop and membership features don't move this way.

Framer costs $10 a month on Basic (2 CMS collections) and $30 on Pro (redirects, 10 collections), on framer.com/pricing in late October 2026. [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/) has the steps in detail, and if you'd rather have help, [email us](/blog-move/).

## Or stay, with a backup

Plenty of people will stay, and that's a reasonable choice. The useful habit either way: export your content every few months and keep the file somewhere that isn't WordPress.com.
