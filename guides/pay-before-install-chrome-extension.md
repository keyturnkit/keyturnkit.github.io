---
layout: default
date_published: 2026-10-28
title: "Let buyers pay before they install your Chrome extension"
description: "Sell from your own landing page first, then have the buyer install and paste a license key. The checkout, receipt and first-run steps, with code. Written by the makers of Keyturn Kit."
permalink: /guides/pay-before-install-chrome-extension/
og_image: /guides/img/license-keys-chrome-extension-cover.png
---

# Let buyers pay before they install your Chrome extension

A common wish: put a Buy button on your landing page, take the money there, and only then send people to the Chrome Web Store. Setups that track paying users from inside the extension usually start with the extension already installed. With license keys the order can be the other way round, because the key is the proof of purchase and it can arrive before the extension does. We make Keyturn Kit, which works this way, so read with that in mind.

The code on this page comes from [Keyturn Kit](https://github.com/keyturnkit/keyturn-kit), a WXT + React starter: the free edition is MIT on GitHub, and [Pro](/#pricing) ($59 once) adds Polar, Dodo Payments, Gumroad, Payhip and trials.

## The flow

1. The Buy button on your page links to your checkout (Lemon Squeezy here; Polar, Dodo Payments, Gumroad and Payhip work the same way).
2. After paying, the buyer sees the checkout's confirmation screen and gets a receipt email with the license key.
3. Both point to your Chrome Web Store listing.
4. They install. The extension opens a page that asks for the key.
5. They paste it, the extension activates it with the provider's license API, and the paid features turn on.

No accounts, and no server of yours.

## Point the receipt at the store

In Lemon Squeezy, each product has a **Confirmation modal** section (title, message, button text, button link) and receipt email settings (thank you note, button text, button link). Set both button links to your Chrome Web Store listing and say what happens next in the message, for example "Install the extension, then paste the key from this email." Lemon Squeezy's help pages "Customizing the confirmation modal" and "Customizing receipt emails" cover the fields.

## Ask for the key on first install

Without this step, a buyer installs, sees a locked popup and has to work out where the key goes. Open your options page once, right after install:

```ts
// entrypoints/background.ts (WXT)
export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') void browser.runtime.openOptionsPage();
  });
});
```

On that page, a single field and an Activate button:

```ts
const r = await license.activate(key, 'Chrome');
if (!r.ok) showError(r.error); // "License is disabled", "Could not reach the license server", ...
```

Say on the page that people who haven't bought yet can use the free part and buy later, so the same page works for both.

## Things to decide

- **Activation limit.** Set it in the provider (for example 3), so one key covers a buyer's own browsers without being shared widely.
- **Refunds.** Disable the key when you refund. The extension notices on its next daily check.
- **Firefox and Edge.** The key flow is the same; only the store link in the receipt changes, so a page that links to each store works better than one store link.

## With Keyturn Kit

[Keyturn Kit](/) is a WXT + React starter with this license side already written. The free edition ([MIT, on GitHub](https://github.com/keyturnkit/keyturn-kit)) has the options page, `license.activate`, the daily re-check and 7 days of offline grace for Lemon Squeezy keys. The first-install snippet above is in both editions from 28 October 2026. Pro ($59 once) adds Polar, Dodo Payments, Gumroad and Payhip, and a free trial counted from install. The full walkthrough is [Selling a Chrome extension with license keys, no backend](/guides/license-keys-chrome-extension/).
