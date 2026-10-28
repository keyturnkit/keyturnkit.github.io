---
layout: default
title: "Import an old blog into the Framer template you already picked"
description: "Bring WordPress, Squarespace, Ghost, Medium, Substack or Blogger posts into the blog collection of a Framer template you remixed, field by field, without touching the template's own posts."
permalink: /guides/import-blog-into-framer-template/
og_image: /og-blog-import.png
---

<!-- DRAFT V372. Publish only when the V369 release of Blog Import is live on the Marketplace. Before publishing: re-check every sentence marked CHECK against the released build, add shots from status/V371-shots. -->

# Import an old blog into the Framer template you already picked

Most Framer blog templates come with a Posts collection already wired to their pages: the home page, the post page, the category pages. If you have years of posts on WordPress, Squarespace or Ghost, you want them in that collection, in that template's fields, not in a new collection you then have to connect by hand.

[Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, can now write into a collection you already have.

## Before you start

- Remix the template and keep its sample posts for now. They show you which fields the pages use.
- Get your export file (WordPress: Tools, Export; Squarespace: Settings, Import and export; Ghost: Settings, Migration tools) or have your WordPress address ready.
- Open the plugin from the canvas, not from the CMS view. From the CMS view Framer only offers to make a new collection.

## Pick the collection

The first screen lists the collections in the project that you or the template made, with how many items each has. Pick the one the post pages use, usually called Posts, Blog or Articles.

## Match the fields

Blog Import reads your posts, then shows one row per part of a post: title, slug, body, date, excerpt, cover image, author, category, tags and old address. Each row has a dropdown with the template's fields of a matching type, and "Don't import".

It fills in the obvious ones for you. On the free Noter template, for example, title, body and date matched by name, the excerpt went to Summary, the cover to Image and the category to the template's Category collection. Nothing had to be picked by hand.

Categories and authors that are their own collection in the template are matched by name. On Noter, WordPress posts filed under Development landed in Noter's Development category. Categories the template doesn't have are left empty, and the plugin lists them before and after the import so you can add them to the template's Categories collection and import again.

Some templates also have a choice field, like Noter's Type (Default, Highlighted, Featured), that decides where a post appears. The match screen has a row for it, "Type: value for imported posts", and starts on Default, so an old post doesn't take over the home page. After the import, set Highlighted or Featured on the posts you want in those spots; until you do, the template shows those sections empty.

## Import

Posts come in as drafts unless you tick "Publish the posts", so you can look them over on the canvas before they go live. Images are copied into Framer, so they stay when you close the old site.

The template's own posts are never changed unless you ask. On the first import there is a box, "Remove the 9 posts that came with the template" (the number is your template's), off until you tick it. Ticked, it lists the titles it will remove, and it only removes posts that were there before that first import.

## Running it again

If you fix something on the old blog and import again, posts the plugin added earlier are updated in place, not duplicated, and posts you wrote in Framer yourself are left alone. A post you published by hand stays published.

## What it costs

The newest 25 posts import for free, so you can see the result in your template first. A license imports the rest: $29 for one Framer project, $59 for any number. [Get a license](https://keyturnkit.github.io/blog-import/).

## What doesn't come across

- **Redirects.** In this mode the plugin doesn't add redirects from your old addresses yet. <!-- CHECK --> Our [redirect guide](/guides/framer-blog-redirects/) shows how to add them.
- **Posts with no featured image** get an empty cover, and the template shows its placeholder.
- **Fields the template doesn't have.** If the template has no Author field, authors aren't imported.
