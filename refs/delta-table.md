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
