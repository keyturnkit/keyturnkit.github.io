# Delta table, plasmo.com vs clone (1280 wide). Target = refs/plasmo-dump.json, clone = computed styles in refs/delta-r2.json

| section | target | clone r1 | clone r2 | gap |
|---|---|---|---|---|
| header pill | pad 8/32, radius 9999, bg rgba(243,240,255,.9), blur 4.7 | same | same | tint blue instead of violet |
| wordmark | 24/32, 800, italic | 24/32, 800, ls -0.24px | 24/32, 800, no italic | italic dropped (logo style) |
| hero wrapper | w 995, gap 32, my 64 | w 1216 | w 995 | none |
| h1 | 96/96 700 centered, 931 wide, 304 tall | 2 lines, 1152 wide, 192 tall | 3 lines, 931 wide, 288 tall | 16px (Plasmo span has py-2) |
| lede | 30/36, muted, 896 wide | 3 lines | 2 lines | text differs |
| CTA button | 24/32 500, pad 12/32, r8 | text wrapped on mobile | same, label shortened | label width |
| group heading | h2 96/96, w 540, hr 162 | same | same | none |
| feature h2 / eyebrow / button | 60/60, 16/24 caps, 224x52 bottom aligned | button 240x120 stretched | 224x52 | none |
| cards | r24, 2px #dcdbdd, pad 56, gap 16, h4 24/32, p 16/24 | same | same | none (colour neutral) |
| code mockup | tab 30 tall, gutter 48, 16px Source Code Pro | double spaced lines | fixed | no traffic-light dots |
| testimonial row | image 144 r24, q 24/32 justified | tile | tile, left aligned text | justify not copied |
| pricing card | 320 wide, pad 32, r6, 1px #eeedef, row 64, h4 36/40 | 610 tall | 550 tall | 2 plans not 3 |
| closing CTA | h3 60/60 800 | same | same | no gradient word |
| friends | dashed 2px r24 pad 56, label caps | same | same | no book image, 2 cards |
| footer | gradient, pad 80, gap 160 | logo centered | logo left | 3 links vs 5, blue |
| page height | 10538 | 9766 | 9590 | content length |
| y of first feature label | 1480 | 1404 | 1464 | -16 (h1 py-2) |

## Round 3 (changed sections)
| section | target | clone r2 | clone r3 | gap |
|---|---|---|---|---|
| eyebrow labels | 3 in group 1, none in Itero | 5 | 0 | removed by decision (TEAM.md), matches Itero opening |
| fact row | image 144 + text + name + button | number tile + text | no tile, text + 2-line caption + button, left aligned, column 896 | no image column |
| Pro mockup | browser mockup | free popup PNG | 2 stacked code cards, lib/config.ts lines verbatim from products/extkit | 13px font so comments wrap |
| Pro plan rows | 1 feature per row, 64px | 5 rows, trial and uses merged | 6 rows, split | card taller than 550 |
| page height 1280 | 10538 | 9590 | 9422 | content length |

## Round 4 (measured on clone-r4)
| item | target | clone r3 | clone r4 |
|---|---|---|---|
| Gate a feature, 2nd card right edge vs column edge (1280) | steps inward, inside column | +32 past 1088 | 1056, inside (steps left like Dedicated Runtime) |
| FAQ grid 1280 | n/a | right column 25px higher | 4 cards, rows aligned (5989 / 6377), equal heights per row, 32px gaps |
| FAQ order 390 | n/a | differed from desktop | same source order, 32px gaps |
| FAQ button | 224x52, one line | 2 lines | "Compare", 52px tall |
| closing CTA button bottom to Guides h2 box | 176 (1280 and 390) | 48 | 176 |
| hero partner names 390 | inside 32px gutter | start at x 13 | start at x 32 and 203, 2 columns |
| popup top vs first card top 1280 | +28 | +65 | +24 |
| popup bottom to first card 390 | ~33 | 24 | 32 |
| terminal 390 | no mid-word break | broke git URL | white-space pre, scrolls inside box (453 wide in 340) |

## Round 5 (1366 wide)
| item | target | clone r4 | clone r5 |
|---|---|---|---|
| scheme | light only | dark variant + grid lines | light only, no grid |
| neutrals | mauve #fdfcfd to #1a1523 | grey-blue set | Plasmo's real mauve values |
| accent | violet #6e56cf | blue #0a66c2 | green #0e7a5a (5.32:1 with white text) |
| tinted words | "AI-Powered", "Supercharge" | none | "for paid Chrome", "Charge" |
| browser mock | 30px bar, 12px dots, 24px address pill, r6 | popup in a plain card | same chrome numbers, live popup at top right, code window left |
| scroll reveal | opacity 0 + translate until in view (Plasmo) | same | removed, all blocks visible, no opacity or transform |
| page height 1366 | 10298 | n/a | 9154 (390: 15290 vs 11762) |
