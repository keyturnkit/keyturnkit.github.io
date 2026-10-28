---
layout: default
title: "Chrome extension payment fee calculator"
description: "Enter your price and sales per month and see what you keep with Lemon Squeezy, Polar, Gumroad, Dodo Payments, Payhip or ExtensionPay. Fees from each provider's pricing page, 28 October 2026."
permalink: /tools/chrome-extension-fee-calculator/
og_image: /guides/img/license-keys-chrome-extension-cover.png
extra_css: /assets/fees.css?v=1
---

# Chrome extension payment fee calculator

Enter what you charge and how many sales you expect in a month. The table shows what each provider takes and what reaches you, before payout and currency fees. Every rate comes from the provider's own pricing page, read on 28 October 2026, linked below the table.

<form class="fee-form" id="fee-form" onsubmit="return false">
  <label>Price per sale, USD <input type="number" id="price" min="1" step="0.01" value="9" inputmode="decimal"></label>
  <label>Sales per month <input type="number" id="sales" min="1" step="1" value="50" inputmode="numeric"></label>
  <label>Share of buyers outside the US, % <input type="number" id="intl" min="0" max="100" step="1" value="60" inputmode="numeric"></label>
  <label class="fee-check"><input type="checkbox" id="subs"> It's a subscription</label>
</form>

<div id="fee-result" role="region" aria-label="Result" aria-live="polite"></div>

<noscript><p>This page needs JavaScript to do the sums. The rates are listed below.</p></noscript>

## Rates used

| Provider | Fee per sale | Outside the US | Who handles sales tax |
|---|---|---|---|
| [Lemon Squeezy](https://www.lemonsqueezy.com/pricing) | 5% + 50¢ | "small additional fees" (not given, so not counted) | Lemon Squeezy, as merchant of record |
| [Polar](https://polar.sh/resources/pricing), Starter plan | 5% + 50¢ | +1.5% | Polar, as merchant of record |
| [Gumroad](https://gumroad.com/pricing), direct sales | 10% + 50¢ (30% on sales from Gumroad Discover) | not listed | see Gumroad's terms |
| [Dodo Payments](https://dodopayments.com/pricing) | 4% + 40¢ | +1.5% | Dodo, as merchant of record |
| [Payhip](https://payhip.com/pricing), free plan | 5%, plus the Stripe or PayPal fee | Stripe's +1.5% | see Payhip's terms |
| [ExtensionPay](https://extensionpay.com/) | 5%, plus the Stripe fee | Stripe's +1.5% | you ("You are responsible for paying taxes") |

Stripe's fee is the [standard US card rate](https://stripe.com/pricing), 2.9% + 30¢, with +1.5% for international cards. Subscriptions add +0.5% on Dodo Payments; the other pages list no extra for subscriptions on these plans. Polar's paid plans charge less per sale; the table uses Starter. Payhip's paid plans swap the 5% for a monthly price ($29 for 2%, $99 for none). Payouts cost extra on some providers (Polar passes on Stripe's payout fees; Dodo's page lists both "Free" and a $5 fee under $1,000), so the real amount you receive is a little lower.

## The other cost, code

Whichever you pick, the extension still has to check who paid. ExtensionPay does that on its servers. With the others you check the license key from the extension: [Keyturn Kit](/) does it with no server of yours, free (MIT) for Lemon Squeezy and $59 once for Pro, which adds Polar, Dodo Payments, Gumroad and Payhip. We make Keyturn Kit, so weigh that, and see [what it costs to add payments](/guides/cost-to-add-payments-chrome-extension/) for the longer comparison.

<script>
(function () {
  // [name, percent, fixed, intlExtraPercent, subsExtraPercent, addsStripe]
  var P = [
    ['Lemon Squeezy', 5, 0.50, 0, 0, false],
    ['Polar (Starter)', 5, 0.50, 1.5, 0, false],
    ['Gumroad (direct)', 10, 0.50, 0, 0, false],
    ['Dodo Payments', 4, 0.40, 1.5, 0.5, false],
    ['Payhip (free plan) + Stripe', 5, 0, 0, 0, true],
    ['ExtensionPay + Stripe', 5, 0, 0, 0, true]
  ];
  var STRIPE = [2.9, 0.30, 1.5];
  var $ = function (id) { return document.getElementById(id); };
  var usd = function (n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  function render() {
    var price = parseFloat($('price').value), sales = parseInt($('sales').value, 10);
    var intl = Math.min(100, Math.max(0, parseFloat($('intl').value) || 0)) / 100, subs = $('subs').checked;
    var out = $('fee-result');
    if (!(price > 0) || !(sales > 0)) { out.innerHTML = '<p>Enter a price and a number of sales above zero.</p>'; return; }
    var gross = price * sales;
    var rows = P.map(function (p) {
      var pct = p[1] + p[3] * intl + (subs ? p[4] : 0), fixed = p[2];
      if (p[5]) { pct += STRIPE[0] + STRIPE[2] * intl; fixed += STRIPE[1]; }
      var fee = (price * pct / 100 + fixed) * sales;
      return { name: p[0], fee: fee, keep: gross - fee };
    }).sort(function (a, b) { return b.keep - a.keep; });
    var html = '<p>' + sales + ' sales at ' + usd(price) + ' is ' + usd(gross) + ' a month before fees.</p>' +
      '<table><thead><tr><th>Provider</th><th>Fees a month</th><th>You keep</th><th>Share kept</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td>' + r.name + '</td><td>' + usd(r.fee) + '</td><td>' + usd(r.keep) + '</td><td>' + (100 * r.keep / gross).toFixed(1) + '%</td></tr>';
    });
    html += '</tbody></table><p class="fee-note">Lemon Squeezy, Polar and Dodo Payments collect and pay sales tax as merchant of record. With ExtensionPay the tax is yours. Lemon Squeezy does not publish its extra for cards outside the US, so its row has none and is a little too high.</p>';
    out.innerHTML = html;
  }
  ['price', 'sales', 'intl', 'subs'].forEach(function (id) { $(id).addEventListener('input', render); });
  render();
})();
</script>
