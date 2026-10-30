---
layout: default
date_published: 2026-10-27
title: "Framer CMS limits for a blog: which plan fits how many posts"
description: "CMS items, collections and redirects on Framer's Basic and Pro plans, read from Framer's pricing page on 27 October 2026, worked out for a blog you're moving in."
permalink: /guides/framer-cms-limits-blog/
og_image: /og-blog-import.png
---

# Framer CMS limits for a blog: which plan fits how many posts

Moving a blog into Framer runs into three limits on the site plan: how many CMS items you can have, how many collections, and whether you get redirects. The numbers below come from Framer's pricing page on 27 October 2026. Framer changes plans now and then, so check the page before you pay.

## The numbers

| | Basic, $10/month | Pro, $30/month |
|---|---|---|
| CMS items | 1,000 | 2,500, then $20 per 10,000 more (40,000 max) |
| CMS collections | 2 | 10, then $40 per 10 more (40 max) |
| Site redirects | Not included | Included |
| Site pages | 30 | 150, then $20 per 100 more (700 max) |

The Free plan includes 10 CMS collections, but it can't use a custom domain, so it doesn't work for a blog people already visit at its own address.

Site pages are the pages you design. A blog post page made from a CMS collection is one page, however many posts it shows, so pages are rarely the limit for a blog.

## What counts against the item limit

Every post is one item. If authors, categories and tags each get a collection of their own, every author, category and tag is an item too. A blog with 800 posts, 3 authors, 12 categories and 150 tags is 965 items that way.

We read the limit as covering all collections on the site together. Framer's pricing page doesn't say it in so many words, so check the CMS usage in your project settings once the import is done.

## Which plan for which blog

**Up to about 900 posts, no old links to keep.** Basic can work. With only 2 collections, put the posts in one collection and keep authors, categories and tags as plain fields on each post rather than collections of their own.

**Old post addresses that get search traffic or links from other sites.** You need Pro, because Basic has no redirects. Without them every old post address is a 404 after you switch the domain. Our guide on [keeping old blog links working](/guides/framer-blog-redirects/) covers what to redirect.

**Between 1,000 and 2,500 items.** Pro, with authors, categories and tags as their own collections if you like.

**More than 2,500 items.** Pro plus the CMS items add-on: the pricing page lists $20 for each block of 10,000 more items.

## Doing the import

[Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, has an option for Basic: it keeps authors, categories and tags inside each post, so the whole blog fits in one collection. On Pro it creates the separate collections and links them, and adds a redirect for each old address. It reads Squarespace, WordPress, Blogger, Medium and Ghost exports. There's more on the [Blog Import page](/blog-import/).
