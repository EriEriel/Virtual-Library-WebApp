---
id: image-upload-system
aliases: []
tags:
  - #project
  - #image-upload
---

# image-upload-system
2026-04-01

## goal
Implement image upload system so user and user they image for cover instead of just find a online URLs

## approach
**Tech use** Cloudinary - This one has genuine free tier with roughly 25GB upload per month
1. Add api route to directly upload image to cloud and return secureURL
2. Prisma method to upload and connect image to userId and EntryId
3. Also update `AddEntry` and `UpdateEntry` method


## pipeline of full system

1. User drops/picks file
       ↓
2. CoverUpload → fetch POST /api/upload (file in FormData)
       ↓
3. /api/upload/route.ts → `cloudinary.uploader.upload_stream()`
       ↓
4. Cloudinary stores image → `returns { secure_url, public_id }`
       ↓
5. route.ts → `NextResponse.json({ url, publicId })`
       ↓
6. CoverUpload → sets preview, calls onUpload(url, publicId)
       ↓
7. AddEntryModal → writes url+publicId into hidden input refs
       ↓
8. User submits form → addEntry(formData)
       ↓
9. addEntry → `prisma.entry.create()` → gets entry.id
       ↓
10. addEntry → `prisma.image.create({ url, publicId, entryId, userId })`

## code snippets
```ts
// POST method to upload image to cloud
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { NextRequest, NextResponse } from "next/server"

cloudinary.config({
  cloud_name: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  //  Cloudinary’s Node.js SDK was built for Node.js environments,
  //  and Node.js uses Buffer as its native way to handle binary data (like images), 
  //  whereas the modern Web API uses ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "terminal-shelf" },
      (error, result) => {
        if (error || !result) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return NextResponse.json({ url: (result as UploadApiResponse).secure_url })
}

// Prisma create method for image
export async function imageUpload(formData: FormData) {
  const userId = formData.get("userId") as string
  const entryId = formData.get("entryId") as string | undefined
  const url = formData.get("url") as string
  const publicId = formData.get("publicId") as string

  await prisma.image.create({
    data: {
      url,
      publicId,
      userId,
      entryId,
    }
  });
}

// Prisma AddEntry update version
export async function addEntry(formData: FormData) {

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session?.user?.id as string
  const title = formData.get("title") as string;
  const coverUrl = formData.get("coverUrl") as string;
  const publicId = formData.get("publicId") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as Category;
  const status = formData.get("status") as Status;
  const url = formData.get("url") as string;
  const notes = formData.get("notes") as string;
  const tagsInput = formData.get("tags") as string;

  const tagNames = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];

  const entry = await prisma.entry.create({
    data: {
      title,
      coverUrl: coverUrl || null,
      author: author || null,
      category: category || "OTHER",
      status: status || "READING",
      url: url || null,
      notes: notes || null,
      userId: session.user.id,  // ← from session, not form
      tags: {
        connectOrCreate: tagNames.map(name => ({
          where: { name },
          create: { name },
        }))
      },
    }
  });

  if (url && publicId) {
    await prisma.image.create({
      data: {
        url,
        publicId,
        entryId: entry.id,
        userId,
      }
    })
  }

  redirect("/");
}
// Prisma UpdateEntry update version
export async function updateEntry(formData: FormData) {
  const session = await auth()

  const userId = session?.user?.id as string
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const coverUrl = formData.get("coverUrl") as string;
  const publicId = formData.get("publicId") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as Category;
  const status = formData.get("status") as Status;
  const url = formData.get("url") as string;
  const notes = formData.get("notes") as string;
  const tagsInput = formData.get("tags") as string;
  const tagNames = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];

  const entry = await prisma.entry.update({
    where: { id },
    data: {
      title,
      coverUrl: coverUrl || null,
      ...(author && { author }),
      ...(url && { url }),
      ...(category && { category }),
      ...(status && { status }),
      ...(notes && { notes }),
      tags: {
        // Wiped connection with set: [] and than reconnect with existing tags 
        set: [],
        connectOrCreate: tagNames.map(name => ({
          where: { name },
          create: { name },
        }))
      }
    }
  });

  if (coverUrl && publicId) {
    await prisma.image.upsert({
      where: { entryId: id },
      update: { url: coverUrl, publicId },
      create: { url: coverUrl, publicId, entryId: id, userId },
    })
  }

  redirect("/");
}
```

## blockers

## links
[[react-nextjs]]
[[typescript]]
[[Cloudinary]]
