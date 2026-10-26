---
layout: default
title: "Moving a Blogger blog to Framer, with its images and old links"
description: "How to export a Blogspot blog, what the file contains, and how to get posts, labels, images and the old .html addresses into Framer CMS."
permalink: /guides/blogger-blog-to-framer/
---

# Moving a Blogger blog to Framer, with its images and old links

Blogger has been around since 1999, and plenty of blogs on it are older than the people now redesigning them. Moving one to Framer is mostly about the archive: years of posts, the labels on them, images hosted by Google, and addresses that other sites still link to.

This covers what Blogger gives you and how to bring it across. We checked it against sample Blogger exports in both the older and the current file format.

## Export the blog

In Blogger, open the blog, then Settings. Under Manage blog, choose Back up content, then Download. You get one .xml file with every post, page and comment ([Google's help page](https://support.google.com/blogger/answer/97416)).

The theme is a separate backup and doesn't matter here, since you build the design in Framer.

## What the file holds

The file is an Atom feed. Next to the posts it has pages, comments and blog settings, all as entries, so a tool has to pick out the posts. Two details matter for the move.

1. **Drafts and deleted posts are in there too.** Newer files mark each post as live, draft or deleted. Deleted posts shouldn't come back, and drafts should stay drafts.
2. **Images are resized copies.** Blogger stores a small version in the post (an address with s320 or s400 in it) and links it to the full one. Copy the small one and your new site gets blurry images.

Blogger has labels instead of categories and tags. In Framer they work best as one tags collection linked to each post.

## Keep your old links working

Blogger addresses look like `/2021/04/my-post.html`, and your Framer post will live somewhere like `/blog/my-post`. If you point your domain at Framer without redirects, every link from another site and every search result lands on a 404.

Framer adds redirects under Site Settings, Hosting, Redirects on the Pro plan and higher. A blog with a few hundred posts is too many to type by hand.

Redirects only help if your blog uses your own domain, which moves to Framer with you. A blogspot.com address stays with Blogger, so links to it can't be redirected; keep the old blog online with a short note pointing to the new site.

## Getting it into Framer

Framer's CMS imports CSV, so one route is converting the XML to CSV with a script. You get the post text, but not the labels as linked items, the full-size images or the redirects.

We built [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), a Framer plugin that reads the Blogger file directly. It keeps drafts as drafts and skips deleted posts. Labels become a tags collection linked to each post. It copies the full-size images into Framer, so they don't depend on Google's hosting, and adds a redirect from every old .html address on Framer Pro or higher. It also reads Squarespace and WordPress exports. The newest 25 posts import for free.

Comments and pages are not imported. Framer has no comments, and pages are worth rebuilding in Framer anyway.

## Check after the move

Open five old addresses, including one from the first year of the blog, and make sure each lands on the right post. Then look at a post with several photos and check they are sharp.
