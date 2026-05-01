---
id: implement-curated-function
aliases: []
tags:
  - #project
  - #feature
---
# implement-curated-function
2026-03-31

## goal
Implement Curated function that let's user add they favourite Entry.

## approach
1. Update `schema.prisma` to include:
  ```prisma
  isCurated Boolean  @default(false)
```

2. Now add new server action to `action.ts`:
  ```ts
  "use server"

  export async function toggleCurated(id: string, value: boolean) {
    await prisma.entry.update({
      where: { id },
      data: { isCurated: value }
    })
    revalidatePath("/archive") // This `revalidatePath()` let's Nextjs fetch new data from DB without reload the page.
  }
```

3. Import `toggleCurated` function and add state handler to `EntryCard.tsx`
```tsx
  import { toggleCurated } from "./actions";

  const [curated, setCurated] = useState(entry.isCurated)

  const handleCurate = async () => {
    setCurated(!curated)
    await toggleCurated(entry.id, !curated)
  }
```

4. Create `Star` component in `Icon.tsx` to handle new curated function:
```tsx
  export const Star = ({ filled }: { filled: boolean }) => (
    <svg fill={filled ? "currentColor" : "none"} ...>
```

5. Wire up the `Star`:
```tsx
  <button onClick={handleCurate} className="text-gray-300 hover:text-yellow-400">
    <Star filled={curated} />
  </button>
```

## links
[[react-hook]]
[[virtaul-shelf]]
[[prisma]]

