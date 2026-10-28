---
layout: default
title: "What it costs to add payments to a Chrome extension"
description: "The ways to charge for a Chrome extension since the Chrome Web Store stopped handling payments, with what each costs: a free starter, a paid starter, a hosted service, or having it done for you. Written by the makers of Keyturn Kit."
permalink: /guides/cost-to-add-payments-chrome-extension/
og_image: /guides/img/license-keys-chrome-extension-cover.png
---

# What it costs to add payments to a Chrome extension

Google stopped handling payments for Chrome Web Store items, so a paid extension needs its own way to take money and decide who gets the paid features. Here are the usual routes and what each costs. We make Keyturn Kit and run the set-up service below, so weigh that. Prices are from each page in late October 2026.

Whatever you pick, the payment provider takes its own cut on each sale (a merchant of record such as Lemon Squeezy, Polar, Gumroad or Dodo Payments also handles sales tax for you; check each one's pricing page).

| Route | Upfront | Per sale on top of the provider | Your time |
|---|---|---|---|
| License keys with the free [Keyturn Kit](https://github.com/keyturnkit/keyturn-kit) (MIT, Lemon Squeezy) | $0 | Nothing | Copy it in, set your store id; an afternoon if your extension is on WXT |
| [Keyturn Kit Pro](/#pricing) (Polar, Dodo, Gumroad, Payhip, trials, free uses per day) | $59 once | Nothing | Same, with more providers and a trial |
| A hosted service such as ExtensionPay | $0 | 5% of each charge, plus Stripe's fee; sales tax is yours to handle | An hour or two; it keeps track of paying users on its servers |
| [We add it to your extension](/license-setup/) | $149 once | Nothing | Review and merge a pull request |
| A freelancer | Quotes vary | Depends on the build | Briefing and review |

## How to choose

**You like owning the code and want no ongoing fee:** license keys. The free kit if Lemon Squeezy suits you, Pro if you sell through Polar, Gumroad, Dodo or Payhip or want a trial.

**You want subscriptions working this afternoon and Stripe is fine:** a hosted service. Our [ExtensionPay or license keys](/guides/extensionpay-alternative/) page goes through the trade-off honestly; the 5% fee is the main cost as sales grow.

**You'd rather not touch it:** have it set up for you. With our service you get the license-key route in your own repository, delivered as a pull request within 3 working days, refunded if it can't be done.

A note on all client-side checks, ours included: a determined user can patch them out. Keys stop casual sharing and refunded buyers. If a paid feature costs you money to run, check access on your server too ([signing users in](/guides/sign-in-chrome-extension/) covers that).
