---
id: testing
aliases: []
tags: []
---

2026-04-19

# Testing checklist for Terminal shelf project
  Before you ship, run through this checklist to catch common issues. This isn't exhaustive but covers the most critical flows.

## Auth flows — these are the highest risk

- [x] Sign in with GitHub/Google works end to end
- [x] Invalid credentials show correct error, don't crash
- [x] Session persists on refresh
- [x] Sign out clears session properly

## Entry CRUD — core feature

- [x] Add entry saves correctly to DB
- [x] Edit updates the right record (not someone else's)
- [x] Delete actually removes it
- [x] All new categories render correctly after the schema change

## Shelf operations

- [x] Create shelf, rename, delete
- [x] Entries correctly associate to shelf
- [x] "All entries" shows everything regardless of shelf

## Auth guards — critical for data integrity

- [x] Unauthenticated users can't hit server actions directly (bypass the UI)
- [x] User A can't edit/delete User B's entries (if have multiple users)

## new input validation

- [x] Username/password length limits reject correctly
- [x] Non-ASCII characters get blocked
- [x] Error messages actually show up in the UI, not just server-side

## The non-session screens

- [x] Curated and archive show the typewriter screen when logged out
- [x] No data leaks through before session check

# Link
[[virtaul-shelf]]
