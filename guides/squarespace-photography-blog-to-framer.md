---
layout: default
title: "Moving a Squarespace photography blog to Framer"
description: "For wedding and portrait photographers with a blog on Squarespace: what the export file holds, why the photos need copying before you cancel, and what to check in your longest posts before switching the domain."
permalink: /guides/squarespace-photography-blog-to-framer/
og_image: /og-blog-import.png
date_published: "2026-10-30"
---

# Moving a Squarespace photography blog to Framer

A photographer's blog has one post per wedding, elopement or session, each with dozens of photos and often captions. The text is the easy part of the move. The photos and the old addresses are where it goes wrong, so this page is mostly about those.

## What the Squarespace export holds

Squarespace has one export format for blogs, and it is WordPress's. Open the Import & export panel, click Export, pick WordPress and download the `.xml` file. The site has to be published and public; a trial site can't export.

A few things about that file matter for a photo blog:

- **It holds addresses, not photos.** Every image in the file points at Squarespace's image host, `static1.squarespace.com`. Squarespace notes those addresses can stop working once the site is closed. If you import the file and then cancel, your posts can end up full of broken images.
- **One blog per export.** If you keep a wedding blog and a separate portrait or education blog, each needs its own export.
- **Drafts are usually left out.** Squarespace's help page says so, though one older file we opened still held a draft. Don't count on yours being there.
- **Comments carry personal details.** Each comment in the file includes the commenter's name, email address and IP address. Keep that in mind if you send the file to someone helping you move.

## Check your galleries and captions in the file

We have tested Squarespace exports for posts, images and old addresses, but we have not tested how Squarespace writes its gallery blocks or image captions into the export. Squarespace's help page says text and image blocks are included and that other blocks come through as plain text. What that means for a gallery of 40 photos is something to check in your own file before you rely on it.

The quickest way is to open the export in a text editor, find one of your gallery-heavy posts, and count the image addresses in it against the photos you see on the live post. Then search for the text of one or two captions to see whether they are in the file at all. The free [export inspector](/tools/blog-export-inspector/) also shows the posts, images and old addresses in the file. It reads the file in your browser and uploads nothing.

## Bringing it into Framer

[Blog Import](/blog-import/), the Framer plugin we make, reads the Squarespace file as it is. It is free, with no limit on posts.

The steps are short:

1. Install Blog Import in your Framer project and choose the export file. It lists how many posts, categories and tags it found.
2. Pick how the CMS should be laid out: posts with separate categories and tags collections, or everything inside each post for Framer Basic.
3. Leave "Copy images into Framer" on. This copies each photo from `static1.squarespace.com` into Framer, so the posts keep working after Squarespace is gone.
4. Import. Each post keeps its title, slug, date, excerpt, cover, categories and tags, and the photos sit in the body where they were.

Blog Import doesn't import comments.

## What we saw with 50 photos in one post

We built a test post with 50 captioned photos and ran it through a real Framer project. Two results matter here.

First, where the photos are hosted decides whether they copy. Photos on a plain static host, resized to 1600 px and under 400 KB each, all copied in under 20 seconds. Pointed at a host that refused Framer's requests, every image failed. So keep the Squarespace site online until the copy is done, and check afterwards that the photos in your posts load from Framer, not from `static1.squarespace.com`.

Second, captions. Framer's formatted text drops the HTML tags most blogs use for a captioned photo, so the photo arrived but the caption under it was gone. The fix turns each caption into a line in italics under its photo, and with it our test post came through with 50 photos and 50 captions in order. That fix is in the current version of Blog Import. Whether it picks up your Squarespace captions depends on how they are written in your export, so do the caption search above.

## Old addresses

Squarespace post addresses carry the date, like `/blog/2014/6/10/my-post`, and the slug in the file is `2014/6/10/my-post`. A Framer CMS slug is a single part of the address, so the post becomes something like `/blog/my-post`. Without a redirect, links from couples, vendors, wedding directories and search results land on a 404.

On Framer Pro or higher, Blog Import adds a redirect for each old post address. On Basic it gives you the old and new addresses as a CSV to add later. Either way, open a few old addresses after publishing to make sure they land on the right story.

## Before you cancel Squarespace

1. Export each blog page while the site is still live.
2. Check your longest posts in the file for photo counts and captions.
3. Import, with images copied into Framer.
4. Open those same posts on a phone and on a laptop, and check that every photo loads from Framer.
5. Publish, test a few old addresses, then move the domain.
6. Only then cancel Squarespace.

## A template for photo stories

If you would rather start from a design than build the post page yourself, [Second Shooter](/second-shooter/) is our photo journal template for wedding, elopement and portrait photographers. Each story opens on a full-width cover and keeps every photo large in the text column, with category pages and an enquiry form. It runs on Framer Basic, $69 once.

## More

- [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/)
- [What's inside a Squarespace blog export](/guides/squarespace-export-xml/)
- [Moving a Showit blog to Framer](/guides/showit-blog-to-framer/)
- [Redirects when you move a blog to Framer](/guides/framer-blog-redirects/)
