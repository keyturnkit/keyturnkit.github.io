---
layout: default
title: "Blog export inspector"
description: "Choose a Squarespace, WordPress, Blogger, Ghost, Substack, Medium, Hashnode or Webflow export file and see what is inside it, in your browser, before you move to Framer."
permalink: /tools/blog-export-inspector/
og_image: /og-blog-import.png
extra_css: /assets/tools.css?v=3
---

# Blog export inspector

Choose the export file from your Squarespace, WordPress, Blogger, Ghost, Substack, Medium, Hashnode or Webflow blog and see what is inside it before you move. It counts posts, drafts, images, comments and old addresses, and says what each means for a move to Framer.

The file is read in your browser and is never uploaded or sent anywhere.

<div class="tool-pick">
  <label for="export-file">Export file (.xml, .json or .zip)</label>
  <input type="file" id="export-file" accept=".xml,.json,.zip,application/xml,text/xml,application/json,application/zip">
</div>

<div id="result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to read the file on your device.</p></noscript>

To list the address of every cover and post image in the file, use the free [image list](/tools/blog-export-image-list/).

Not sure where to find the file? See the guides for [Squarespace](/guides/squarespace-export-xml/), [Ghost](/guides/ghost-blog-to-framer/) and [Medium](/guides/medium-export/).

<script type="module" src="/assets/tools/inspector.js?v=4"></script>
