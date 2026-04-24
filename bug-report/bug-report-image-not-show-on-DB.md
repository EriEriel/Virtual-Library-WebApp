---
id: bug-report-image-not-saved-to-db
aliases: []
tags: []
---
# bug: image not saved to DB after upload
2026-04-02

## symptom
Image uploaded to Cloudinary successfully and `coverUrl` displayed on card, but no record created in the `Image` table in the database.

## reproduce
1. Open AddEntryModal
2. Upload a cover image via CoverUpload
3. Fill in remaining fields and submit
4. Check `Image` table in DB — no record exists

## suspected cause
Hidden inputs (`coverUrl`, `publicId`) not passing through form submission correctly due to React state timing with Server Action form.

## tried
- [x] Moved hidden inputs inside `<form>` tag
- [x] Added `console.log` in `addEntry` to verify values arriving — confirmed both `coverUrl` and `publicId` were reaching the action correctly
- [x] Checked Prisma `image.create` call

## fix
Wrong variable used in the condition before `prisma.image.create`. Was checking `url` (the entry's website link) instead of `coverUrl` (the uploaded image URL):
```ts
// before — wrong variable, condition never true when only cover uploaded
if (url && publicId) {

// after — correct
if (coverUrl && publicId) {
  await prisma.image.create({
    data: {
      url: coverUrl,
      publicId,
      entryId: entry.id,
      userId,
    }
  })
}
```

## links
[[cloudinary]]
[[prisma]]
