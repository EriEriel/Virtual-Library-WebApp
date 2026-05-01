---
id: feature-implement-multiple-shelfs
aliases: []
tags:
  - #database
---

# feature-implement-multiple-shelfs
2026-04-04

## goal
Add shelf system so user can have multiple shelf to categorize they entries, If there is no shelf yet it create the default shelf as back-up

## approach
1. Add new Shelf table to database
2. Create fallback strategy if there is no shelf to put the entry in
3. Update all `action.ts` to handle this new feature
4. Create brand new `shlef-action.ts` to handle the back-end of CRUD logic of the feature
5. Add Font-end start by Adding a `Manange Shelves` button next to the right side of the `Add Entry` button
  5.1 The Font-end is divind on to 3 parts first one is is the Dropdown form the button that show `+Add new shelf` which is Dialog
  5.2 Show the actual list of the Shelves with the name, the entries numbers along side with edit and delete button

## code snippets
```prisma
// 1. New table for Shelf that has relation with user
model Shelf {
  id        String   @id @default(cuid())
  name      String
  order     Int      @default(0) // Use to order entries on the shelf
  isDefault Boolean  @default(false) // Use to set the default shelf when create Entry 
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  entries   Entry[]
  createdAt DateTime @default(now())

  @@index([userId])
}
```

```ts
// 2. Helper function to handle the 0 shelf situation
async function ensureDefaultShelf(userId: string): Promise<string> {
  let defaultShelf = await prisma.shelf.findFirst({
    where: { userId, isDefault: true },
  });

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

  return defaultShelf.id;
}

// 3. Update `action.ts`
  // New shelfId Variable
  const shelfId = formData.get("shelfId") as string;
  // In AddEntry function this line handle the fallback in case of if there is no shelf exist
  const resolvedShelfId = shelfId || (await ensureDefaultShelf(userId));
  // Create new shelfId
  shelfId: resolvedShelfId,
  // Update shelfId
  ...(shelfId && { shelfId }),

```

## New thing to learn Tricky stuff
* `@@index([userId])` This tells Postgres to build an index on the `userId` column in the Shelf table. Without it, every query like `prisma.shelf.findMany({ where: { userId } })` does a full table scan — Postgres reads every row to find matches. With the index, it jumps directly to the matching rows.

* Never trust the client side even on session, so just check if shelf or entry really belong to that user before perform any writing:
```ts
  // Verify both the entry and shelf belong to this user
  const [entry, shelf] = await Promise.all([
    prisma.entry.findFirst({ where: { id: entryId, userId } }),
    prisma.shelf.findFirst({ where: { id: shelfId, userId } }),
  ]);
```

* `reorderShelves` function: take the new shelf order from the client, verify every ID actually belongs to this user, then atomically write the new position numbers to the DB.
```ts

export async function reorderShelves(orderedIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Verify all IDs belong to this user before writing
  const shelves = await prisma.shelf.findMany({
    where: { userId },
    select: { id: true },
  });

  // Build a set of owned IDs: shelves.map((s) => s.id this turn array of object into just and array of IDs then turn it into Set giving O(1) lookup with .has() instead of scanning whole array every time
  const ownedIds = new Set(shelves.map((s) => s.id));

  // .some() is use to search Array if at least one value satisfy condition with O(n) time complexity and .has() look up for specific value on Set and Map object has O(1) time complexity
  if (orderedIds.some((id) => !ownedIds.has(id))) {
    return { error: "Invalid shelf IDs." };
  }

  // $transaction is use when want to resolve multiple DB operation in one request, it guarantee that whole operation will either success or fail as a whole (ACID properties: Atomic, Consistent, Isolated, Durable)
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.shelf.update({ where: { id }, data: { order: index } })
    )
  );

  revalidatePath("/");
}
```

## links
[[virtaul-shelf]]
