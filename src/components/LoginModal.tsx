"use client";

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import LoginPage from "@/app/login/page"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LoginModal({ trigger }: { trigger?: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  if (status === "loading") return null

  if (session) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
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
        <span className="hidden sm:inline font-mono text-white text-sm font-medium">{session.user?.name}</span>
        {/* Logout Icon (Clean SVG) */}
        <button
          className="text-gray-50 hover:text-white transition-colors cursor-pointer focus:outline-none"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>        </button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        {trigger || (
          /* Login Icon (Clean SVG) */
          <button className="text-gray-50 hover:text-white transition-colors cursor-pointer focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#1a1b1d] border border-[#2f3133] rounded-none p-0 w-[95vw] sm:max-w-sm overflow-hidden">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <LoginPage />
      </DialogContent>
    </Dialog>
  )
}
