---
layout: default
title: "Exporting your Medium posts: what the zip contains"
description: "How to download your Medium posts, what's inside the zip, what stays on Medium, and how to move the posts to another site."
permalink: /guides/medium-export/
og_image: /og-blog-import.png
---

# Exporting your Medium posts: what the zip contains

Medium doesn't have a "download my blog" button as such. What it has is an account data export, and your posts are inside it. Here's how to get it, what we found in a real export a writer had published on GitHub, and what it leaves behind.

## Getting the export

Medium's help article "Export your account data" gives the steps. On the web: open Settings from your profile picture, go to the Security and apps tab, choose Download your information, and confirm with Export. The app has the same option under Settings, then Account. Medium emails you a link when the zip is ready; it isn't an instant download.

## What's inside

The zip has a folder per kind of data (your profile, claps, bookmarks and so on). The one that matters for a blog move is `posts`, which has one HTML file per item. File names start with the date and end with Medium's id for the post, like `2018-04-07_ICO-Reviews-07-04-2018-4ce83a7e81d0.html`.

Two things in that folder catch people out:

- **Replies are in there too.** Every response you wrote on someone else's story is its own HTML file, next to your actual stories. In that export, a story's file starts with a title heading and a reply's doesn't, which is how you tell them apart.
- **Drafts may be in there.** Unpublished posts can appear without a publish time. Check before you put them on a new site.

Each story's file keeps the title, subtitle, body, publish time, a link to the original post on Medium and, in the files we looked at, its tags.

## What stays on Medium

**Images.** The HTML files point at Medium's image servers (`cdn-images-1.medium.com` or `miro.medium.com`); the zip doesn't contain the pictures. They keep loading as long as Medium serves them, so copy them to your new site rather than linking to Medium.

**Claps, comments on your stories and follower counts.** These are Medium features and don't move with the text.

**Your Medium URLs.** Old links point at `medium.com/@you/...` or your publication. If you had a custom domain on Medium, redirect each old address to its new page after the move.

## Moving the posts

The HTML is Medium's own markup, with a lot of wrapper classes, so pasting it into another editor gives messy results. [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, reads the zip as it comes from Medium: it skips replies, keeps drafts as drafts, cleans the HTML down to what Framer's rich text understands and copies the images into Framer. The newest 25 posts import free. The step-by-step version is in [Medium to Framer](/guides/medium-blog-to-framer/).
