---
layout: default
date_published: 2026-10-27
title: "Moving a Wix blog to Framer"
description: "Wix doesn't export blog posts to other platforms. What that leaves you with when you move a Wix blog to Framer CMS, from the RSS feed to copying by hand. Checked against Wix's help center on 27 October 2026."
permalink: /guides/wix-blog-to-framer/
og_image: /og-blog-import.png
---

# Moving a Wix blog to Framer

The short version first. Wix has no export for blog posts. Its help center lists "exporting blog posts to other platforms" as a feature request that isn't available, so there's no file you can download and import somewhere else. Everything below works around that. It was checked against Wix's help center on 27 October 2026.

## What Wix does let you do

- **Move posts to another Wix site.** Wix can import blog posts from one Wix site to another, as long as both are in the same Wix account. That doesn't help when the destination is Framer.
- **The RSS feed.** A Wix blog has an RSS feed, but Wix shows at most the 20 newest posts in it (another open feature request). For a small blog that can be enough to start from; for a bigger one it covers only the recent posts.

## Your options for Framer

1. **Copy the posts by hand.** For a blog of a few dozen posts this is honestly the most reliable way. In Framer CMS, create a collection with title, date, cover image and a formatted text field, then paste each post's text in. Save the images first and upload them to Framer, rather than pointing at Wix's image addresses, which you can't count on once the site is closed.
2. **Use the RSS feed for the newest 20.** Tools that read RSS can turn those posts into a CSV for Framer's CSV import. Check a few posts afterwards: feeds often carry a summary rather than the full text.
3. **Rebuild only what's worth keeping.** Many old blogs have a handful of posts that bring visitors and a long tail that doesn't. Your analytics in Wix tell you which is which.

Whichever you pick, add a redirect from each old Wix address to the new Framer one, so search results and links keep working. Wix blog posts usually live at `/post/your-post-slug`, and Framer adds redirects under Site Settings, Hosting, Redirects on its Pro plan and higher.

## What about Blog Import?

Our plugin, [Blog Import](/blog-import/), reads export files from Squarespace, WordPress, Blogger, Medium, Ghost, Substack, Hashnode and Webflow. Since Wix has no export, Blog Import can't read a Wix blog.
