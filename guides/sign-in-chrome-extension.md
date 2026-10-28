---
layout: default
date_published: 2026-10-28
title: "Signing users in to a Chrome extension"
description: "Sign-in from your own website with launchWebAuthFlow, where to keep the token, why the real check belongs on your server, and when a license key is all you need. Written by the makers of Keyturn Kit."
permalink: /guides/sign-in-chrome-extension/
og_image: /guides/img/license-keys-chrome-extension-cover.png
---

# Signing users in to a Chrome extension

If users create an account on your website, the extension needs a way to borrow that sign-in. In Manifest V3 the cleanest route is `chrome.identity.launchWebAuthFlow`, and the part people get wrong is not the flow but where the decision about "is this user allowed" is made. We make Keyturn Kit, which takes a different route for paid features, so read with that in mind. Chrome's API details below come from its identity API reference, read on 28 October 2026.

## The flow

1. Add `"identity"` to `permissions` in the manifest.
2. `chrome.identity.getRedirectURL()` gives you an address of the form `https://<extension-id>.chromiumapp.org/`. Register it as an allowed redirect on your sign-in server.
3. From the background script, call `launchWebAuthFlow` with your sign-in page's URL. Chrome opens a window; when your server redirects to the `chromiumapp.org` address, the window closes and the promise resolves with that full URL.
4. Read the short-lived code from the URL and exchange it for a token with your server.

```ts
// background.ts
const redirect = chrome.identity.getRedirectURL();
const state = crypto.randomUUID();
const url = `https://example.com/oauth/authorize?client_id=ext&redirect_uri=${encodeURIComponent(redirect)}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

const back = await chrome.identity.launchWebAuthFlow({ url, interactive: true });
const params = new URL(back!).searchParams;
if (params.get('state') !== state) throw new Error('state mismatch');
const token = await exchange(params.get('code')!, verifier); // POST to your server
await chrome.storage.session.set({ token });
```

Use PKCE (the `code_challenge` and its `verifier`) rather than a client secret: anything shipped in the extension can be read by anyone who installs it. With `interactive: false` the call fails unless the first page load completes the flow, which is how you silently renew a session that is still valid.

## Where the token lives

- `chrome.storage.session` keeps it in memory and clears it when the browser closes. Good for short-lived access tokens.
- `chrome.storage.local` keeps it across restarts. Use it for a refresh token only if you accept that someone with access to the profile can copy it.

## Decide on the server

Treat everything in the extension as visible and editable by the user. A flag like `isPro = true` in storage is a suggestion, not a check. Every request for something that costs you money, or that only paying users should get, should carry the token, and your server should decide.

## When you don't need accounts

If the only question is "has this person paid", accounts may be more than you need. Sellers such as Lemon Squeezy, Polar and Gumroad email the buyer a license key, and the extension can check it against the seller's public license API with no secret shipped. Check the key belongs to your store or product, re-check it now and then so refunded keys stop working, and allow a few days offline. That keeps the check on the client, so it stops casual sharing rather than a determined user; if the paid feature runs on your server anyway, the token route above is the stronger one.

[Keyturn Kit](/) is a WXT + React starter that does the license-key route; the free edition is [MIT on GitHub](https://github.com/keyturnkit/keyturn-kit), and [Selling a Chrome extension with license keys](/guides/license-keys-chrome-extension/) walks through it.
