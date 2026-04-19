import BentoGrid from "@/components/BentoGrid";
import MetricGrid from "@/components/MetricGrid";
import StatusHeader from "@/components/StatusHeader";

export default async function Home() {
  return (
    <main className="bg-[#1a1b1d]">
      <div className="w-full max-w-5xl mx-auto pt-24 px-6 sm:px-8 md:px-12 pb-12 min-h-screen bg-[#202123] text-white">
        <StatusHeader />

        {/* Big Data Visualizations */}
        <MetricGrid />

        {/* Content Grid (Asymmetric Bento) */}
        <BentoGrid />

        {/* Footer Terminal Style */}
        {/* <TerminalFooter version="V.S.I_001" year="2026" /> */}
      </div>
    </main>
  );
}
