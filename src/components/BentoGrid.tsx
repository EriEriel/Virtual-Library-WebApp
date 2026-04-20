import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";

export const revalidate = 3600;

const recentActivity = await prisma.entry.findMany({
  take: 5,
  orderBy: { createdAt: "desc" },
  select: {
    createdAt: true,
    category: true,
    status: true,
  }
})

const logs = recentActivity.map((entry) => ({
  time: entry.createdAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
  msg: `ENTRY_ADDED: ${entry.category}`,
}))

export default async function BentoGrid() {
  const session = await auth();
  // Count total then pick a random offset — Prisma has no native random()
  const count = await prisma.entry.count();
  const randomSkip = count > 0 ? Math.floor(Math.random() * count) : 0;

  const entry = count > 0
    ? await prisma.entry.findFirst({
      skip: randomSkip,
      include: {
        shelf: true,
        image: true,
      },
    })
    : null;

  return (
    <section className="grid grid-cols-12 gap-6">
      {/* Large Card */}
      <div className="col-span-12 md:col-span-8 bg-[#1a1a1a] p-8 flex flex-col justify-between min-h-[280px]">
        <div>
          <div className="flex justify-between items-start mb-12">
            <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              {entry ? `Shelf // ${entry.shelf?.name ?? "Unshelved"}` : "Index // Core_Node_01"}
            </div>
            <span className="text-white">●</span>
          </div>

          {entry ? (
            <div className="flex gap-6">
              {/* Cover image if exists */}
              {entry.image?.url && (
                <div className="shrink-0 w-24 h-32 relative border border-white/10 overflow-hidden">
                  <Image
                    src={entry.image.url}
                    alt={entry.title}
                    fill
                    className="object-cover grayscale"
                  />
                </div>
              )}
              <div className="flex flex-col gap-3">
                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  {entry.category} &nbsp;·&nbsp; {entry.status.replace("_", " ")}
                </div>
                <h3 className="text-xl sm:text-4xl font-bold tracking-tight">{entry.title}</h3>
                {entry.notes && (
                  <p className="text-gray-400 max-w-md text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {entry.notes}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Fallback when DB is empty */
            <>
              <h3 className="text-4xl font-bold tracking-tight mb-4">
                Your Library. Indexed.
              </h3>
              <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                Track everything you read, watch, and play. Organized into shelves, built for the terminal-minded.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <div className="px-6 py-2 bg-white/10 text-white/30 text-[10px] font-mono uppercase font-bold cursor-not-allowed select-none">
            {entry ? entry.status.replace("_", " ") : "Browse"}
          </div>
          {!session && (
            <Link
              href="/login"
              className="px-6 py-2 border border-gray-700 text-white text-[10px] font-mono uppercase hover:bg-white/10 transition-colors"
            >
              Sign In →
            </Link>
          )}
        </div>
      </div>

      {/* Log Card */}
      <div className="col-span-12 md:col-span-4 bg-[#1e1e1e] p-8 border-t md:border-t-0 md:border-l border-white/5">
        <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-8">
          Active_Log
        </div>
        <div className="space-y-6">
          {logs.map((log, i) => (
            <div key={i} className="flex flex-col min-w-0">
              <span className="text-xs text-white font-mono">{log.time}</span>
              <span className="text-xs text-gray-400 font-mono uppercase break-words">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
