---
layout: default
date_published: 2026-10-29
title: "Moving a Substack to Framer"
description: "How to export your Substack posts, what comes across into Framer CMS, and what stays behind, including paid posts, podcasts and subscribers."
permalink: /guides/substack-blog-to-framer/
og_image: /og-blog-import.png
---

# Moving a Substack to Framer

Substack lets you download everything you've published as one zip file. That file is enough to rebuild the posts as a blog in Framer CMS. Your subscriber list and paid plans are a separate matter, covered at the end.

## Getting the export

In Substack, open your publication's Settings, choose Exports in the left menu and then Create new export. Substack emails you when the zip is ready. Inside is a `posts.csv` with one row per post and a `posts` folder with the text of each post as HTML.

## What comes across

With [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, choosing that zip brings over

- **Posts**, with title, publish date, body and the subtitle as the excerpt
- **Drafts**, kept as drafts when the export includes their text
- **Images in your posts**, copied into Framer from Substack's servers. Photos uploaded from an iPhone are stored as HEIC, which browsers don't show, so they come in as JPEG.
- **Buttons and links you added yourself**, as plain links
- **A redirect** from each old address (`/p/your-post`) to the new one, on Framer Pro or higher

Substack's own furniture is left out of the text, such as the subscribe boxes, the share buttons and the paywall marker.

Before it imports anything, the plugin reads the whole zip and tells you what it found. In a real export of 42 posts it counted 6 drafts, 5 posts that were paid-only and 12 podcast episodes, so none of it came as a surprise.

## What doesn't

- **Subscribers.** The email list is in the same export as a separate CSV, but Framer CMS is not a newsletter tool, so the plugin doesn't touch it. Move it to whichever email service you use next.
- **Paid access.** Posts that were only for paid subscribers become ordinary public posts in Framer. The plugin tells you how many before you import, and you can leave them out of Framer if they should stay behind a paywall.
- **Podcast audio.** Episodes come in as their show notes, without the audio file. The plugin says how many episodes it found.
- **Threads.** These are Substack's chat-style posts, not articles, so they are skipped.
- **Authors and tags.** The export doesn't include them.
- **Embedded tweets** come in as a quote with a link to the original, without the card around it.

## Your custom domain

If your Substack used your own domain, point that domain at Framer once the posts are in. The redirects then send `yourdomain.com/p/your-post` to the new address. If you stayed on `name.substack.com`, old links keep pointing at Substack, since that address belongs to them.

## A free template for a newsletter archive

[Slack Tide](/slack-tide/) is a free Framer template we made for this case: a grid of issues, newest first, with the cover, month and title of each, and a reading page per issue with links to the one before and after. It runs on the collection Blog Import makes, so there is nothing to connect. Remix it, then open Blog Import on its Issues collection, choose your Substack zip, pick "1 collection, everything inside each post" and tick "Remove the 16 posts already in this collection" so the samples go.

The newest 25 posts import free. More on the [Blog Import page](/blog-import/).

Before you import, the free [export inspector](/tools/blog-export-inspector/) shows what's in your export zip: posts, drafts, images and old addresses. It reads the file in your browser and uploads nothing.

Rather not do it yourself? [Email us](/blog-move/) and we'll see how we can help.
