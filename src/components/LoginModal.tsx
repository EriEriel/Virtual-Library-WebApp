"use client";

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import LoginPage from "@/app/login/page"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LoginModal() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  if (status === "loading") return null

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#1a1a1a] text-white text-sm flex items-center justify-center">
            {session.user?.name?.[0]?.toUpperCase()}
          </div>
        )}
        <span className="font-mono text-white text-sm font-medium">{session.user?.name}</span>
        <Button
          className="text-on-surface hover:text-white transition-colors cursor-pointer focus:outline-none"
          onClick={() => signOut()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Login Icon (Clean SVG) */}
        <button className="text-on-surface hover:text-white transition-colors cursor-pointer focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <LoginPage />
      </DialogContent>
    </Dialog>
  )
}
