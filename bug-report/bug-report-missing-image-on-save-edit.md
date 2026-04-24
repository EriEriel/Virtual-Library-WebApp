---
id: bug-report-missing-image-on-save-edit
aliases: []
tags:
  - #bug
---

# bug: bug-report-missing-image-on-save-edit
2026-04-04

## symptom
On `editEntry` if we save without edit anything the cover will missing

## reproduce
1. Open `editEntryModal` 
2. hit save without changing anything

## suspected cause
missing fallback if image is not empty, and on initial load that cover is empty or undefined

## tried
- [x] Add fallback to to the edit entry

## fix
1. in any page that quarry Entries (`curated/page.tsx, archive/page.tsx etc.`) need to add image relation field:
```tsx
  include: { tags: true, image: true }
```

2. Update type to include image relation:
```tsx
  export type EntryWithTags = Entry & { tags: Tag[]; image: Image | null };
```

3. In `editEntryModal` add the initial state with current `coverUrl` and `publicId`:
```tsx
  const [coverUrl, setCoverUrl] = useState(entry.coverUrl ?? "");
  const [coverPublicId, setCoverPublicId] = useState(entry.image?.publicId ?? "");
```

4. Also do the same as step 3 at hidden input value:
```tsx
  
  <input type="hidden" name="existingCoverUrl" value={entry.coverUrl ?? ""} />
  <input type="hidden" name="existingPublicId" value={entry.image?.publicId ?? ""} />
```

5. Set the current URL in `<CoverUrl />`:
```tsx
  
  currentUrl={entry.coverUrl ?? undefined}
```

## links
[[virtaul-shelf]]

