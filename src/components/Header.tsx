"use client";

import LoginModal from "./LoginModal";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-none bg-surface px-8 dark:bg-background">

      {/* Logo Section */}
      <div className="font-mono text-xl font-black tracking-widest text-on-surface">
        TERMINAL_SHELF
      </div>

      {/* Navigation - Uses your new --font-headline alias */}
      <nav className="hidden items-center gap-8 md:flex">
        <a
          href="#"
          className="font-headline tracking-tighter uppercase font-bold text-sm text-stone-400 dark:text-stone-600 dark:hover:text-black hover:text-white transition-colors duration-150"
        >
          CURATED
        </a>
        <a
          href="#"
          className="font-headline tracking-tighter uppercase font-bold text-sm text-stone-400 dark:text-stone-600 dark:hover:text-black hover:text-white transition-colors duration-150"
        >
          ARCHIVE
        </a>
        <a
          href="#"
          className="font-headline tracking-tighter uppercase font-bold text-sm text-stone-400 dark:text-stone-600 dark:hover:text-black hover:text-white transition-colors duration-150"
        >
          DOCS
        </a>
      </nav>

      <div className="flex items-center gap-6">

        <LoginModal />

        {/* Terminal Icon (Clean SVG) */}
        <button className="text-on-surface hover:text-white transition-colors cursor-pointer focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </button>

        {/* Settings Icon (Clean SVG) */}
        <button className="text-on-surface hover:text-white transition-colors cursor-pointer focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>

      </div>
    </header>
  );
}
