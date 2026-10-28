---
layout: default
date_published: 2026-10-26
title: "Framer CMS CSV import: when images don't come across"
description: "Why images go missing when you import a blog into Framer CMS from CSV, how to check, and how to keep them working after the old site is gone."
permalink: /guides/framer-cms-csv-import-images/
og_image: /og-blog-import.png
---

# Framer CMS CSV import: when images don't come across

A CSV is the quickest way to get rows into Framer's CMS, and for text it works well. If you have a WordPress or Squarespace export, the free [XML to CSV converter](/tools/wordpress-xml-to-framer-csv/) makes the file in your browser. Images are where blog imports go wrong, often days later, after the old site is switched off. Framer's own guide to CSV import ends with a reminder to check for missing images ([Import data from CSV](https://www.framer.com/learn/cms-import/)). This is what to look for and why it happens.

## Two kinds of images in a blog post

1. **The cover image**, one per post, in an image field.
2. **Images inside the post body**, in the rich text, often dozens per post.

They fail in different ways, so check both.

## Why covers go missing

An image cell in a CSV holds an address, not the picture. For the image to arrive, it has to be fetched from that address during the import. When we built an importer and tested it on real blogs, imports lost covers for three reasons.

- **The address is relative.** Exports sometimes write `/images/cover.jpg` instead of the full `https://...` address, and a relative path can't be fetched.
- **The old host refuses.** Some hosts block or slow down many requests in a row, and an import asks for every cover at once. We saw WordPress.org reject batches with "too many requests".
- **The old site is already gone.** If you cancel Squarespace or shut down WordPress first, the addresses point at nothing.

## When the cover column comes in as a link

Framer's CSV Import plugin (in the CMS view, under Plugins) guesses a type for each column. We read its [source code](https://github.com/framer/plugins/tree/main/plugins/csv-import) on 28 October 2026. It only guesses Image when every address in the column ends in .jpg, .jpeg, .png, .gif, .webp or .svg. One address like `cover.jpg?format=1500w`, or one with no extension, and the whole column is guessed as Link. If the plugin is creating that field for you, Link can then only become Link or Plain text, not Image.

The way round it is to add an Image field to the collection yourself before importing, then map the cover column to it. The plugin accepts link addresses in an existing Image field.

The same code also decides drafts. A row becomes a draft only if the CSV has a column named `:draft` with a value such as `true`. Use `true` and `false`: the check matches any value containing 1, y or true. Without that column, new rows are published and rows that update an existing item keep its current state.

## Why body images break later

Images inside the post text are usually left as links to the old host. Everything looks right after the import, because the old site is still up. When you cancel it, those images disappear. Squarespace warns that image links in its export can stop working once the site is closed.

To check, open a few imported posts in Framer, right-click an image in the body and copy its address. If it still points at your old domain, at `squarespace-cdn.com` or at `wp-content/uploads`, it isn't in Framer yet.

## How to keep them

- **Import before you cancel** the old site, and keep it online until you've checked the result.
- **Use full addresses** in image cells. Add the domain to any that start with a slash.
- **Copy body images into Framer**, not just the covers. With a CSV that means downloading each image, uploading it to Framer and replacing the address in the HTML, post by post.

That last step is the one that takes days by hand, so we built it into [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/). It reads a Squarespace, WordPress, Blogger, Medium or Ghost export directly, copies cover and body images into Framer at a steady pace so the old host doesn't refuse, writes a post without its cover rather than dropping it when a cover can't be fetched, and tells you which images it couldn't copy. The newest 25 posts import for free.

## Check after any import

Open the post with the most images, and the oldest post you have. Check the cover, every body image, and that each image address is a Framer one. Then you can switch off the old site.

## More guides

- [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/)
- [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/)
- [Moving a Blogger blog to Framer](/guides/blogger-blog-to-framer/)
- [Moving a Medium blog to Framer](/guides/medium-blog-to-framer/)
