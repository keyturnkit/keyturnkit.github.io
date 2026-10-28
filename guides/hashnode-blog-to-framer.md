---
layout: default
date_published: 2026-10-29
title: "Moving a Hashnode blog to Framer"
description: "Hashnode's only way out is its GitHub backup, which is part of Pro since June 2026. How to get it, and what comes across into Framer CMS from it. Checked against Hashnode's changelog on 27 October 2026."
permalink: /guides/hashnode-blog-to-framer/
og_image: /og-blog-import.png
---

# Moving a Hashnode blog to Framer

Hashnode has no export button. The one way to get all your posts out as files is GitHub backup, which writes every post to a GitHub repository as a markdown file. Since 11 June 2026 that's a Pro feature, according to Hashnode's changelog, and blogs that had backup set up before then keep it. If you're on the free plan without a backup, the backup needs Pro switched on, at least until it has run once. This was checked against Hashnode's changelog on 27 October 2026.

## Getting the backup

1. Create an empty repository on GitHub. Private is fine.
2. In your blog dashboard (yourblog.hashnode.dev/dashboard), open Backup and install the Hashnode GitHub App. Give it access to that one repository only, not all of them, then confirm on Hashnode.
3. Click the button to back up all existing posts (Hashnode's help calls it "Back up all articles" or "Back up all my posts"). New and edited posts are added on their own after that. Don't rename the repository later; Hashnode's help says that breaks the backup.
4. On GitHub, open the repository, choose Code and then Download ZIP.

Each post is a file named after its Hashnode id, for example `clqvd4m9i000008l562f34hqk.md`.

## What comes across

With [Blog Import](https://www.framer.com/marketplace/plugins/blog-import-squarespace-wordpress/), the Framer plugin we make, choose the zip (or select the `.md` files) and you get:

- **Posts**, with title, slug, publish date, excerpt (your SEO description), cover image and body, including code blocks.
- **Images** from Hashnode's CDN, copied into Framer.
- **Tags**, as a linked collection.
- **Embeds** (Hashnode's `%[...]` lines) as plain links.
- **A redirect** for each post's old address, `/your-post-slug`, on Framer Pro or higher. It only helps if your old domain now points at the Framer site.

## What doesn't

- **Dates on older backups.** Some files written by older versions of Hashnode's backup have only a title and the text, with no date or slug. The plugin leaves those dates empty instead of guessing, says how many there are, and you set them in Framer CMS. In a real backup of 18 posts, 4 had no date.
- **Tag names.** The backup stores tags as slugs (`data-structures`), so that's what the tags are called until you rename them.
- **Authors, series and comments.** The backup doesn't hold them.
- **Your hashnode.dev address.** Redirects from `yourname.hashnode.dev` can't be set in Framer, because Hashnode owns that domain.

The newest 25 posts import free. More on the [Blog Import page](/blog-import/).

Before you import, the free [export inspector](/tools/blog-export-inspector/) shows what's in your backup: posts, drafts, images and old addresses. It reads the file in your browser and uploads nothing.

Rather not do it yourself? [Email us](/blog-move/) and we'll see how we can help.

