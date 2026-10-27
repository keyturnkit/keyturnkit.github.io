---
layout: default
title: "Selling a Chrome extension with license keys, no backend"
description: "Lemon Squeezy license keys in a Chrome MV3 extension: store check, daily re-check, offline grace, deactivation. About 80 lines, no server."
permalink: /guides/license-keys-chrome-extension/
---

# Selling a Chrome extension with license keys, no backend

Google wound down Chrome Web Store payments between 2020 and early 2021. To charge for an extension now, you need a checkout and a way to know who paid, and you want to make sharing one key with everyone at least inconvenient.

This post walks through a small setup that covers that without running a server: Lemon Squeezy for the checkout, its License API for the "who paid" part, and about 80 lines of TypeScript in the extension.

We make Keyturn Kit, a starter built on this approach (more at the end). Everything below works on its own without it.

## Why license keys and not accounts

The usual SaaS answer is user accounts: the user logs in and your server knows their plan. That means a backend, a database and auth to look after. For an extension that sells for $5 to $30 it is a lot to run.

A license key turns this around. The payment provider generates the key and emails it to the buyer, the buyer pastes it into the extension once, and the extension asks the provider whether the key is valid and caches the answer. You don't keep a user table anywhere.

The trade-off is that anything checked on the client can be patched out by someone determined. An activation limit stops casual sharing, and you can disable a key yourself in the dashboard, for example after a refund. Neither stops a person who edits your minified JS. For many small extensions that's an acceptable line.

## Step 1: the product

In Lemon Squeezy, create a product and open its settings:

- turn on **Generate license keys**
- set an **activation limit**, for example 3. Each browser that activates the key uses one slot.
- for a one-time purchase, set the license length to unlimited

Note your store id from the store settings. You'll need it in a minute.

## Step 2: the manifest

The License API is called straight from the extension, so it needs host permission:

```json
{
  "permissions": ["storage", "alarms"],
  "host_permissions": ["https://api.lemonsqueezy.com/*"]
}
```

The [License API docs](https://docs.lemonsqueezy.com/api/license-api) examples send no API key: the license key itself is the credential. Never put your Lemon Squeezy API key in an extension.

## Step 3: activate

When the user pastes a key, first check that it belongs to your store, then activate it with a name for this install. Lemon Squeezy returns an instance id; keep it, because you need it to validate and deactivate later.

```ts
const API = 'https://api.lemonsqueezy.com/v1/licenses';
const STORE_ID = 12345; // yours

async function post(path: string, body: Record<string, string>) {
  const res = await fetch(`${API}/${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams(body),
  });
  // Rate limits and server errors are temporary. Don't treat them as "key rejected".
  if (res.status === 429 || res.status >= 500) throw new Error('temporary');
  return res.json();
}

async function activate(key: string) {
  key = key.trim();

  // Any Lemon Squeezy store's key is a real key. Check it's yours before using an activation slot.
  const check = await post('validate', { license_key: key });
  if (!check.valid) throw new Error(check.error ?? 'Key not accepted');
  if (check.meta?.store_id !== STORE_ID) throw new Error('This key is from a different store');

  const data = await post('activate', {
    license_key: key,
    instance_name: `Chrome ${crypto.randomUUID().slice(0, 8)}`,
  });
  if (!data.activated) throw new Error(data.error ?? 'Key not accepted');
  if (data.meta?.store_id !== STORE_ID) {
    await post('deactivate', { license_key: key, instance_id: data.instance.id });
    throw new Error('This key is from a different store');
  }

  const now = Date.now();
  await chrome.storage.local.set({
    license: { key, instanceId: data.instance.id, lastCheckedAt: now, lastOkAt: now, valid: true },
  });
}
```

The `store_id` check is easy to leave out. Without it, a key bought for any product in any Lemon Squeezy store turns on your Pro features, because the License API tells you the key is real, not that it is yours.

The random suffix on `instance_name` gives each install its own entry in your dashboard. Without it, a customer with three laptops shows up as three identical "Chrome" rows.

## Step 4: re-check once a day

Validate once a day rather than on every popup open, so a user on a plane doesn't lose what they paid for and you aren't calling the API on every click.

```ts
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const GRACE = 7 * DAY;

// Write only if the same license is still stored. The network call takes time, and the
// user may have removed or replaced their key meanwhile.
async function saveIfSame(l: any, changes: object) {
  const { license: current } = await chrome.storage.local.get('license');
  if (current?.instanceId !== l.instanceId) return;
  await chrome.storage.local.set({ license: { ...current, ...changes } });
}

async function isPro(): Promise<boolean> {
  const { license: l } = await chrome.storage.local.get('license');
  if (!l) return false;

  if (Date.now() - l.lastCheckedAt > DAY) {
    try {
      const data = await post('validate', { license_key: l.key, instance_id: l.instanceId });
      const valid = data.valid === true && data.meta?.store_id === STORE_ID;
      await saveIfSame(l, { valid, lastCheckedAt: Date.now(), lastOkAt: valid ? Date.now() : l.lastOkAt });
    } catch {
      // No answer: keep the last known state and try again in an hour.
      await saveIfSame(l, { lastCheckedAt: Date.now() - DAY + HOUR });
    }
  }

  const { license: now } = await chrome.storage.local.get('license');
  return !!now?.valid && Date.now() - now.lastOkAt < GRACE;
}
```

"The server said no" and "the server didn't answer" need different handling. A key you've disabled gets `valid: false` and locks at the next check, so within about a day. A network error or a rate limit keeps the previous answer, for up to a week since the last good check. If you treat the two the same, either users get locked out on bad Wi-Fi or disabled keys keep working.

`valid` is false for disabled and expired keys, so there's no need to inspect `license_key.status` as well.

`saveIfSame` matters more than it looks. Without it, a check that started before the user clicked "move my key" can finish afterwards and write the removed key back.

## Step 5: check without the popup

If you only check when the popup opens, a user who never opens it keeps Pro after you disable their key. An alarm in the service worker covers that:

```ts
// Create the alarm only if it's missing. Calling create() on every service worker start
// resets its timer, and alarms aren't guaranteed to survive a browser restart.
chrome.alarms.get('license').then((a) => {
  if (!a) chrome.alarms.create('license', { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === 'license') isPro();
});
```

`isPro()` only calls the API once a day, so an hourly alarm is cheap.

## Step 6: let people move their key

With an activation limit, someone who switches laptops will hit the cap eventually. Give them a button that frees the slot:

```ts
// Returns false if the slot could not be freed on the server, so the UI can say "try again online".
async function deactivate(): Promise<boolean> {
  const { license: l } = await chrome.storage.local.get('license');
  if (!l) return true;
  const freed = await post('deactivate', { license_key: l.key, instance_id: l.instanceId })
    .then((d) => d.deactivated === true)
    .catch(() => false);
  await chrome.storage.local.remove('license');
  return freed;
}
```

Remove the local copy even if the request fails, otherwise an offline user can't move their key at all. But tell them when the server slot wasn't freed, or they'll hit the activation limit later with no idea why.

## Testing it

Lemon Squeezy has a test mode with test cards. Buy your own product in test mode and paste the key. Disable the key in the dashboard, then force a re-check by setting `license.lastCheckedAt` to 0 in the extension's storage (DevTools, Application, Extension storage). Pro should switch off. Then go offline and check that Pro stays on.

If you plan to refund customers, try a refund in test mode as well and see what it does to the key. Don't assume a refund disables it.

Test mode and live mode are separate in Lemon Squeezy. When you go live, the product is copied to live mode with a new ID and a new checkout link. If your extension checks the product ID, update it before you publish, or every real customer's key fails the check.

## The longer version

Keyturn Kit's free edition (MIT) is this same approach with React components, a settings page and tests with a mocked `fetch`: https://github.com/keyturnkit/keyturn-kit

There's also a paid edition that adds Polar, Dodo Payments and Gumroad, a free trial and per-day free usage. You don't need it to follow this post. The code above covers the basic flow.
