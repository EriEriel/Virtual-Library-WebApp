import { AddShelfDropdown } from "@/components/AddShelvesDropdown";


export default function NotesPage() {
  return (
    <main className="bg-[#1a1b1d]">
      <div className="flex gap-4 items-center justify-end">
        <AddShelfDropdown />
      </div>
      <div className="ml-64 mr-64 pt-24 px-12 pb-12 min-h-screen bg-[#202123] text-white font-mono flex items-center justify-center">

        <div className="border border-[#2f3133] rounded-md bg-[#1a1b1d] w-full max-w-xl p-10">

          {/* Window chrome */}
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#2f3133]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-auto text-[11px] text-[#555] tracking-wide">
              notes/index — Terminal Shelf
            </span>
          </div>

          {/* Command line */}
          <div className="flex items-start gap-2.5 mb-6">
            <span className="text-green-400 text-sm pt-0.5">$</span>
            <span className="text-slate-200 text-sm leading-relaxed">
              shelf notes{" "}
              <span className="text-slate-400">--status</span>
            </span>
          </div>

          <div className="border-t border-[#2f3133] my-5" />

          {/* Output block */}
          <div className="pl-4 border-l-2 border-[#2f3133] space-y-2">
            {[
              ["module", "notes & reference"],
              ["purpose", "comprehensive docs manager"],
              ["status", null],
              ["eta", "—"],
            ].map(([key, val]) => (
              <div key={key} className="flex items-center gap-2.5 text-sm text-slate-500">
                <span className="text-green-400 w-36 shrink-0">{key}</span>
                {key === "status" ? (
                  <span className="text-[10px] text-green-400 border border-green-400/20 bg-green-400/10 rounded px-1.5 py-0.5 tracking-widest">
                    COMING SOON
                  </span>
                ) : (
                  <span className="text-slate-400">{val}</span>
                )}
              </div>
            ))}
          </div>

          {/* Footer prompt */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#2f3133]">
            <span className="text-green-400 text-sm">$</span>
            <span className="text-[#374151] text-xs">waiting for input...</span>
            <span className="inline-block w-2 h-3.5 bg-green-400 animate-[blink_1.1s_step-end_infinite]" />
          </div>
        </div>
      </div>
    </main>
  );
}
