---
id: "scratch: implement-font-end-multiple-shelves"
aliases: []
tags:
  - #scratch
---

2026-04-06 Init 15:04

## goal
Fornt-End for `AddShelfDropdown` function: Click on button show dropdown to option to manage shelf and show every shelves in order and let's user able to edit and delete shelves 

## approach
### Design:
[Add Entry]  [Shelves ▼]         ← top bar buttons

Click "Shelves ▼" opens a popover:
┌─────────────────────────┐
│ + Create new shelf      │  ← triggers the manage page / modal
│─────────────────────────│
│ ✓ My Shelf (12)         │  ← currently active, checkmark
│   Reading (5)           │
│   Completed (3)         │
└─────────────────────────┘

"Manage shelves" page has:
- drag to reorder
- rename
- delete

## code snippets

## blockers

## links

