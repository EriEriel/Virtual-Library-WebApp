'use client';

import React from 'react';

interface StatusHeaderProps {
  status?: string;
  title?: string;
}

export default function StatusHeader({
  status = "Online",
  title = "Virtual Shelf Index"
}: StatusHeaderProps) {
  return (
    <section className="mb-20">
      {/* Status Bar */}
      <div className="flex items-baseline gap-4 mb-2">
        <span className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase">
          Status // {status}
        </span>
        <div className="h-px grow bg-white opacity-20"></div>
      </div>

      {/* Main Title with Terminal Cursor */}
      <h1 className="text-6xl font-bold tracking-tighter text-white flex items-center">
        {title}
        <span className="ml-1 w-[2.2] h-[1.2em] bg-white animate-pulse opacity-5 inline-block" aria-hidden="true" />
      </h1>

      <style>{`
        /* Optional: If you want a more 'retro' block cursor effect */
        .terminal-cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
