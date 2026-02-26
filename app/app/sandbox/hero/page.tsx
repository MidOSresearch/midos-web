"use client";

import { SkiingPenguinSVG } from "@/lib/ui/characters";

export default function HeroExperiment() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-gray-100">
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Aurora background */}
        <div
          className="absolute inset-0 pointer-events-none animate-aurora"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute"
            style={{
              top: "10%",
              left: "20%",
              width: "60vw",
              height: "60vw",
              background:
                "radial-gradient(ellipse at center, rgba(20, 184, 166, 0.18) 0%, transparent 70%)",
              filter: "blur(48px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "40%",
              right: "10%",
              width: "50vw",
              height: "50vw",
              background:
                "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
              filter: "blur(64px)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "5%",
              left: "5%",
              width: "40vw",
              height: "40vw",
              background:
                "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.10) 0%, transparent 70%)",
              filter: "blur(56px)",
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative flex flex-col items-center justify-center gap-6 px-6 text-center"
          style={{ zIndex: 1 }}
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight animate-shimmer">
            MidOS
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 animate-float">
            Where knowledge flows like water
          </p>

          <p className="text-sm sm:text-base text-gray-500 max-w-sm">
            Words and bridges. Building something that matters.
          </p>
        </div>

        {/* Skiing penguin at the bottom */}
        <div
          className="absolute bottom-10 flex flex-col items-center gap-2"
          style={{ zIndex: 1 }}
        >
          <SkiingPenguinSVG className="w-16 h-16 animate-float" />
          <span className="text-xs text-gray-500 tracking-widest uppercase">
            scroll to descend
          </span>
        </div>
      </section>

      {/* Back link */}
      <div className="fixed bottom-6 left-6" style={{ zIndex: 50 }}>
        <a
          href="/sandbox"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← sandbox
        </a>
      </div>
    </main>
  );
}
