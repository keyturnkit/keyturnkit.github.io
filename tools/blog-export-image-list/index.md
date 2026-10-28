---
layout: default
title: "Blog export image list"
description: "Free tool. Choose a WordPress, Squarespace, Blogger, Ghost or Medium export and see the address of every cover image and post image in a table. Download it as a CSV. It runs in your browser and the file is never uploaded."
permalink: /tools/blog-export-image-list/
og_image: /og-blog-import.png
extra_css: /assets/tools.css?v=3
---

# Every image in your blog export

Choose the export file from your WordPress, Squarespace, Blogger, Ghost or Medium blog and see a table with the post title, whether the image is a cover or sits inside the post, and the full address of the image. Download the table as a CSV.

If you are about to cancel Squarespace, this shows which of your images are at addresses on the old host, so you can save them first. Addresses that are relative, with no site address in front, are marked because they cannot be fetched from the list alone.

The file is read in your browser and is never uploaded or sent anywhere.

<div class="tool-pick">
  <label for="export-file">Export file (.xml, .json or .zip)</label>
  <input type="file" id="export-file" data-tool="images" accept=".xml,.atom,.json,.zip,application/xml,text/xml,application/atom+xml,application/json,application/zip">
</div>

<div id="result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to read the file on your device.</p></noscript>

The cover is the featured image when the export has one, otherwise the first image in the post, so a cover can also appear as an image inside the post. The list covers posts, not pages. Drafts are included, and you can leave them out.

Not sure where to find the file? See the guides for [Squarespace](/guides/squarespace-export-xml/), [WordPress](/guides/wordpress-blog-to-framer/), [Blogger](/guides/blogger-blog-to-framer/), [Ghost](/guides/ghost-blog-to-framer/) and [Medium](/guides/medium-export/). To count posts, drafts and comments as well, use the [blog export inspector](/tools/blog-export-inspector/).

<script type="module" src="/assets/tools/csv.js?v=3"></script>
