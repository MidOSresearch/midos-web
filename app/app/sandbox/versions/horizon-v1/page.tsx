import HorizonV1 from "../../_archive/v1/horizon_v1";

export default function Page() {
  return (
    <>
      <HorizonV1 />
      <div className="fixed bottom-6 right-6 z-50">
        <a href="/sandbox/history" className="text-xs bg-penguin-surface/80 backdrop-blur-sm border border-penguin-border px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
          &larr; version history
        </a>
      </div>
    </>
  );
}
