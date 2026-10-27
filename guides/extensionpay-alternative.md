---
layout: default
title: "ExtensionPay or license keys: two ways to charge for a Chrome extension"
description: "How ExtensionPay works, what it costs, and when license keys from a merchant of record fit better. Written by the makers of Keyturn Kit, so read with that in mind."
permalink: /guides/extensionpay-alternative/
---

# ExtensionPay or license keys: two ways to charge for a Chrome extension

Since the Chrome Web Store stopped handling payments, most paid extensions use one of two setups: a hosted service such as ExtensionPay, or license keys sold by a payment provider and checked by the extension. We make Keyturn Kit, which does the second, so we have a stake in this. The ExtensionPay details below come from its own homepage on 26 October 2026.

## How ExtensionPay works

You add its open-source library, ExtPay.js, to your extension. The library talks to ExtensionPay's servers, which keep track of who has paid, and payments go through your own Stripe account.

- **Cost:** 5% of each charge, no monthly fee, on top of what Stripe charges. Lower rates are offered for high volume.
- **Plans:** one-time, monthly, quarterly and yearly, with free trials.
- **Users:** anonymous until they pay. After a reinstall or on another browser, they get a login link by email, if you allow it.
- **Browsers:** Chrome, Firefox, Edge, Opera, Brave and other Chromium browsers.
- **Taxes:** you are responsible for them. Stripe Tax can calculate sales tax at checkout, but paying and filing it stays with you.

It's a well-made service. If you want subscriptions working this afternoon and you're happy with Stripe, it's the easy choice.

## How license keys work

A merchant of record (Lemon Squeezy, Polar or Dodo Payments) sells the extension on its own checkout page and emails the buyer a license key. The buyer pastes the key into your extension, and the extension checks it against the provider's public license API. No server of yours is involved, and nobody needs an account.

The difference that matters most is tax. A merchant of record is the seller in law: it charges the right sales tax or VAT for the buyer's country and pays it. With Stripe alone, that's your job. If you sell to buyers in many countries, that often decides it.

What you give up: the provider takes its own fee, which varies by provider (check their pricing pages), and checks happen from the extension, so a determined user can patch them out, as with any client-side check.

## Side by side

| | ExtensionPay | License keys from a merchant of record |
|---|---|---|
| Who keeps track of paid users | ExtensionPay's servers | The provider's license API |
| Your server needed | No | No |
| Sales tax and VAT | You pay and file (Stripe Tax can calculate) | The provider charges and pays it |
| Fee on top of card processing | 5% | The provider's own fee |
| Buyer moves to a new browser | Login link by email | Pastes the key again (within your activation limit) |
| Subscriptions | Yes | Yes, depending on the provider |

## Doing it with Keyturn Kit

[Keyturn Kit](/) is a WXT + React starter that does the license-key side. The free edition (MIT, on GitHub) checks Lemon Squeezy keys, re-checks them daily, and keeps working offline for 7 days after the last good check. Pro ($59 once) adds Polar, Dodo Payments and Gumroad, a free trial counted from install, and a number of free uses per day before the paywall. The step-by-step guide is [Selling a Chrome extension with license keys, no backend](/guides/license-keys-chrome-extension/).
