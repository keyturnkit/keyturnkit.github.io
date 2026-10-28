---
layout: default
date_published: 2026-10-27
title: "Payhip license keys in a Chrome extension"
description: "Check Payhip license keys from a Chrome extension with the product's secret key, count browsers with uses, and what that secret can and can't do. Checked against Payhip's help center on 27 October 2026."
permalink: /guides/payhip-license-keys-chrome-extension/
---

# Payhip license keys in a Chrome extension

Payhip can sell your extension and issue a license key with each order. Its current license API (v2) doesn't use your account API key. Each product has its own secret key, and Payhip's help center says that's meant for public apps, where an account key must never go. Below is how the endpoints behave and how we use them in Keyturn Kit. The details come from Payhip's help article on software license keys, read on 27 October 2026.

The code on this page comes from [Keyturn Kit](https://github.com/keyturnkit/keyturn-kit), a WXT + React starter: the free edition is MIT on GitHub, and [Pro](/#pricing) ($59 once) adds Polar, Dodo Payments, Gumroad, Payhip and trials.

## Turn license keys on

In Payhip, turn on license keys for the product. Its license settings show the product secret key. That's the value the extension sends; your account API key stays out of it.

Add `https://payhip.com/*` to `host_permissions` in your manifest.

## Checking a key

`GET https://payhip.com/api/v2/license/verify?license_key=...` with the secret in a `product-secret-key` header:

```ts
const res = await fetch(
  `https://payhip.com/api/v2/license/verify?license_key=${encodeURIComponent(key)}`,
  { headers: { 'product-secret-key': PRODUCT_SECRET } },
);
const text = await res.text();
const license = text ? JSON.parse(text).data : null; // empty response = no such key
```

A good key comes back as `data` with `enabled`, `license_key`, `buyer_email`, `uses` and `date`. An unknown key gives an empty response rather than an error, so treat "nothing came back" as "not a key".

## Counting browsers with uses

Payhip has no activations, but it keeps a `uses` number per key that you can raise and lower with the same secret.

- `PUT /api/v2/license/usage` adds one. Call it once when the key is pasted, after checking that `uses` is below the number of browsers you allow.
- `PUT /api/v2/license/decrease` takes one off. Call it when someone removes the key, so moving to a new laptop frees a slot.
- The daily re-check only calls verify, which doesn't change the count.

## Refunds

Payhip disables the key by itself when an order is refunded. The next verify returns `enabled: false`, and the extension locks Pro. There's nothing for you to do in the dashboard.

## What the secret can do

The secret ships inside the extension, and anyone can unzip an extension. With it, someone who already holds a key can call `decrease` on that key and reset their own count, so the browser limit is a soft one. They can't create keys or unlock keys they don't have. That's the trade Payhip made by letting public apps call these endpoints; if a hard limit matters, the check belongs on a server.

## Doing it with Keyturn Kit

[Keyturn Kit](/) is a WXT + React starter that does all of the above. The free edition (MIT, on GitHub) uses Lemon Squeezy. Payhip, Gumroad, Polar and Dodo Payments come with Pro ($59 once), where switching provider is one line in `lib/config.ts`:

```ts
provider: 'payhip',
payhip: { productSecretKey: 'YOUR-PAYHIP-PRODUCT-SECRET-KEY', maxUses: 3 },
```

Pro also adds a free trial counted from install and a number of free uses per day before the paywall. The step-by-step guide for the free edition is [Selling a Chrome extension with license keys, no backend](/guides/license-keys-chrome-extension/).
