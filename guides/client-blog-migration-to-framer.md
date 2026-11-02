---
layout: default
date_published: 2026-11-02
title: "Moving a client's blog into Framer: a checklist for agencies"
description: "Where each platform keeps its blog export, why the images are not in the file, what redirects need, and what to check before the client cancels the old host. Written by the makers of Blog Import."
permalink: /guides/client-blog-migration-to-framer/
og_image: /og-blog-import.png
---

# Moving a client's blog into Framer: a checklist for agencies

The design is the part of a migration you quote for. The blog is the part that comes back to you a month later, when an old link from a newsletter lands on a 404 or the photos in a 2019 post stop loading. This page is a checklist for that part. We make [Blog Import](/blog-import/), a Framer plugin for this job, so weigh that.

## 1. Get the export before anything else

Ask the client for the export file in the first week, not the last. Each platform keeps it somewhere different:

| Platform | Where the export is |
|---|---|
| WordPress | Tools, Export, All content (an `.xml` file) |
| Squarespace | Import & export panel, Export, WordPress (an `.xml` file) |
| Blogger | Settings, Back up content, Download (an `.xml` file) |
| Medium | Settings, Security and apps, Download your information (a `.zip`) |
| Ghost | Settings, Migration tools, Export (a `.json` file) |
| Substack | Settings, Exports, Create new export (a `.zip`) |
| Webflow | CMS, the blog collection, Collection settings, Export (a `.csv`) |

Keep a copy in the project folder. Once the client cancels, it is also the only copy of the drafts.

## 2. The images are not in the file

None of these exports carry the images themselves. They carry addresses on the old host: `/wp-content/uploads/` on WordPress, Squarespace's image servers, Webflow's asset domain. Those addresses stop working when the client cancels, often weeks after launch. Copy the images into Framer during the import, then open a few old posts on the new site and check where each image loads from.

Our [image list tool](/tools/blog-export-image-list/) reads an export in the browser and lists which images sit on the old host.

## 3. Redirects need Framer Pro

Every old post address needs a redirect to its new path, or links from other sites and search results end on a 404. Framer has redirects on Pro and higher, under Site Settings, Hosting, Redirects; Basic has none. If the client is on Basic, say so in the quote. Old addresses look different on each platform, for example `/2024/03/09/my-post/` on WordPress and `/blog/2014/6/10/my-post` on Squarespace. [Redirects for a moved blog](/guides/framer-blog-redirects/) has the patterns. Addresses that were never on the client's domain can't be redirected from Framer: `name.blogspot.com`, `name.ghost.io`, `name.substack.com` and stories on `medium.com`. Leave those posts up with a link to the new site.

## 4. Check the CMS limits against the post count

Basic allows 1,000 CMS items and 2 collections, Pro 2,500 items and 10 collections. Authors, categories and tags count as items when they are collections of their own. On Basic, keep authors, categories and tags as fields on each post instead. [Framer CMS limits for a blog](/guides/framer-cms-limits-blog/) works through the numbers.

## 5. Before the client cancels

1. Images load from Framer, not the old host.
2. Redirects are added and the site is published.
3. The domain points at Framer.
4. Five old addresses, one from the oldest year, land on the right post.
5. Only then cancel the old platform. Budget a month of overlap.

## Doing the import

By hand is fine for ten posts. For more, Framer's CSV import brings the text in, but images inside posts stay linked to the old host and there are no redirects.

Blog Import reads every export in the table above, copies the images into Framer (for Ghost images the export writes as `__GHOST_URL__`, it asks for the old blog address or a zip of the images, see [the Ghost guide](/guides/ghost-blog-to-framer/)) and, on Pro, adds one redirect per post from the old address on the client's own domain. The newest 25 posts import free, so you can run it on a real client blog before paying. A license is $29 for one Framer project or $59 for any number of projects, paid once. Other plugins do parts of this; [the comparison](/guides/framer-blog-import-plugins-compared/) lists them.
