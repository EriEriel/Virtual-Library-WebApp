import { prisma } from "@/lib/prisma";
import EntryCard from "@/components/EntryCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import AddEntryModal from "@/components/AddEntryModal";
import { AddShelfDropdown } from "@/components/AddShelfDropdown";
import { getShelves } from "@/lib/actions/shelf-action";

async function getUserEntries(userId: string, search: string = "", shelfId?: string) {
  return await prisma.entry.findMany({

    where: {
      userId: userId,
      ...(shelfId && { shelfId }),
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true, image: true },
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string; shelf?: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/")
  }

  const { search = "", shelf } = await searchParams;
  const [entries, shelves] = await Promise.all([
    getUserEntries(session.user.id, search, shelf),
    getShelves(),
  ]);

  const activeShelf = shelves.find((s) => s.id === shelf);
  const shelfName = activeShelf?.name ?? "All Entries";

  return (
    <div className="bg-[#1a1b1d]">
      <div className="mx-0 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 pt-24 px-6 sm:px-12 pb-12 min-h-screen bg-[#202123] text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-mono font-bold text-sm text-green-400 h-9 transition-colors tracking-widest uppercase flex items-center border-l-2 border-green-400 pl-4">
            Shelf: {shelfName.toLowerCase()}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {session && <SearchBar className="w-full sm:w-auto" />}
            <div className="flex gap-2 sm:gap-4">
              {session && <AddEntryModal className="flex-1 sm:flex-none" />}
              {session && <AddShelfDropdown shelves={shelves} className="flex-1 sm:flex-none" />}
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-5">
          {entries.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center font-mono">
              <div className="text-[#2f3133] text-6xl mb-4">[]</div>
              <p className="text-[11px] text-[#4b5563] tracking-widest mb-1">{"// shelf is empty"}</p>
              <p className="text-[#374151] text-xs">no entries found. add one to get started.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} >
                <EntryCard key={entry.id} entry={entry}></EntryCard>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
