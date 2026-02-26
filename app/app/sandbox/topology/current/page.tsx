"use client";

import { useRef } from "react";
import { useCanvasTopology, useDataReveal } from "@/lib/ui/hooks";

/**
 * Topology v2 — Full-screen constellation network with pipeline colors
 *
 * Changes from v1:
 * - Full bleed canvas (no container box)
 * - Pipeline-colored nodes (gray/green/blue/gold/purple)
 * - Constellation clusters
 * - Mouse interaction glow
 * - Stats with tier colors
 * - More immersive — could literally be the opening of the site
 */

export default function TopologyExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTopology(canvasRef, {
    nodeCount: 65,
    connectionDistance: 140,
    mouseGlow: true,
  });
  useDataReveal({ threshold: 0.05 });

  return (
    <main className="relative min-h-screen bg-penguin-bg text-gray-100 overflow-hidden">
      {/* Full-bleed canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "crosshair" }}
      />

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Title */}
        <div className="text-center mb-12" data-reveal>
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-3">
            Knowledge Graph
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold text-white/90 tracking-tight">
            Everything Connects
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Patterns emerge. Bridges form between ideas that never met&nbsp;before.
          </p>
        </div>

        {/* Stats — each with tier color */}
        <div
          className="grid grid-cols-3 gap-8 sm:gap-12 max-w-lg mx-auto mb-14"
          data-reveal
          data-reveal-delay="2"
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
              21K+
            </div>
            <div className="text-xs text-gray-500 mt-1">Knowledge nodes</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              168
            </div>
            <div className="text-xs text-gray-500 mt-1">Discoveries</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-violet-400">
              &infin;
            </div>
            <div className="text-xs text-gray-500 mt-1">Connections</div>
          </div>
        </div>

        {/* Quote */}
        <p
          className="text-gray-600 text-sm italic max-w-md mx-auto text-center"
          data-reveal
          data-reveal-delay="3"
        >
          &ldquo;The world might not be ready for the technical truth.
          But they can feel it through motion.&rdquo;
        </p>

        {/* Interaction hint */}
        <div className="mt-12 text-[10px] text-gray-700 tracking-widest uppercase" data-reveal data-reveal-delay="4">
          move your cursor
        </div>
      </div>

      {/* Back to sandbox */}
      <div className="fixed bottom-6 left-6 z-20">
        <a
          href="/sandbox"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          &larr; sandbox
        </a>
      </div>
    </main>
  );
}
