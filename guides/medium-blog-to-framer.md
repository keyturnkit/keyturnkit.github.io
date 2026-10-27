---
layout: default
title: "Moving a Medium blog to Framer"
description: "What Medium's export contains, how to tell stories from replies, and how to get posts, images and tags into Framer CMS."
permalink: /guides/medium-blog-to-framer/
og_image: /og-blog-import.png
---

# Moving a Medium blog to Framer

Medium is an easy place to start writing and a hard place to own. When the writing becomes part of a business, people want it on their own site, under their own domain and design. If that site is in Framer, the stories need to move into Framer's CMS.

## Export from Medium

On Medium, open Settings from your profile picture, go to Security and apps, and choose Download your information. Medium emails you a link to a .zip file when it's ready ([Medium's help page](https://help.medium.com/hc/en-us/articles/115004745787-Export-your-account-data)).

Inside the zip, the posts folder has one HTML file per post, plus folders for your profile, lists and other account data you won't need.

## What's in the posts folder

Three kinds of files sit side by side.

1. **Stories**, the posts you published. Their file names start with the publish date.
2. **Drafts**, with names starting with draft_.
3. **Replies** you wrote under other people's stories. Medium stores each one as a post, so a busy commenter can have more replies than stories. Most of them shouldn't become blog posts.

A story has its title as a heading at the top of the body; a reply starts straight with text. That is the most reliable way we found to tell them apart.

Images stay on Medium's servers and the files link to a resized copy, usually 800 pixels wide. Tags appear at the bottom of each story when you set them.

## About your old links

Medium story addresses look like `medium.com/@you/my-story-4ce83a7e81d0`. Those stay on medium.com, so they can't be redirected to your Framer site. Two things help. Keep the stories on Medium, perhaps with a line at the end pointing to the new home, and if your publication used a custom domain, move that domain to Framer so its links can be redirected.

## Getting it into Framer

You could unzip the export, convert the HTML files to CSV with a script, and import that. You'd get the text, but you'd also get the replies, the small images and a title repeated at the top of every body.

We built [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), a Framer plugin that reads the Medium zip as it is. It imports stories and skips replies, keeps drafts as drafts, uses the subtitle as the excerpt and the featured image as the cover, turns tags into a linked collection, and copies large versions of the images into Framer. It also reads Squarespace, WordPress and Blogger exports. The newest 25 posts import for free.

## Check after the move

Open a story with several images and check they are sharp, and look for any reply that slipped through as a post. Then add a link from your Medium profile to the new site, so readers who find the old stories can follow you.

Before you import, the free [export inspector](/tools/blog-export-inspector/) shows what's in your export file: posts, drafts, images and old addresses. It reads the file in your browser and uploads nothing.

## More guides

- [Moving a Squarespace blog to Framer](/guides/squarespace-blog-to-framer/)
- [Moving a WordPress blog to Framer](/guides/wordpress-blog-to-framer/)
- [Moving a Blogger blog to Framer](/guides/blogger-blog-to-framer/)
