---
layout: default
title: "Webflow's 16 November price change: keep your price, or move the blog to Framer"
description: "Sites in Webflow Freelancer and Agency workspaces, and sites on legacy pricing, move to the new plans from 16 November 2026. How to hold the old price for a year, and if you'd rather leave, how a Webflow blog moves to Framer. Written by the makers of Blog Import."
permalink: /guides/webflow-november-16-price-change/
og_image: /og-blog-import.png
---

# Webflow's 16 November price change

Webflow merged its CMS and Business site plans into one Premium plan this year and changed the price of every paid site plan. Most sites moved in June. Sites in Freelancer or Agency workspaces, and sites still on legacy pricing, change "on your next renewal or billable change on or after November 16, 2026", in Webflow's words. The new Premium plan includes 20,000 CMS items and 50 GB of bandwidth, where the old Business plan had 100 GB (Webflow's pricing calculator, read 28 October 2026). We make Blog Import, a Framer plugin, so read the first section with that in mind: it's the option that doesn't involve us.

## Keep your price for a year

Webflow says you can keep your current plan for one more year by switching the site to annual billing before 16 November. If a client site is happy on Webflow, that is the cheapest move: an hour of admin, no migration.

## If you'd rather move to Framer

There are two parts to a Webflow site, and they move differently.

- **The whole site.** Framer has its own free Webflow import for pages and CMS collections. Start there for the pages.
- **The blog, if you want its images and old links handled.** Export the blog collection from Webflow as CSV (CMS, the collection, Collection settings, Export). [Blog Import](/blog-import/) reads that CSV, guesses which columns hold the body, summary, cover, date and categories and shows its guess before importing, copies the images into Framer, and on Framer Pro adds a redirect from each old post address. It handles the blog collection only, not other collections or Webflow's own redirect list. It is free, with no limit on posts or projects, which suits agencies moving several client sites.

Framer's plans are $10 a month on Basic (2 CMS collections, no redirects) and $30 on Pro (10 collections, redirects), on framer.com/pricing in late October 2026. Compare against your Webflow renewal over a year or two, including the time to rebuild the pages.

[Moving a Webflow blog to Framer](/guides/webflow-blog-to-framer/) has the CSV steps in detail. If you'd rather have help, [email us](/blog-move/).

## Before 16 November

1. Check which of your sites sit in a Freelancer or Agency workspace, or on legacy pricing.
2. For each one, decide: annual billing to hold the price, or move.
3. For a move, export the blog CSV now, while the site and its images are online.
