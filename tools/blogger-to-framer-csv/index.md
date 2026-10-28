---
layout: default
title: "Blogger to Framer CSV"
description: "Free converter. Choose your Blogger export (.xml or .atom) and download a CSV for Framer's CMS import. It runs in your browser and the file is never uploaded."
permalink: /tools/blogger-to-framer-csv/
og_image: /og-blog-import.png
extra_css: /assets/tools.css?v=3
---

# Blogger to Framer CSV

Choose the export file from your Blogger blog and download a CSV you can import into a Framer CMS collection. You get one row per published post, with the title, the old slug, the date, the excerpt, the post HTML, a cover image address, the author, the tags and a :draft column. Blogger labels go in the Tags column.

The file is read in your browser and is never uploaded or sent anywhere.

<div class="tool-pick">
  <label for="export-file">Export file (.xml or .atom)</label>
  <input type="file" id="export-file" data-sources="blogger" accept=".xml,.atom,application/xml,text/xml,application/atom+xml">
</div>

<div id="result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to read the file on your device.</p></noscript>

## Using the CSV in Framer

Framer's CSV Import plugin reads this file. In your CMS, open Plugins and choose CSV Import. Framer's guide to [importing CSV data](https://www.framer.com/learn/cms-import/) asks for one header per CMS field. The columns here are Title, Slug, Date, Excerpt, Content, Cover image, Author, Categories, Tags and :draft. A column named :draft decides whether a row comes in as a draft (true) or published (false). Framer's page names no file size limit, so try a small sample first.

Pages and comments in the Blogger file are left out of the CSV. Posts you deleted in Blogger are left out too, and drafts are optional.

Not sure where to find the file? See the guide to [moving a Blogger blog to Framer](/guides/blogger-blog-to-framer/). To see what an export holds before you convert it, use the [blog export inspector](/tools/blog-export-inspector/). For the address of every image in the file, use the [image list](/tools/blog-export-image-list/).

<script type="module" src="/assets/tools/csv.js?v=3"></script>
