---
layout: default
title: "Keeping old blog links working after moving to Framer"
description: "What old post addresses look like on Squarespace, WordPress, Blogger, Medium and Ghost, and how to redirect them to your new Framer blog."
permalink: /guides/framer-blog-redirects/
og_image: /og-blog-import.png
---

# Keeping old blog links working after moving to Framer

Every post you've published has an address that other sites, newsletters and search results point to. When the blog moves to Framer, those addresses change. Without redirects, every one of those links lands on a 404, and the search ranking those posts built up starts to fade.

## What the old addresses look like

Each platform has its own pattern, and your Framer post will live somewhere like `/blog/my-post`.

| Platform | Old post address |
|---|---|
| Squarespace | `/blog/2024/3/9/my-post` |
| WordPress | `/2024/03/09/my-post/` or `/my-post/`, depending on the permalink setting |
| Blogger | `/2024/03/my-post.html` |
| Medium | `medium.com/@you/my-post-4ce83a7e81d0` |
| Ghost | `/my-post/` by default; custom routes in `routes.yaml` can change it |

Two cases can't be redirected from Framer, because the old address isn't on your domain: a blog on `yourname.blogspot.com`, and stories on `medium.com`. For those, keep the old blog online with a note pointing to the new site. Redirects work when your blog used your own domain, which moves to Framer with you.

## Where redirects live in Framer

Framer handles redirects under Site Settings, Hosting, Redirects, on the Pro plan and higher. Each redirect maps one old path to one new path.

For a handful of posts that's quick. For a blog with a few hundred posts, typing them is slow and easy to get wrong: a missing slash or a date in the wrong format, and the redirect never fires.

## Set them up before you switch the domain

The order matters:

1. Import the posts into Framer and publish the blog pages.
2. Add the redirects.
3. Point the domain at Framer.
4. Open a few old addresses, including one from the oldest year, and check each lands on the right post.

If you switch the domain first, there's a gap where every old link is a 404.

## Doing it in one step

[Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/) reads each post's old address from the export file (Squarespace, WordPress, Blogger, Ghost) or the live WordPress site, and adds one redirect per post to your Framer blog path when it imports. It skips redirects that already exist, so importing again doesn't create duplicates, and if two posts want the same new address, the second one gets `-2` and its redirect follows it. For Ghost it uses the default `/my-post/` address, because the export file doesn't include custom routes, so check a few redirects if you changed them. Redirects need Framer Pro or higher; on other plans the plugin imports the posts and tells you redirects weren't added. The newest 25 posts import for free.

## More guides

- [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/)
- [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/)
- [Moving a Blogger blog to Framer](/guides/blogger-blog-to-framer/)
- [Moving a Medium blog to Framer](/guides/medium-blog-to-framer/)
- [Framer CMS CSV import: when images don't come across](/guides/framer-cms-csv-import-images/)
