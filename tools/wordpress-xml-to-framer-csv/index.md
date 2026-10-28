---
layout: default
title: "WordPress XML to Framer CSV"
description: "Free converter. Choose a WordPress or Squarespace export (.xml) and download a CSV for Framer's CMS import. It runs in your browser and the file is never uploaded."
permalink: /tools/wordpress-xml-to-framer-csv/
og_image: /og-blog-import.png
extra_css: /assets/tools.css?v=3
---

# WordPress XML to Framer CSV

Choose the export file from your WordPress or Squarespace blog and download a CSV you can import into a Framer CMS collection. You get one row per published post, with the title, the old slug, the date, the excerpt, the post HTML, a cover image address, the author and the categories and tags, plus a :draft column.

The file is read in your browser and is never uploaded or sent anywhere.

<div class="tool-pick">
  <label for="export-file">Export file (.xml)</label>
  <input type="file" id="export-file" data-sources="wordpress squarespace" accept=".xml,application/xml,text/xml">
</div>

<div id="result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to read the file on your device.</p></noscript>

## Using the CSV in Framer

Framer's CSV Import plugin reads this file. In your CMS, open Plugins and choose CSV Import. Framer's guide to [importing CSV data](https://www.framer.com/learn/cms-import/) asks for one header per CMS field. The columns here are Title, Slug, Date, Excerpt, Content, Cover image, Author, Categories, Tags and :draft. A column named :draft decides whether a row comes in as a draft (true) or published (false). Framer's page names no file size limit, so try a small sample first.

Not sure where to find the file? See the guides for [WordPress](/guides/wordpress-blog-to-framer/) and [Squarespace](/guides/squarespace-export-xml/). To see what an export holds before you convert it, use the [blog export inspector](/tools/blog-export-inspector/). For the address of every image in the file, use the [image list](/tools/blog-export-image-list/). Other sources have their own converters: [Blogger](/tools/blogger-to-framer-csv/), [Ghost](/tools/ghost-to-framer-csv/) and [Medium](/tools/medium-to-framer-csv/).

<script type="module" src="/assets/tools/csv.js?v=3"></script>
