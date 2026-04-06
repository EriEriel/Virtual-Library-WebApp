import { prisma } from "@/lib/prisma";
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
    include: { tags: true, image: true },
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {

    return (

      <main className="bg-[#1a1b1d]">
        <div className="ml-64 mr-64 pt-24 px-12 pb-12 min-h-screen bg-[#202123] text-white">

          <StatusHeader />

          {/* Big Data Visualizations */}
          <MetricGrid />

          {/* Content Grid (Asymmetric Bento) */}
          <BentoGrid />

          {/* Footer Terminal Style */}
          {/* <TerminalFooter version="V.S.I_001" year="2026" /> */}
        </div>
      </main>
    );
  }

  // deconstructing and default value,
  // if search is empty return empty string("") instead of undefined
  const { search = "" } = await searchParams
  const entries = await getUserEntries(session.user.id, search);

  redirect('/archive');

}
