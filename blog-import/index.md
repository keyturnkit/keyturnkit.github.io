---
layout: default
title: "Blog Import for Framer"
description: "A Framer plugin that moves a WordPress, Squarespace, Substack, Ghost, Medium, Blogger, Webflow or Hashnode blog into Framer CMS, with its images and old links. The newest 25 posts import free."
permalink: /blog-import/
og_image: /og-blog-import.png
schema: software
app_name: "Blog Import"
app_category: "BusinessApplication"
app_os: "Framer"
app_url: "https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/"
offers:
  - name: "License for one Framer project"
    price: "29"
    url: "https://buy.polar.sh/polar_cl_i4o62urYwzz1cDIpdNUCidOB022hhycvh5u1V0RTaWd"
  - name: "License for any number of Framer projects"
    price: "59"
    url: "https://buy.polar.sh/polar_cl_i4o62urYwzz1cDIpdNUCidOB022hhycvh5u1V0RTaWd"
---

# Blog Import for Framer

A Framer plugin for leaving WordPress, Squarespace, Substack, Ghost, Medium, Blogger, Webflow or Hashnode. It reads the export file, moves the blog into Framer CMS, copies the images into Framer and adds a redirect for each old post address, so the blog keeps working after you cancel the old site. Run it while the old site is still up, so the images can be fetched.

Keeping a WordPress site online and syncing from it? A live-sync plugin may suit you better; [the comparison](/guides/framer-blog-import-plugins-compared/) shows which.

<video src="/blog-import/demo.mp4" poster="/blog-import/demo-poster.jpg" controls muted playsinline preload="none" width="1600" height="1200" style="width:100%;height:auto;border-radius:12px;border:1px solid var(--line)"></video>

In this 34-second run the plugin reads wordpress.org/news, imports the newest 25 posts and copies 147 images into Framer.

<p><a class="btn btn-primary" href="https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/">Open in the Framer Marketplace</a></p>

Blog Import is on [Product Hunt](https://www.producthunt.com/products/blog-import-for-framer) today, 28 October. Questions there get an answer the same day.

## What it reads

Not sure what your export holds? The free [blog export inspector](/tools/blog-export-inspector/) reads it in your browser and shows the posts, drafts, images and old addresses inside.

- A Squarespace export file, from Import & export (Squarespace writes it in WordPress format)
- A WordPress export file, or just the address of a live WordPress site
- A Blogger backup file
- The zip Medium sends from "Download your information"
- A Ghost export file, from Settings, Migration tools, Export. Type the old blog address so images written as `__GHOST_URL__` can be fetched, or choose a zip of the content/images folder if the site is gone (see the [Ghost guide](/guides/ghost-blog-to-framer/))
- The zip Substack sends from Settings, Exports
- A Hashnode backup from its GitHub backup repository
- A CSV of the blog collection from Webflow's CMS

## What you get in Framer

Each post arrives with its title, slug, date, cover image, excerpt and body. Authors, categories and tags become their own collections, linked from each post; on Framer Basic, where four collections is too many, they can stay inside each post instead. Drafts stay drafts. YouTube and Vimeo embeds become video blocks. If a Vimeo block shows "Unable to resolve '@vimeo/player'" in the CMS, add a Vimeo element to any page once (Insert, Media, Vimeo) and reload the tab. Framer loads its video player per project, and you can delete the element afterwards. On [Framer Pro](https://framer.link/rVPBVzf) or higher, each old post address gets a redirect to the new one.

Run it again later and existing posts are updated, not duplicated.

It doesn't import comments, pages, WordPress custom post types or WooCommerce products.

## Price

The newest 25 posts import free, so you can see the result on your own blog first. To import all of them, a license is $29 for one Framer project or $59 for any number, paid once through Polar. After paying you get a key; [this page](/thanks/) shows how to turn it into the license code the plugin asks for.

[Buy a license on Polar](https://buy.polar.sh/polar_cl_i4o62urYwzz1cDIpdNUCidOB022hhycvh5u1V0RTaWd). Choose $29 for one project or $59 for any number on the checkout page. You can buy before installing the plugin.

Rather not run it yourself? [Email us](/blog-move/) and we'll see how we can help.

The Framer pricing link on this page is our referral link. If you start a new Framer account through it, Framer pays us a share of the first year; the price is the same for you.

## Guides {#guides}

<ul class="guide-list" style="padding-left:0">
{% assign guides = site.pages | where: "og_image", "/og-blog-import.png" | sort: "title" %}{% for g in guides %}{% if g.url contains '/guides/' %}
  <li><a href="{{ g.url }}"><span>{{ g.title }}</span><svg><use href="#i-arrow"/></svg></a></li>
{% endif %}{% endfor %}
</ul>
