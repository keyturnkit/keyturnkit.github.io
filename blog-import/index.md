---
layout: default
title: "Blog Import for Framer"
description: "A Framer plugin that moves a Squarespace, WordPress, Blogger or Medium blog into Framer CMS, with its images and old links. The newest 25 posts import free."
permalink: /blog-import/
og_image: /og-blog-import.png
---

# Blog Import for Framer

A Framer plugin that moves a Squarespace, WordPress, Blogger or Medium blog into Framer CMS. It copies the images into Framer and adds a redirect for each old post address, so the blog keeps working after you cancel the old site.

<video src="/blog-import/demo.mp4" poster="/blog-import/demo-poster.jpg" controls muted playsinline preload="none" width="1600" height="1200" style="width:100%;height:auto;border-radius:12px;border:1px solid var(--line)"></video>

In this 34-second run the plugin reads wordpress.org/news, imports the newest 25 posts and copies 147 images into Framer.

<p><a class="btn btn-primary" href="https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/">Open in the Framer Marketplace</a></p>

## What it reads

- A Squarespace export file, from Import & export (Squarespace writes it in WordPress format)
- A WordPress export file, or just the address of a live WordPress site
- A Blogger backup file
- The zip Medium sends from "Download your information"

## What you get in Framer

Each post arrives with its title, slug, date, cover image, excerpt and body. Authors, categories and tags become their own collections, linked from each post; on Framer Basic, where four collections is too many, they can stay inside each post instead. Drafts stay drafts. YouTube and Vimeo embeds become video blocks. On Framer Pro or higher, each old post address gets a redirect to the new one.

Run it again later and existing posts are updated, not duplicated.

It doesn't import comments, WordPress custom post types or WooCommerce products, and it doesn't read Ghost (Specter does).

## Price

The newest 25 posts import free, so you can see the result on your own blog first. To import all of them, a license is $29 for one Framer project or $59 for any number, paid once through Polar. After paying you get a key; [this page](/thanks/) shows how to turn it into the license code the plugin asks for.

## Guides {#guides}

<ul class="guide-list">
{% assign guides = site.pages | where: "og_image", "/og-blog-import.png" | sort: "title" %}{% for g in guides %}{% if g.url contains '/guides/' %}
  <li><a href="{{ g.url }}"><span>{{ g.title }}</span><svg><use href="#i-arrow"/></svg></a></li>
{% endif %}{% endfor %}
</ul>
