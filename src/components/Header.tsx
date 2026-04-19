"use client";

import LoginModal from "./LoginModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-none bg-stone-950">
      {/* Main bar */}
      <div className="flex h-16 items-center px-6 sm:px-8">
        {/* Logo */}
        <div className="font-mono flex-1 text-xl font-black tracking-widest text-white">
          <Link href="/">TERMINAL_SHELF</Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex flex-1 justify-center">
          {["/curated", "/archive", "/docs"].map((href) => (
            <Link
              key={href}
              href={href}
              className={`font-headline tracking-tighter uppercase font-bold text-sm transition-colors duration-150 ${pathname === href
                ? "text-green-400 border-b border-green-400"
                : "text-[#9ca3af] hover:text-white"
                }`}
            >
              {href.slice(1)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <LoginModal />

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden text-gray-50 hover:text-white transition-colors focus:outline-none cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // ☰ icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[#2f3133] bg-stone-950 px-6 sm:px-8 py-4 flex flex-col gap-4">
          {["/curated", "/archive", "/docs"].map((href) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`font-headline tracking-tighter uppercase font-bold text-sm transition-colors duration-150 ${pathname === href
                ? "text-green-400"
                : "text-[#9ca3af] hover:text-white"
                }`}
            >
              {href.slice(1)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
