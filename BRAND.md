# The Daily Prompt — Brand Guide

Approved by Marc on 2026-10-23. Apply this to the site in Phase 1. Reference mockup: the "Selected" board on the brand canvas (https://claude.ai/artifact/Rk4jzeWr3e84DH7H32D5P3).

## Look in one line
A classic black-and-white newspaper front page: blackletter masthead, serif headlines, ruled columns, no color.

## Logo
- **Masthead:** `brand/logo-masthead.png` — "The Daily Prompt" in blackletter with a double rule underneath, black on white. Use it at the top of every page, centered, max width about 900px.
- Rebuild it as live text or SVG for crispness: UnifrakturMaguntia, black, with a 2-line rule under it (thick rule 3px, gap 4px, thin rule 1px). Keep the PNG as the fallback and for social images.
- **Small sizes** (nav bar on scroll, email header, favicon): a black circle with a white blackletter "P" (UnifrakturMaguntia).
- Never recolor, stretch, add effects or put the masthead on a busy background.

## Tagline
**Superintelligence, delivered daily** — directly under the masthead, Playfair Display, uppercase, letter-spacing about 0.28em, 14–16px.

## Fonts (all Google Fonts, free for commercial use)
| Role | Font | Notes |
|---|---|---|
| Masthead | UnifrakturMaguntia | Masthead and the favicon "P" only. Never for headlines or body. |
| Headlines, labels, nav | Playfair Display | 700 for headlines; uppercase with letter-spacing for section labels, nav and small caps lines. |
| Body | Libre Baskerville | 16–17px, line-height 1.6. Italic for decks and standfirsts. |

## Color
| Token | Hex | Use |
|---|---|---|
| Ink | #111111 | All text, rules, buttons |
| Paper | #FFFFFF | Page background (optional newsprint: #F7F5EF) |
| Muted rule | #BDBDBD | Thin column rules and dividers |
| Image placeholder | #D9D9D9 | Grey blocks until real images exist |
No accent colors. Links are ink with underline; hover #555555.

## Page anatomy (homepage)
1. Top line: "Vol. I · No. [edition] · [weekday, date] · dailyprompt.si" (edition number from The Daily Prompt).
2. Masthead, then tagline.
3. Section bar between a 1px rule and a 3px double rule: Writing, Coding, Research, Design, Video, Agents, All tools.
4. Search: "What do you want to do?" input with a black FIND button.
5. Lead story (left, wide): a "Best AI tools for …" comparison with label, headline, italic deck, image, two ruled text columns.
6. Right column: "New This Week" from The Daily Prompt's `new_tools`, then Sponsored Notice, then Subscribe.
7. Footer: © The Daily Prompt · "Rankings are never for sale. Sponsored notices are always labeled." · About · Get featured · Submit a tool.

## Components
- **Rules:** thick 3–4px for section tops, 3px double for headers, 1px for dividers.
- **Sponsored notice:** 2px black box, centered, "SPONSORED NOTICE" label in small spaced caps. Always labeled, never styled like an editorial pick.
- **Subscribe:** 2px dashed box like a clip-out coupon, email field plus black "Sign up" button.
- **Buttons:** black fill, white Playfair Display text, square corners, min height 44px.
- **Columns:** CSS columns with 1px rules; collapse to one column on phones.

## Voice
Plain English, short sentences, honest verdicts. No emojis, no hype words.

## Accessibility
Text contrast 4.5:1 or better, real buttons and labels, touch targets at least 44px, the masthead image has alt text "The Daily Prompt".
