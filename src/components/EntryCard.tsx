"use client";

import { Entry, Tag } from "@/generated/prisma/client";
import { ExternalLink } from "lucide-react";
import EditEntryModal from "./EditEntryModal";
import { Star } from "./Icons";
import { useState } from "react";
import { toggleCurated } from "./actions";

export type EntryWithTags = Entry & { tags: Tag[] };

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-950 text-green-300 border-l border-b border-[#2f3133]",
  READING: "bg-yellow-950 text-yellow-300 border-l border-b border-[#2f3133]",
  PLAN_TO_READ: "bg-orange-950 text-orange-300 border-l border-b border-[#2f3133]",
  DROPPED: "bg-zinc-800   text-zinc-400   border-l border-b border-[#2f3133]",
};

export default function EntryCard({ entry }: { entry: EntryWithTags }) {
  const [curated, setCurated] = useState(entry.isCurated);

  const handleCurate = async () => {
    setCurated(!curated);
    await toggleCurated(entry.id, !curated);
  };

  const badgeStyle = statusStyles[entry.status] ?? "bg-zinc-800 text-zinc-400";

  return (
    <div className="relative bg-[#1a1b1d] border border-[#2f3133] font-mono h-95 flex flex-col">
      {/* Status badge — sharp corner, top-right */}
      <span className={`absolute top-0 right-0 text-[10px] font-bold tracking-widest px-2 py-1 uppercase ${badgeStyle}`}>
        {entry.status.replace(/_/g, " ")}
      </span>

      <div className="p-3.5">

        {/* Cover + title row */}
        <div className="flex gap-4 items-center justify-end mb-6">
          <div className="w-18 h-27 shrink-0 border border-[#3a3d40] bg-[#2f3133] overflow-hidden">
            <img
              src={entry.coverUrl ?? "/place_holder.png"}
              alt={entry.title}
              width={72}
              height={108}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <a
              href={entry.url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[13px] font-medium text-slate-200 flex items-center gap-1 mb-1 truncate
                ${entry.url ? "hover:text-green-400 cursor-pointer" : "cursor-default"}`}
            >
              <span className="truncate">{entry.title}</span>
              {entry.url && <ExternalLink className="w-2.5 h-2.5 shrink-0 text-green-400" />}
            </a>
            <div className="text-[11px] text-green-400 tracking-wide mb-1">
              // {entry.category}
            </div>
          </div>
        </div>

        <hr className="border-[#2f3133] mb-2.5" />

        {/* Author */}
        <div className="text-[11px] text-[#4b5563] mb-2">
          // {entry.author}
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {entry.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] text-[#9ca3af] bg-[#262729] border border-[#374151] px-1.5 py-px tracking-wide"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <div className="bg-[#16171a] border-l-2 border-green-400 px-2 py-1.5 mb-3 shrink-0">
            <p className="text-[10px] text-green-400 tracking-widest mb-1 uppercase">Note</p>
            <p className="text-[11px] text-[#6b7280] leading-relaxed line-clamp-3">{entry.notes}</p>
          </div>
        )}

        {/* spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2f3133]">          <div className="hover:border-green-400 hover:text-green-400 text-[#6b7280] transition-colors">
          <EditEntryModal entry={entry} />
        </div>
          <button
            onClick={handleCurate}
            className={`p-1 transition-colors
              ${curated
                ? "text-yellow-400"
                : "text-[#6b7280] hover:text-yellow-400"
              }`}
          >
            <Star filled={curated} />
          </button>
        </div>

      </div>
    </div>
  );
}
