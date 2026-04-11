"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { deleteEntry } from "./actions";

export function AlertDelete({ id }: { id: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

  return (
    <AlertDialog modal={false}>
      <AlertDialogTrigger asChild>
        <button className="flex items-center gap-1.5 font-mono text-xs text-red-500 border border-[#2f3133] px-2 py-1.5 hover:border-red-500 transition-colors cursor-pointer">
          <Trash2 className="w-3 h-3" />
          delete
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#1a1b1d] border border-[#2f3133] rounded-none font-mono">
        <AlertDialogHeader className="border-b border-[#2f3133] pb-4">
          <AlertDialogTitle className="text-red-500 text-sm tracking-widest uppercase">
            $ rm entry
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#4b5563] text-xs leading-relaxed">
        // This action cannot be undone.{" "}
            <span className="text-red-500">Entry will be permanently deleted.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={deleteEntry}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="currentPath" value={currentPath} />

          <AlertDialogFooter className="pt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="font-mono text-xs text-[#6b7280] border border-[#2f3133] bg-transparent rounded-none px-4 py-1.5 hover:border-[#6b7280] hover:bg-transparent hover:text-white transition-colors">
              cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className="font-mono text-xs text-white bg-red-900 border border-red-800 rounded-none px-4 py-1.5 hover:bg-red-800 transition-colors"
            >
              confirm delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

