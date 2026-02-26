"use client";

import { PenguinSVG } from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

export default function HorizonExperiment() {
  useDataReveal();

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Aurora morph background */}
        <div
          className="absolute inset-0 animate-aurora-morph opacity-15"
          style={{ filter: "blur(60px)" }}
        />

        <div className="relative z-10 text-center px-6">
          <PenguinSVG className="w-14 mx-auto mb-6 opacity-80" style={{ height: "72px" }} />

          <h2 className="text-3xl sm:text-5xl font-bold mb-4" data-reveal>
            The Horizon
          </h2>

          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto" data-reveal>
            Every journey starts with a single step. Every knowledge graph starts with a single node.
          </p>

          <div data-reveal>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-midos-600 text-white font-semibold rounded-lg
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,150,136,0.3)]
                         active:translate-y-0 active:shadow-none"
            >
              Start your journey
              <span className="animate-wave">→</span>
            </a>
          </div>

          <p className="text-gray-700 text-xs mt-16" data-reveal>
            se puede mejorar el mundo
          </p>
        </div>
      </section>

      <div className="fixed bottom-6 left-6">
        <a href="/sandbox" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          ← sandbox
        </a>
      </div>
    </main>
  );
}
