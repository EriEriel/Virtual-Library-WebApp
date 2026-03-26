"use client"

import { useSession, signOut } from "next-auth/react"
import { SearchBar } from "./SearchBar"
import AddEntryModal from "./AddEntryModal"
import LoginModal from "./LoginModal"

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav>
      <div className="flex justify-between items-center mr-50 ml-50">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Virtual Shelf</h1>
          <p className="text-muted-foreground mt-2">Manage your favorite stories and bookmarks in one place!!</p>
        </div>

        <div className="flex gap-4 items-center">
          <SearchBar />
          <AddEntryModal />
          <LoginModal />
        </div>
      </div>
    </nav>
  )
}
