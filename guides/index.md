---
layout: default
title: "Guides"
description: "Step-by-step guides for moving an old blog into Framer CMS and for selling a Chrome extension with license keys."
permalink: /guides/
---

# Guides

## Moving a blog into Framer

These cover exporting from each platform and bringing the posts into Framer CMS with [Blog Import](/blog-import/).

<ul class="guide-list" style="padding-left:0">
{% assign blog = site.pages | where: "og_image", "/og-blog-import.png" | sort: "title" %}{% for g in blog %}{% if g.url contains '/guides/' %}
  <li><a href="{{ g.url }}"><span>{{ g.title }}</span><svg><use href="#i-arrow"/></svg></a></li>
{% endif %}{% endfor %}
</ul>

## Selling a Chrome extension

These come with [Keyturn Kit](/), our starter for paid extensions with license keys.

<ul class="guide-list" style="padding-left:0">
{% assign all = site.pages | sort: "title" %}{% for g in all %}{% if g.url contains '/guides/' and g.url != '/guides/' and g.og_image != '/og-blog-import.png' %}
  <li><a href="{{ g.url }}"><span>{{ g.title }}</span><svg><use href="#i-arrow"/></svg></a></li>
{% endif %}{% endfor %}
</ul>
