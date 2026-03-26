import { prisma } from "@/lib/prisma";
import AddEntryModal from "@/components/AddEntryModal";
import EntryCard from "@/components/EntryCard";
import { SearchBar } from "@/components/SearchBar";
import LoginModal from "@/components/LoginModal";

async function getEntries(search: string = "") {
  return await prisma.entry.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
      ]
    },
    orderBy: { updatedAt: "desc" },
    include: { tags: true },
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  // deconstructing and default value,
  // if search is empty return empty string("") instead of undefined
  const { search = "" } = await searchParams
  const entries = await getEntries(search);

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Your shelf is empty.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} >
              <EntryCard key={entry.id} entry={entry}></EntryCard>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
