---
layout: default
date_published: 2026-10-29
title: "Importing a blog with Framer's CSV Import plugin"
description: "Step by step: where Framer's CSV Import lives, how it guesses field types, the :draft column, cover images, slugs and categories, from the plugin's own source code. Plus what a CSV can't move."
permalink: /guides/framer-csv-import-blog/
og_image: /og-blog-import.png
---

# Importing a blog with Framer's CSV Import plugin

Framer can fill a CMS collection from a CSV file with its own CSV Import plugin. For a blog that works well for text and has a few rules that aren't on screen. We read the plugin's [source code](https://github.com/framer/plugins/tree/main/plugins/csv-import) on 28 October 2026; the rules below come from it, and the menu path from the Framer editor.

## Get a CSV of your posts

Most blog platforms export XML, JSON or a zip, not CSV. Our free converters turn the export into a CSV with the columns Framer expects, in your browser: [WordPress and Squarespace](/tools/wordpress-xml-to-framer-csv/), [Blogger](/tools/blogger-to-framer-csv/), [Ghost](/tools/ghost-to-framer-csv/) and [Medium](/tools/medium-to-framer-csv/).

## Run the import

1. In your Framer project, switch to the CMS view.
2. Create the collection, or pick an existing one. It needs a slug field, or the import stops with "No slug field was found in your CMS Collection".
3. Open Plugins in the left panel and choose CSV Import.
4. Pick the collection at the top, then upload the CSV.
5. Match each column to a field, or let the plugin create the field, then import.

## How it decides each field's type

When the plugin creates a field, it guesses the type from every value in the column:

- All dates, with a time in any of them: Date & Time. Without times: Date.
- Any HTML tag or Markdown: Formatted Text. Post bodies land here.
- Every value an address ending in .jpg, .jpeg, .png, .gif, .webp or .svg: Image.
- Every value an address, but not all of them image files: Link.

The last rule catches blog covers. One cover like `photo.jpg?format=1500w`, or one with no extension, and the column becomes Link. A field the plugin creates as Link can only switch to Link or Plain Text. The way round it: add an Image field to the collection yourself before importing and map the cover column to it. An existing Image field accepts link addresses. For alt text, add a column named after the field plus `:alt`, such as `Cover image:alt`.

## Drafts

A row becomes a draft only if the CSV has a column named `:draft`. Write `true` or `false` in it: the check matches any value containing 1, y or true. Without the column, new rows are published, and rows that update an existing item keep that item's state. Our converters always add the column.

## Slugs

Each row's slug is lowercased, and anything that isn't a letter, number or parenthesis becomes a dash. Rows without a slug are skipped. If two rows end up with the same slug, the later one is skipped. When a slug already exists in the collection, the plugin asks whether to update that item or skip the row, with an option to apply the answer to all.

## Categories and tags

A reference field (single or multiple) is filled from slugs of items in the referenced collection, separated by commas. A value that matches no item's slug is an error for that cell. So to link posts to categories, import the categories into their own collection first, then make sure the post column holds those slugs (`coffee-brewing`), not the display names (`Coffee Brewing`). Otherwise keep categories as Plain Text.

## What a CSV can't do

- **Images inside posts** stay on your old site. The HTML still points there, and those images break when you close the old site.
- **Redirects** from your old post addresses aren't made.
- **Linked authors and categories** need the extra steps above, one collection at a time.

[Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/) reads the export file directly and does those in one run: it copies cover and body images into Framer, links authors, categories and tags as collections, keeps drafts, and adds a redirect for each old address on Framer Pro or higher. The newest 25 posts import free; a license is $29 for one project or $59 for any number.

## More guides

- [When images don't come across in a CSV import](/guides/framer-cms-csv-import-images/)
- [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/)
- [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/)
