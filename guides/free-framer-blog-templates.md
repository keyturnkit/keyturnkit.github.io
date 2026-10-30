---
layout: default
title: "Five free Framer blog templates, and what their CMS expects"
description: "Inkvora, Mark Walker, Reado, Noter and Pressra: what each free Framer blog template looks like, which CMS fields it uses, and what that means if you are bringing an old blog with you."
permalink: /guides/free-framer-blog-templates/
og_image: /og-blog-import.png
date_published: "2026-10-28"
---

# Five free Framer blog templates, and what their CMS expects

Searching the Framer Marketplace for "blog" mostly brings up free templates. They look finished, but each one has its own idea of what a post is: which fields it has, whether authors and categories are separate collections, and which switch puts a post on the home page. That matters as soon as you want your old posts in it.

We remixed two of them, Noter and Reado, and imported a WordPress blog into each. The other three we read from their preview sites, so their fields are what the pages show, not what the CMS panel says.

## Noter

[Noter](https://www.framer.com/marketplace/templates/noter/) is a quiet editorial blog. Its CMS has two collections: Posts and Categories (Design, Experience, Development).

A post has Title, Image, Category (a link to the Categories collection), Summary, Date, Content and a choice field called Type with Default, Highlighted and Featured. Type decides where a post shows: Highlighted posts go in the big slot at the top of the home page, Featured ones in the row under it. There is no author field.

Good for: a personal or studio blog with a handful of categories.

## Reado

[Reado](https://www.framer.com/marketplace/templates/reado/) is a magazine layout with a big masthead. It has the most structure of the five: Blog, Author, Categories, Podcast and Legal Pages.

A post has Title, Short Description, Date, Thumbnail (cards) and Thumbnail LG (the post page hero), Author and Category (both links to their own collections), Featured and Editor's Choice switches, Video URL, a Number field and Content. Reading time is counted from the text, so there is no field to fill.

Good for: a blog with several writers, or one that wants author pages.

## Inkvora

[Inkvora](https://www.framer.com/marketplace/templates/inkvora/) is a news and magazine layout. Its preview shows author pages, a category label on each post, a deck line under the title, a hero image and a reading time.

Good for: a publication with sections like Technology, Design or Culture.

## Mark Walker

[Mark Walker](https://www.framer.com/marketplace/templates/mark-walker/) is a minimal blog and portfolio for one person. Its index cards show a title, date, category, excerpt and thumbnail.

Good for: a single writer who also wants to show work.

## Pressra

[Pressra](https://www.framer.com/marketplace/templates/pressra/) covers blog, editorial and podcast layouts. Its posts show a category, a cover image and a reading time.

Good for: a blog that also publishes episodes.

## One more, made by us: Slack Tide

[Slack Tide](/slack-tide/) is a free template we built for newsletter and photo blog archives. It has one collection, Issues, which is the collection Blog Import makes, so the fields already match: Title, Date, Excerpt, Cover image and Content show on the page, and the rest are filled by the plugin. The archive is a grid of covers, three across on desktop, and every issue page links to the one before and after. It comes in a light and a dark scheme that follow the reader's system setting.

Good for: a Substack or Ghost newsletter moving to Framer.

## If you want a paid one made for Blog Import

[Back Issue](https://www.framer.com/marketplace/templates/back-issue/) is a magazine-style template we made around the fields Blog Import writes, so there is nothing to map: each year becomes a volume, each post a numbered entry, and a post without a photo gets a cover set from its title. It uses two collections, Blog and categories, so it runs on Framer Basic. $69 once, with a full refund within 14 days.

If the blog is mostly photographs, from weddings, elopements or portrait sessions, [Second Shooter](/second-shooter/) is our photo journal template: each story opens on a full-width cover and keeps every photo large in the text column. It runs on Framer Basic, $69 once.

## Bringing your old posts

Whichever you pick, the hard part of moving in is the same: the old posts, their images and their old addresses. [Blog Import](/blog-import/), the Framer plugin we make, reads a WordPress, Squarespace, Ghost, Medium or Blogger export (or a live WordPress site), puts the posts into Framer CMS with authors and categories as linked collections, copies the images into Framer and adds a redirect for each old address on Framer Pro or higher. You then connect the template's pages to that collection, or copy the template's layouts onto it. The newest 25 posts import free.

Three things we learned from Noter and Reado:

- Check the choice fields. A field like Noter's Type has a value on every post, and the first option is often the one that puts a post on the home page.
- Look for a second image field. Reado's post page reads Thumbnail LG, not Thumbnail; fill only one and the post pages show an empty hero.
- Authors and categories that are their own collection need matching names, or the posts show no author.

## More guides

- [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/)
- [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/)
- [Framer CMS limits for a blog](/guides/framer-cms-limits-blog/)
- [Blog import plugins for Framer compared](/guides/framer-blog-import-plugins-compared/)
