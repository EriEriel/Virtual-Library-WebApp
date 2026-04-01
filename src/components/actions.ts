"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Category, Status } from "@/generated/prisma/enums";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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

// PATCH method
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

// DELETE method 
export async function deleteEntry(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.entry.delete({
    where: { id },
  });

  redirect("/");
}

// Curated Method
export async function toggleCurated(id: string, value: boolean) {
  await prisma.entry.update({
    where: { id },
    data: { isCurated: value }
  })
  revalidatePath("/archive")
}

// Image Upload Method to link Cloudinary URL to userId and EntryId
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
