import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EntryCard from "@/components/EntryCard";
import { SearchBar } from "@/components/SearchBar";
import AddEntryModal from "@/components/AddEntryModal";

async function getUserCuratedEntries(userId: string, search: string = "") {
  return await prisma.entry.findMany({
    where: {
      userId: userId,
      isCurated: true,
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/")
  }

  // deconstructing and default value,
  // if search is empty return empty string("") instead of undefined
  const { search = "" } = await searchParams
  const entries = await getUserCuratedEntries(session.user.id, search);

  return (
    <main className="bg-[#1a1b1d]">
      <div className="ml-64 mr-64 py-10 px-4 mt-10 bg-[#202123] min-h-screen">

        <div className="flex gap-4 items-center justify-end">
          {session && <SearchBar />}
          {session && <AddEntryModal />}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-5">
          {entries.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center font-mono">
              <div className="text-[#2f3133] text-6xl mb-4">[]</div>
              <p className="text-[11px] text-[#4b5563] tracking-widest mb-1">// shelf is empty</p>
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
    </main>
  );
}
