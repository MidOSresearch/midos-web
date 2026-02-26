import HeroV2 from "../../_archive/v1/hero_v2";

export default function Page() {
  return (
    <>
      <HeroV2 />
      <div className="fixed bottom-6 left-6 z-50">
        <a href="/sandbox/hero" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">&larr; all hero versions</a>
      </div>
    </>
  );
}
