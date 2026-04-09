"use client";

import { Shelf } from "@/types/types"
import { deleteShelf } from "@/lib/actions/shelf-action";
import { useRouter } from "next/navigation";
import { ShelvesEditModal } from "./ShelvesEditModal";
import { useState } from "react";
import { HandleRenameModal } from "@/components/RenameShelfModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AddShelfDropdown {
  shelves?: Shelf[];  // ← ? makes it optional
}

export function AddShelfDropdown({ shelves = [] }: AddShelfDropdown) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [renameShelf, setRenameShelf] = useState<Shelf | null>(null); // ← add this

  function selectShelf(id: string) {
    setOpen(false);
    router.push(`/archive/?shelf=${id}`);
  }

  async function handleDelete(id: string) {
    const formData = new FormData();
    formData.set("id", id);
    setOpen(false); // close dropdown first
    await deleteShelf(null, formData);
  }

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="font-mono text-sm text-green-400 border border-green-400 px-4 h-9 bg-[#252628] hover:bg-green-400 hover:text-[#1a1b1d] active:bg-[#252628] active:text-green-400 transition-colors cursor-pointer tracking-widest uppercase flex items-center gap-2"
          >
            <span>Manage Shelves</span>
            <span className="text-[10px]">{open ? "▲" : "▼"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-62 bg-[#202122]"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-green-400">Terminal_Shelf</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-[#48525f] text-xs px-2 py-1.5 hover:text-green-400 transition-colors cursor-pointer"
              onSelect={() => setIsEditOpen(true)}
            >
              + Add New Shelves
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {shelves.map((shelf) => (
              <DropdownMenuItem
                key={shelf.id}
                className="font-mono text-xs text-[#9ca3af] flex items-center gap-2 cursor-pointer hover:text-green-400"
                onSelect={() => selectShelf(shelf.id)}
              >
                <span className="truncate min-w-0 flex-1">{shelf.name}</span>
                <span className="text-[#4b5563] shrink-0">({shelf._count.entries})</span>
                <button
                  className="shrink-0"
                  onClick={(e) => { e.stopPropagation(); setOpen(false); setRenameShelf(shelf); }}
                >
                  rename
                </button>
                <button
                  className="shrink-0"
                  onClick={(e) => { e.stopPropagation(); handleDelete(shelf.id); }}
                >
                  delete
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="font-mono text-xs text-[#9ca3af] cursor-pointer hover:text-green-400"
              onSelect={() => { setOpen(false); router.push("/archive"); }}
            >
              all entries
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditOpen && (
        <ShelvesEditModal
          key="add-shelf-modal"
          shelves={shelves}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
      {renameShelf && (
        <HandleRenameModal
          key={`rename-shelf-${renameShelf.id}`}
          shelf={renameShelf}
          open={!!renameShelf}
          onOpenChange={(open) => { if (!open) setRenameShelf(null); }}
        />
      )}
    </>
  );
}
