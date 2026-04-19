"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import CoverUpload from "./CoverUpload";
import { addEntry } from "./actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddEntryModal({ className }: { className?: string }) {

  const [coverUrl, setCoverUrl] = useState("");
  const [publicId, setPublicId] = useState("");

  const searchParams = useSearchParams();
  const activeShelfId = searchParams.get("shelf") ?? "";

  const pathname = usePathname();
  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

  return (
    <div className={className}>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <button className="w-full font-mono text-sm text-green-400 border border-green-400 px-4 h-9 hover:bg-green-400 hover:text-[#1a1b1d] transition-colors cursor-pointer tracking-widest uppercase">
            + Add Entry
          </button>
        </DialogTrigger>

        <DialogContent className="bg-[#1a1b1d] border border-[#2f3133] text-white font-mono rounded-none w-[95vw] sm:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-[#2f3133] pb-4">
            <DialogTitle className="text-green-400 text-sm tracking-widest uppercase">
              $ new entry
            </DialogTitle>
            <DialogDescription className="text-[#4b5563] text-xs">
              {"// Insert your favourite material here"}
            </DialogDescription>
          </DialogHeader>

          <form action={addEntry} className="space-y-4 pt-4">

            <input type="hidden" name="coverUrl" value={coverUrl ?? ""} />
            <input type="hidden" name="publicId" value={publicId ?? ""} />
            <input type="hidden" name="currentPath" value={currentPath} />
            <input type="hidden" name="shelfId" value={activeShelfId} />

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <label className="text-[11px] text-[#4b5563] sm:w-24 shrink-0 tracking-wide uppercase">cover</label>
              <CoverUpload
                onUpload={(url, pid) => {
                  setCoverUrl(url);
                  setPublicId(pid);
                }}
              />
            </div>

            {/* Reusable field style — apply to all inputs */}
            {[
              { id: "title", label: "title", placeholder: "" },
              { id: "url", label: "url", placeholder: "optional" },
              { id: "author", label: "author", placeholder: "optional" },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <label htmlFor={id} className="text-[11px] text-[#4b5563] sm:w-24 shrink-0 tracking-wide uppercase">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  placeholder={placeholder}
                  className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs px-2 py-2 focus:outline-none focus:border-green-400 placeholder:text-[#374151] transition-colors font-mono w-full"
                />
              </div>
            ))}

            {/* Notes */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
              <label htmlFor="notes" className="text-[11px] text-[#4b5563] sm:w-24 shrink-0 tracking-wide pt-1.5 uppercase">
                notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="optional"
                rows={3}
                className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs px-2 py-2 focus:outline-none focus:border-green-400 placeholder:text-[#374151] resize-none transition-colors font-mono w-full"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <label className="text-[11px] text-[#4b5563] sm:w-24 shrink-0 tracking-wide uppercase">category</label>
              <Select name="category" modal={false}>
                <SelectTrigger className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs h-9 rounded-none focus:ring-0 focus:border-green-400 font-mono w-full">
                  <SelectValue placeholder="select..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1b1d] border border-[#2f3133] rounded-none font-mono">
                  <SelectItem value="FANFIC" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Fanfic</SelectItem>
                  <SelectItem value="NOVEL" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Novel</SelectItem>
                  <SelectItem value="MANGA" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Manga</SelectItem>
                  <SelectItem value="BOOKMARK" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Bookmark</SelectItem>
                  <SelectItem value="OTHER" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <label htmlFor="tags" className="text-[11px] text-[#4b5563] sm:w-24 shrink-0 tracking-wide uppercase">tags</label>
              <input
                id="tags"
                name="tags"
                placeholder="action, romance, isekai"
                className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs px-2 py-2 focus:outline-none focus:border-green-400 placeholder:text-[#374151] transition-colors font-mono w-full"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <label className="text-[11px] text-[#4b5563] sm:w-24 shrink-0 tracking-wide uppercase">status</label>
              <Select name="status" modal={false}>
                <SelectTrigger className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs h-9 rounded-none focus:ring-0 focus:border-green-400 font-mono w-full">
                  <SelectValue placeholder="optional" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1b1d] border border-[#2f3133] rounded-none font-mono">
                  <SelectItem value="READING" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Reading</SelectItem>
                  <SelectItem value="COMPLETED" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Completed</SelectItem>
                  <SelectItem value="DROPPED" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Dropped</SelectItem>
                  <SelectItem value="PLAN_TO_READ" className="text-xs text-slate-300 focus:bg-[#2f3133] focus:text-green-400">Plan to read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-[#2f3133] pt-6 flex flex-col sm:flex-row justify-end gap-3">
              <DialogClose asChild>
                <button className="font-mono text-xs text-[#6b7280] border border-[#2f3133] px-4 py-2 hover:border-[#6b7280] transition-colors w-full sm:w-auto">
                  cancel
                </button>
              </DialogClose>

              <button
                type="submit"
                className="font-mono text-xs text-[#1a1b1d] bg-green-400 border border-green-400 px-4 py-2 hover:bg-green-300 transition-colors tracking-wide w-full sm:w-auto"
              >
                save entry
              </button>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>)
}
