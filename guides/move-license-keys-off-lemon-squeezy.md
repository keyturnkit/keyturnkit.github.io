---
layout: default
date_published: 2026-10-27
title: "Moving Chrome extension license keys off Lemon Squeezy"
description: "Lemon Squeezy is steering sellers toward Stripe Managed Payments, which has no license keys. Four providers whose license API an extension can call directly, compared. Checked on 27 October 2026."
permalink: /guides/move-license-keys-off-lemon-squeezy/
og_image: /og.png
---

# Moving Chrome extension license keys off Lemon Squeezy

Lemon Squeezy still sells and still answers its license API. Its site now carries a "2026 Update: Lemon Squeezy + Stripe Managed Payments" banner, and write-ups of that update say the goal is to make moving to Stripe Managed Payments easy. Stripe has no license keys of its own, so an extension that unlocks Pro with a Lemon Squeezy key has no direct equivalent to move to. Nothing forces a move today; this page is for planning one. Read on 27 October 2026.

## What the extension needs from a provider

A paid extension without a server needs three things from a license API:

1. Calls the extension can make with nothing secret in its code.
2. A way to limit how many browsers use one key.
3. A key that stops working after a refund.

## Four providers, side by side

Each row comes from our guide for that provider, checked against its docs on 27 October 2026.

| Provider | Secret in the extension | Browser limit | After a refund |
|---|---|---|---|
| [Polar](/guides/polar-license-keys-chrome-extension/) | None, customer-portal endpoints need no token | Activations, if turned on in the license key benefit | Revoke or disable the key; the next check fails |
| [Dodo Payments](/guides/dodo-license-keys-chrome-extension/) | None, license endpoints are public | Activations per key | Disable the key; validate then returns `valid: false` |
| [Gumroad](/guides/gumroad-license-keys-chrome-extension/) | None, verify needs no token | No activations, only a `uses` counter you check yourself | The key stays enabled; check the `refunded` and `chargebacked` fields yourself |
| [Payhip](/guides/payhip-license-keys-chrome-extension/) | A per-product secret Payhip says is meant for public apps | A `uses` count you raise and lower with that secret (a soft limit) | Payhip disables the key by itself |

Two catches worth knowing before you pick. On Dodo, a key bought from any other Dodo seller activates too, so compare `business_id` with yours. On Gumroad, a refunded purchase still verifies, so the extension has to look at the purchase fields.

## Moving existing customers

Keys from one provider don't work at another, so plan for the people who already paid:

- Send new buyers to the new store, and keep checking old keys with Lemon Squeezy: when the new provider doesn't recognise a pasted key, try it against Lemon Squeezy before saying no. Both checks can live side by side while Lemon Squeezy's license API answers.
- Or give existing buyers a key from the new provider, if your new provider lets you issue one without a new purchase. Check that before you announce the move.

## In Keyturn Kit

[Keyturn Kit](/) is a WXT + React starter for paid extensions. The free edition (MIT, on GitHub) uses Lemon Squeezy. Pro ($59 once) adds Polar, Dodo Payments, Gumroad and Payhip, and switching is one line in `lib/config.ts`:

```ts
provider: 'polar', // or 'dodo', 'gumroad', 'payhip', 'lemonsqueezy'
```

The free edition's walkthrough is [Selling a Chrome extension with license keys, no backend](/guides/license-keys-chrome-extension/).
