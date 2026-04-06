"use client";

import { useSession, signOut } from "next-auth/react"
import Header from "./Header";

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <Header></Header>
  )

}
