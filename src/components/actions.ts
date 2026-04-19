"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Category, Status } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ─── Helper ────────────────────────────────────────────────────────────────

/**
 * Finds or creates the user's default shelf, and backfills any entries
 * that have no shelfId onto it. Safe to call repeatedly — fast after first run.
 */
async function ensureDefaultShelf(userId: string): Promise<string> {
  let defaultShelf = await prisma.shelf.findFirst({
    where: { userId, isDefault: true },
  });

  try {
    if (!defaultShelf) {
      // Get the current max order so the default shelf sorts last
      const maxOrder = await prisma.shelf.aggregate({
        where: { userId },
        _max: { order: true },
      });

      defaultShelf = await prisma.shelf.create({
        data: {
          name: "My Shelf",
          isDefault: true,
          order: (maxOrder._max.order ?? -1) + 1,
          userId,
        },
      });
    }

    // Backfill any entries not yet assigned to a shelf
    await prisma.entry.updateMany({
      where: { userId, shelfId: null },
      data: { shelfId: defaultShelf.id },
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[ensureDefaultShelf]", err);
    throw err;
  }

  return defaultShelf.id;
}

// ─── Entry Actions ──────────────────────────────────────────────────────────

export async function addEntry(formData: FormData) {

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const currentPath = formData.get("currentPath") as string || "/";
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
  const shelfId = formData.get("shelfId") as string;

  const tagNames = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];

  try {
    const resolvedShelfId = shelfId || (await ensureDefaultShelf(userId));

    const entry = await prisma.entry.create({
      data: {
        title,
        coverUrl: coverUrl || null,
        author: author || null,
        category: category || "OTHER",
        status: status || "READING",
        url: url || null,
        notes: notes || null,
        userId: session.user.id,
        shelfId: resolvedShelfId,
        tags: {
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name },
          }))
        },
      }
    });

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
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[addEntry]", err);
    throw err;
  }

  redirect(currentPath);
}

// PATCH method
export async function updateEntry(formData: FormData) {
  const session = await auth()

  const userId = session?.user?.id as string
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const coverUrl = formData.get("coverUrl") as string;
  const existingCoverUrl = formData.get("existingCoverUrl") as string;
  const publicId = formData.get("publicId") as string;
  const existingPublicId = formData.get("existingPublicId") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as Category;
  const status = formData.get("status") as Status;
  const url = formData.get("url") as string;
  const notes = formData.get("notes") as string;
  const tagsInput = formData.get("tags") as string;
  const shelfId = formData.get("shelfId") as string;
  const tagNames = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];
  const currentPath = formData.get("currentPath") as string || "/";

  try {
    if (coverUrl !== existingCoverUrl && existingPublicId) {
      await cloudinary.uploader.destroy(existingPublicId);
      if (!coverUrl) {
        await prisma.image.delete({ where: { entryId: id } });
      }
    }

    await prisma.entry.update({
      where: { id },
      data: {
        title,
        coverUrl: coverUrl || null,
        ...(author && { author }),
        ...(url && { url }),
        ...(category && { category }),
        ...(status && { status }),
        ...(notes && { notes }),
        ...(shelfId && { shelfId }),
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
  } catch (err) {
    if (isRedirectError(err)) throw err;   // redirect passthrough
    console.error("[EditEntry]", err);
    throw err;
  }
  redirect(currentPath);
}

// DELETE method 
export async function deleteEntry(formData: FormData) {
  const id = formData.get("id") as string;
  const currentPath = formData.get("currentPath") as string || "/";


  try {
    const image = await prisma.image.findUnique({
      where: { entryId: id }
    });

    // delete from Cloudinary if image exists
    if (image?.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await prisma.entry.delete({
      where: { id },
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[deleteEntry]", err);
    throw err;
  }

  redirect(currentPath);
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

  try {
    await prisma.image.create({
      data: {
        url,
        publicId,
        userId,
        entryId,
      }
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[imageUpload]", err);
    throw err;
  }
}
