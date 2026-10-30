---
layout: default
date_published: 2026-10-29
title: "Moving a Webflow blog to Framer"
description: "Export your Webflow blog collection as CSV and bring it into Framer CMS with images and redirects, and when a whole-site Webflow importer is the better choice. Checked on 27 October 2026."
permalink: /guides/webflow-blog-to-framer/
og_image: /og-blog-import.png
---

# Moving a Webflow blog to Framer

Webflow exports each CMS collection as a CSV file. For a blog, that one file holds everything Framer needs: titles, slugs, dates, the post body as HTML, and the addresses of your images. The catch is the images. They stay on Webflow's servers, and Webflow says those links stop working if the project is deleted, so copy them into Framer before you close the Webflow site. Checked on 27 October 2026.

## Getting the CSV

In the Webflow Designer, open the CMS panel, select your blog collection and use Export. You get one CSV for that collection. Two things to know:

- The export holds the items of the language you're viewing, if the site is translated.
- Other collections (authors, categories) come as separate files. A category on a post appears in the blog CSV as its name.

## What comes across with Blog Import

[Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, reads the blog CSV. Every Webflow site names its fields differently, so the plugin guesses which column is which and shows its guess before you import, for example body "Post Body", excerpt "Post Summary", cover "Main Image", date "Date" and categories "Category". If the guess is wrong, rename the column in the CSV and choose the file again.

- **Posts** with title, slug, date, excerpt and body.
- **Cover images** from your main image field, or a thumbnail field when the main one is empty.
- **Images in the posts**, copied into Framer.
- **Categories** as a linked collection.
- **Draft and archived items**, when your export has those columns: drafts stay drafts, archived items are left out.
- **A note for items without a date**, so you can set them in Framer CMS. In a real export of 61 posts and 3 categories, one post had no date.
- **A redirect** for each old address. The Old blog address box on the review screen starts at `/blog`. Change it to where your blog lived on Webflow, and the plugin adds `/blog/your-post-slug` as the old address for each post, pointing at the new Framer one. Redirects need a Framer plan that includes them.

## When another plugin fits better

Blog Import moves the blog collection only. If your Webflow site has many collections that link to each other, or you rely on the 301 redirects you set up in Webflow, use Webflow Import, a Framer plugin made for whole Webflow sites: it reads every collection's CSV at once, keeps the links between them and brings over Webflow's own redirects. It's $49 for one project or $99 for any number, with 25 items per collection free (its Marketplace listing, 27 October 2026).

Blog Import is free, with no limit on posts, and also reads WordPress, Squarespace, Substack, Ghost, Medium, Blogger and Hashnode, if you have a second blog to move.

More on the [Blog Import page](/blog-import/).

Before you import, the free [export inspector](/tools/blog-export-inspector/) shows what's in your CSV: posts, drafts, images and old addresses. It reads the file in your browser and uploads nothing.

Rather not do it yourself? [Email us](/blog-move/) and we'll see how we can help.
