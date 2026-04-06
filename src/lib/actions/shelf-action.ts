"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// ─── Read ───────────────────────────────────────────────────────────────────

export async function getShelves() {
  const session = await auth();

  try {
    if (!session?.user?.id) redirect("/login");

    return prisma.shelf.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
      include: { _count: { select: { entries: true } } },
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[getShelves]", err);
    throw err;
  }
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createShelf(formData: FormData) {
  const session = await auth();

  try {
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;
    const name = (formData.get("name") as string).trim();

    if (!name) return { error: "Shelf name cannot be empty." };

    // New shelf goes to the end of the list
    const maxOrder = await prisma.shelf.aggregate({
      where: { userId },
      _max: { order: true },
    });

    await prisma.shelf.create({
      data: {
        name,
        order: (maxOrder._max.order ?? -1) + 1,
        userId,
      },
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[createShelf]", err);
    throw err;
  }

  revalidatePath("/");
}

// ─── Rename ─────────────────────────────────────────────────────────────────

export async function renameShelf(formData: FormData) {
  const session = await auth();

  try {
    if (!session?.user?.id) redirect("/login");

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string).trim();

    if (!name) return { error: "Shelf name cannot be empty." };

    // Ownership check — never trust the client's id alone
    const shelf = await prisma.shelf.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!shelf) return { error: "Shelf not found." };

    await prisma.shelf.update({ where: { id }, data: { name } });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[renameShelf]", err);
    throw err;
  } revalidatePath("/");
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteShelf(formData: FormData) {
  const session = await auth();

  try {
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;
    const id = formData.get("id") as string;

    const shelf = await prisma.shelf.findFirst({
      where: { id, userId },
    });

    if (!shelf) return { error: "Shelf not found." };
    if (shelf.isDefault) return { error: "Cannot delete the default shelf." };

    // Find the default shelf to move orphaned entries onto
    const defaultShelf = await prisma.shelf.findFirstOrThrow({
      where: { userId, isDefault: true },
    });

    // Move all entries off the deleted shelf before deleting it
    await prisma.entry.updateMany({
      where: { shelfId: id },
      data: { shelfId: defaultShelf.id },
    });

    await prisma.shelf.delete({ where: { id } });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[deleteShelf]", err);
    throw err;
  } revalidatePath("/");
}

// ─── Reorder ─────────────────────────────────────────────────────────────────

/**
 * Receives an ordered array of shelf IDs (the new desired order)
 * and updates all `order` values in a single transaction.
 *
 * Call this from the client after a drag-and-drop event settles.
 */
export async function reorderShelves(orderedIds: string[]) {
  const session = await auth();

  try {
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;

    // Verify all IDs belong to this user before writing
    const shelves = await prisma.shelf.findMany({
      where: { userId },
      select: { id: true },
    });
    const ownedIds = new Set(shelves.map((s) => s.id));
    if (orderedIds.some((id) => !ownedIds.has(id))) {
      return { error: "Invalid shelf IDs." };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.shelf.update({ where: { id }, data: { order: index } })
      )
    );
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[reorderShelves]", err);
    throw err;
  }

  revalidatePath("/");
}

// ─── Move entry to shelf ─────────────────────────────────────────────────────

export async function moveEntryToShelf(entryId: string, shelfId: string) {
  const session = await auth();

  try {
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;

    // Verify both the entry and shelf belong to this user
    const [entry, shelf] = await Promise.all([
      prisma.entry.findFirst({ where: { id: entryId, userId } }),
      prisma.shelf.findFirst({ where: { id: shelfId, userId } }),
    ]);

    if (!entry) return { error: "Entry not found." };
    if (!shelf) return { error: "Shelf not found." };

    await prisma.entry.update({
      where: { id: entryId },
      data: { shelfId },
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[moveEntryToShelf]", err);
    throw err;
  }

  revalidatePath("/");
}
