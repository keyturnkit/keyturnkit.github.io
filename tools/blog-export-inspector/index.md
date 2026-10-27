---
layout: default
title: "Blog export inspector"
description: "Choose a Squarespace, WordPress, Blogger or Medium export file and see what is inside it, in your browser, before you move to Framer."
permalink: /tools/blog-export-inspector/
og_image: /og-blog-import.png
extra_css: /assets/tools.css?v=1
---

# Blog export inspector

Choose the export file from your Squarespace, WordPress, Blogger or Medium blog and see what is inside it before you move. It counts posts, drafts, images, comments and old addresses, and says what each means for a move to Framer.

The file is read in your browser and is never uploaded or sent anywhere.

<div class="tool-pick">
  <label for="export-file">Export file (.xml or .zip)</label>
  <input type="file" id="export-file" accept=".xml,.zip,application/xml,text/xml,application/zip">
</div>

<div id="result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to read the file on your device.</p></noscript>

Not sure where to find the file? See the guides for [Squarespace](/guides/squarespace-export-xml/) and [Medium](/guides/medium-export/).

<script type="module" src="/assets/tools/inspector.js?v=1"></script>
