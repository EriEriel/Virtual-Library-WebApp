
import { prisma } from "@/lib/prisma";
import EntryCard from "@/components/EntryCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BentoGrid from "@/components/BentoGrid";
import MetricGrid from "@/components/MetricGrid";
import StatusHeader from "@/components/StatusHeader";

async function getUserEntries(userId: string, search: string = "") {
  return await prisma.entry.findMany({
    where: {
      userId: userId,
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
  const session = await auth();

  if (!session?.user?.id) {
    // return (
    //   <main className="container mx-auto py-20 text-center mt-20">
    //     <h1 className="text-4xl font-bold mb-4">Create your own Archive! 📚</h1>
    //     <p className="text-muted-foreground mb-8">
    //       Manage and Organize your favourite sites in one place!
    //     </p>
    //     <div className="flex justify-center gap-4">
    //       {/* Link to your sign-in page or a button */}
    //       <a href="/api/auth/signin" className="px-6 py-2 bg-primary text-white rounded-md">
    //         Get Started
    //       </a>
    //     </div>
    //   </main>
    // );

    return (
      <main className="ml-64 pt-24 px-12 pb-12 min-h-screen bg-[#202123] text-white">

        <StatusHeader />

        {/* Big Data Visualizations */}
        <MetricGrid />

        {/* Content Grid (Asymmetric Bento) */}
        <BentoGrid />

        {/* Footer Terminal Style */}
        {/* <TerminalFooter version="V.S.I_001" year="2026" /> */}
      </main>
    );
  }

  // deconstructing and default value,
  // if search is empty return empty string("") instead of undefined
  const { search = "" } = await searchParams
  const entries = await getUserEntries(session.user.id, search);

  return (
    <main className="container mx-auto py-10 px-4 mt-10">
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
