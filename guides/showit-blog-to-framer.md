---
layout: default
title: "Moving a Showit blog to Framer"
description: "A Showit blog runs on WordPress, so it exports as a WordPress XML file. How to export it, bring the posts and photos into Framer CMS with Blog Import, and what to check for a photo-heavy blog."
permalink: /guides/showit-blog-to-framer/
og_image: /og-blog-import.png
date_published: "2026-10-29"
---

# Moving a Showit blog to Framer

Showit designs the pages, but the blog behind a Showit site is a WordPress install. That makes the move to Framer simpler than it looks: the blog exports as a standard WordPress XML file, and that file carries every post, its date, categories, tags and the addresses of its images.

Showit raised its prices for new subscriptions from 15 January 2026 and for renewals from 1 March 2026 ([Showit's announcement](https://showit.com/2026-price-change)), which is why some photographers are looking at the move now.

## Export the blog

Showit's own help page covers it ([Export WordPress](https://learn.showit.com/en/articles/4785318-export-wordpress)): log in to the WordPress admin of your blog, open Tools, then Export, choose All content and download the file. Keep the Showit site online until the move is done, because the images are copied from it.

## Bring it into Framer

1. In your Framer project, install [Blog Import](/blog-import/) from the Framer Marketplace and open it.
2. Choose the XML file. Blog Import lists how many posts, categories and tags it found.
3. Pick how the CMS should be laid out: posts with separate categories and tags collections, or everything inside each post for Framer Basic.
4. Leave "Copy images into Framer" on, so the photos keep working after the Showit site is gone. A post with 50 photos copies in well under a minute.
5. Import. Each post keeps its title, slug, date, excerpt, cover, categories and tags, and photos sit in the body where they were.

Your newest 25 posts import free. A license imports the rest: $29 for one Framer project or $59 for any number, paid once.

## Check before you switch the domain

- **Photo captions.** The current version of Blog Import keeps every photo but not the caption text under it. The next version keeps captions as a line under each photo; if your posts rely on captions, wait for it or re-import later, which updates the same posts instead of adding copies.
- **Old addresses.** On Framer Pro or higher, Blog Import adds a redirect for each old post address. On Basic it gives you the old and new addresses as a CSV to add later.
- **Galleries.** WordPress gallery blocks come in as a run of photos. Open two or three of your longest posts on a phone and look.
- **Design.** Framer's CMS gives you a list page and a post page to design once; every post then uses them.

If you would rather start from a design, [Second Shooter](/second-shooter/) is our photo journal template built for these imports: big photo cards, full-width story pages with captions, and an enquiry form.

## More

- [Moving a Squarespace photography blog to Framer](/guides/squarespace-photography-blog-to-framer/)
- [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/)
- [Redirects when you move a blog to Framer](/guides/framer-blog-redirects/)
- [Framer CMS limits for a blog](/guides/framer-cms-limits-blog/)
