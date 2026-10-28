---
layout: default
date_published: 2026-10-27
title: "Adding a free trial to a paid Chrome extension"
description: "A trial counted from install, a few free uses a day after it ends, and the ways people get around both, with the code we ship in Keyturn Kit Pro."
permalink: /guides/chrome-extension-free-trial/
og_image: /guides/img/chrome-extension-free-trial-cover.png
---

# Adding a free trial to a paid Chrome extension

A trial lets people see what they'd be paying for. For an extension without accounts or a server, it comes down to two numbers kept in extension storage: when the extension was installed, and how many times a feature was used today. Here's how we do it in Keyturn Kit Pro, and where it can be got around.

The code on this page comes from [Keyturn Kit](https://github.com/keyturnkit/keyturn-kit), a WXT + React starter: the free edition is MIT on GitHub, and [Pro](/#pricing) ($59 once) adds Polar, Dodo Payments, Gumroad, Payhip and trials.

![Keyturn Kit Pro popup showing an export button and 5 trial days left, next to the trial lines of its config file](/guides/img/chrome-extension-free-trial-cover.png)

## Start the clock at install

`runtime.onInstalled` fires when the extension is installed (and on updates), so it's the place to record the first run. Only write the time if it isn't there yet, or every update would restart the trial:

```ts
browser.runtime.onInstalled.addListener(() => void access.start());
```

`start()` loads the stored state and, if there's none, saves `{ firstRunAt: Date.now(), day: today, used: {} }`. Calling it again later changes nothing.

## Decide per feature, not per extension

Instead of one "trial over" switch, ask per feature: may this user run `export` right now? The answer has four cases:

```ts
const r = await access.check('export');
if (!r.allowed) return showUpgrade(r.reason); // 'limit' or 'pro-only'
await doExport();
await access.use('export');
```

- a licensed user: always allowed;
- inside the trial window, counted from `firstRunAt`: always allowed;
- after the trial, a feature with a daily allowance: allowed until today's count reaches it;
- after the trial, a feature without one: Pro only.

Call `use()` after the feature actually ran, so a failed export doesn't eat one of the free uses. The daily count resets at the user's local midnight: store the day as `YYYY-MM-DD` in local time and clear the counts when it changes.

The free uses matter more than they look. A trial that ends with everything locked loses the people who were about to need the extension again next week; three free exports a day keeps them using it, and the paywall shows up at the moment they want more.

## Where it can be got around

**Reinstalling.** Chrome clears `storage.local` when an extension is removed, so a reinstall starts a fresh trial. We accept that: it costs the user their settings and any key they activated each time, and most people don't bother.

**Editing storage.** Anyone with DevTools can change the stored install time or the counters. Like any check that runs on the user's machine, the trial only stops casual use. If a feature is valuable enough that people will patch your extension for it, it belongs on a server.

**Changing the clock.** Moving the system clock back extends the trial. Same answer: possible, rare, not worth a server for an extension that sells for a few dollars.

## Doing it with Keyturn Kit

[Keyturn Kit](/) Pro ($59 once) includes this as `lib/pro/access.ts`, with two settings in `lib/config.ts`:

```ts
trialDays: 7,
freeUsesPerDay: { export: 3 },
```

Pro also adds Polar, Dodo Payments, Gumroad and Payhip next to Lemon Squeezy. The free edition (MIT, on GitHub) has the license key side without the trial; its step-by-step guide is [Selling a Chrome extension with license keys, no backend](/guides/license-keys-chrome-extension/).
