"use client";

import { Entry, Tag } from "@/generated/prisma/client";
import { ExternalLink, Pencil } from "lucide-react"
import EditEntryModal from "./EditEntryModal";

// Type alias of TypeScript because Tag is seperate table, 
// So if we want to use tag[] array we also create new type that include both Entry and Tag together.
// It just joining table under the hoods
export type EntryWithTags = Entry & { tags: Tag[] }

export default function EntryCard({ entry }: { entry: EntryWithTags }) {
  return (
    <div
      key={entry.id}
      className="relative p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="mb-3">
        <div className="text-sm text-right items-end justify-end">
          {/* Status Badge */}
          <span className={`absolute top-3 right-3 text-[10px] p-3 py-0.5 border rounded-full font-semibold 
    ${entry.status === "COMPLETED" ? "bg-green-50 text-green-500 border-green-200" :
              entry.status === "READING" ? "bg-yellow-50 text-yellow-500 border-yellow-200" :
                entry.status === "PLAN_TO_READ" ? "bg-orange-50 text-orange-500 border-orange-200" :
                  entry.status === "DROPPED" ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-zinc-500"}`}>
            {entry.status.replace(/_/g, ' ')}
          </span>            </div>
      </div>
      <div className="flex gap-2 mt-7">
        <div className="flex items-start justify-items-start mb-10">
          <img
            src={entry.coverUrl ?? "/place_holder.png"}
            alt={entry.title}
            width={90}
            height={135}
          />
        </div>
        <div>

          <div className="text-xl text-black truncate max-w-xs">
            <a
              href={entry.url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={entry.url ? "hover:bg-gray-200 cursor-pointer flex item-center gap-1" : "cursor-default"}
            >
              {entry.title}
              {entry.url && <ExternalLink className="w-3 h-3" />}
            </a>
          </div>
          <div className="text-sm text-gray-500">
            {entry.category}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        // {entry.author}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {entry.tags.map((tag) => (
          <span key={tag.id} className="border rounded-xl px-2 py-0.5 text-xs text-grey-200 bg-gray-50">#{tag.name}</span>
        ))}
      </div>
      <div className="mt-2">
        {entry.notes && (
          <div key={entry.id}>
            <p>Note</p>
            <p className="text-sm text-gray-500 pl-4">	{entry.notes}</p>
          </div>
        )}
      </div>
      <div className="flex mt-4 justify-end">
        <EditEntryModal entry={entry}></EditEntryModal>
      </div>
    </div>
  )
}
