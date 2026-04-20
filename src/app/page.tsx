import BentoGrid from "@/components/BentoGrid";
import MetricGrid from "@/components/MetricGrid";
import StatusHeader from "@/components/StatusHeader";
import { GitHub } from "@/components/Icons";

export default async function Home() {
  return (
    <main className="bg-[#1a1b1d]">
      <div className="w-full max-w-5xl mx-auto pt-24 px-6 sm:px-8 md:px-12 pb-12 min-h-screen bg-[#202123] text-white flex flex-col">
        <div className="flex-grow">
          <StatusHeader />

          {/* Big Data Visualizations */}
          <MetricGrid />

          {/* Content Grid (Asymmetric Bento) */}
          <BentoGrid />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-sm font-mono">
          <p>© {new Date().getFullYear()} ERI_ERIEL // PERSONAL_LIB_SYS</p>
          <a
            href="https://github.com/EriEriel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors group"
          >
            <GitHub className="size-4 group-hover:scale-110 transition-transform" />
            <span>GITHUB/ERI_ERIEL</span>
          </a>
        </footer>
      </div>
    </main>
  );
}
