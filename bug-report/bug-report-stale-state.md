---
id: "bug: bug-report-stale-state"
aliases: []
tags:
  - #bug
---
2026-04-09 Init 17:48
## symptom
After performing any shelf action (rename or delete) once, subsequent attempts
to rename or delete a shelf do nothing — the modal either closes instantly or
the UI does not reflect the change — until the page is manually reloaded.

## reproduce
1. Open the "Manage Shelves" dropdown
2. Click rename on any shelf → rename it successfully
3. Without reloading, open the dropdown again and try to rename (or delete) any shelf
4. Observe: the rename modal either flashes open and immediately closes, or the
   delete appears to do nothing visually

## suspected cause
Two compounding root causes:

**1. Stale `useActionState` in mounted modals**
`HandleRenameModal` and `ShelvesEditModal` were always mounted in the DOM (rendered
unconditionally). After a successful action, their `useActionState` held
`{ error: null }`. The `useEffect` watching that state would fire immediately on
the *next* open — seeing the old success state — and call `onOpenChange(false)`,
snapping the modal shut before the user could interact with it.

**2. `revalidatePath("/")` scope too narrow**
All shelf server actions called `revalidatePath("/")`, which only revalidates the
root page segment. Actions performed from `/archive` (or any sub-route) would not
trigger a re-fetch of the `shelves` prop, leaving the dropdown showing a stale
list until a hard reload.

## tried
- [ ] Investigated `useActionState` persistence across re-opens
- [ ] Checked `revalidatePath` scope against the route structure

## fix
Three changes applied:

**`src/components/AddShelfDropdown.tsx`**
- Switched both modals from unconditional rendering to conditional (`{condition && <Modal />}`).
  This unmounts the modal on close, fully resetting its internal `useActionState` so
  the stale `{ error: null }` is gone by the next open.
- Added a unique `key` prop (`rename-shelf-${shelf.id}`) on `HandleRenameModal` so
  switching between shelves also forces a clean remount.
- Added `setOpen(false)` at the top of `handleDelete` so the dropdown closes
  immediately when a shelf is removed.

**`src/lib/actions/shelf-action.ts`**
- Changed all `revalidatePath("/")` calls to `revalidatePath("/", "layout")`.
  The `"layout"` scope revalidates the entire layout tree, ensuring the shelves
  list re-fetches on every route — not just the root.

**`src/components/RenameShelfModal.tsx` & `ShelvesEditModal.tsx`**
- Wrapped bare `// comment` text nodes in `{"// ..."}` to fix JSX lint errors
  (bare `//` in JSX is parsed as invalid syntax, not a comment).

## links
[[virtaul-shelf]]
