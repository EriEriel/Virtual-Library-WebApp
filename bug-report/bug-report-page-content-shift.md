---
id: "bug: bug-report-page-content-shift"
aliases: []
tags:
  - #bug
---
2026-04-06 Init 14:47
## symptom
Page content shifts horizontally (left or right) whenever a dropdown menu or modal is opened.

## reproduce
1. Open the app with enough content to have a scrollbar
2. Click any dropdown (`AddShelfDropdown`) or open any modal (`AddEntryModal`, `EditEntryModal`, `DeleteAlertModal`, `LoginModal`)
3. Observe the page content shift to the left

## suspected cause
Radix UI's default scroll-lock behavior — when an overlay opens, Radix hides the scrollbar on `<body>` and injects `padding-right` to compensate for the scrollbar width. This compensation conflicts with the fixed-margin layout (`ml-64 mr-64`), causing asymmetric horizontal shift. CSS overrides (`scrollbar-gutter: stable`, `[data-scroll-locked]` targeting) could not reliably override Radix's inline style injection.

## tried
- [x] `overflow-y: scroll` on `html` — fixed right shift but caused left shift instead
- [x] `scrollbar-gutter: stable` on `html` — did not stop Radix padding injection
- [x] `body[data-scroll-locked]` CSS override with `padding-right: 0 !important` — did not work, Radix injects inline styles which override stylesheet rules
- [x] Zeroing `--removed-body-scroll-bar-size` CSS variable — no effect

## fix
* Set `modal={false}` on all Radix overlay components to disable scroll-lock behavior entirely. No CSS workaround needed.
* Adding `modal?: boolean` prop to `Dialog`, `Select`, `DropdownMenu`, and `AlertDialog` components to ensure type safe and consistent throughout the project. 

Files changed:
- `src/app/globals.css` — removed conflicting scroll-lock overrides
- `src/components/AddShelvesDropdown.tsx` — `modal={false}` on `DropdownMenu`
- `src/components/AddEntryModal.tsx` — `modal={false}` on `Dialog` and both `Select`
- `src/components/EditEntryModal.tsx` — `modal={false}` on `Dialog` and both `Select`
- `src/components/DeleteAlertModal.tsx` — `modal={false}` on `AlertDialog`
- `src/components/LoginModal.tsx` — `modal={false}` on `Dialog`

## links
- [Radix UI scroll lock discussion](https://github.com/radix-ui/primitives/issues/1515)
- [[virtaul-shelf]]
