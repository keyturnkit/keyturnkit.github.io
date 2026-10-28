---
layout: default
title: "Medium to Framer CSV"
description: "Free converter. Choose your Medium export (.zip) and download a CSV for Framer's CMS import. It runs in your browser and the file is never uploaded."
permalink: /tools/medium-to-framer-csv/
og_image: /og-blog-import.png
extra_css: /assets/tools.css?v=3
---

# Medium to Framer CSV

Choose the zip you downloaded from Medium and download a CSV you can import into a Framer CMS collection. You get one row per published story, with the title, the old slug, the date, the excerpt, the post HTML, a cover image address, the author, the tags and a :draft column.

The file is read in your browser and is never uploaded or sent anywhere.

<div class="tool-pick">
  <label for="export-file">Export file (.zip)</label>
  <input type="file" id="export-file" data-sources="medium" accept=".zip,application/zip">
</div>

<div id="result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to read the file on your device.</p></noscript>

## Using the CSV in Framer

Framer's CSV Import plugin reads this file. In your CMS, open Plugins and choose CSV Import. Framer's guide to [importing CSV data](https://www.framer.com/learn/cms-import/) asks for one header per CMS field. The columns here are Title, Slug, Date, Excerpt, Content, Cover image, Author, Categories, Tags and :draft. A column named :draft decides whether a row comes in as a draft (true) or published (false). Framer's page names no file size limit, so try a small sample first.

Medium's zip also holds your replies to other people's stories. They are not stories, so the CSV leaves them out and the result tells you how many. The title and subtitle that Medium repeats at the top of each story are removed from the Content column.

Not sure where to find the file? See the guide to [what is inside a Medium export](/guides/medium-export/) and the one on [moving a Medium blog to Framer](/guides/medium-blog-to-framer/). To see what an export holds before you convert it, use the [blog export inspector](/tools/blog-export-inspector/). For the address of every image in the file, use the [image list](/tools/blog-export-image-list/).

<script type="module" src="/assets/tools/csv.js?v=3"></script>
