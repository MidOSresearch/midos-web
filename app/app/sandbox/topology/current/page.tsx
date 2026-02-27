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
    density: 0.85,
    mouseGlow: true,
    brightness: 1.2,
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
              19K+
            </div>
            <div className="text-xs text-gray-500 mt-1">Knowledge nodes</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              236
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

        {/* Connection examples — the story behind the graph */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-14"
          data-reveal
          data-reveal-delay="3"
        >
          {[
            {
              from: "Chunk",
              to: "Skill",
              example: "A React 19 tutorial becomes a reusable migration guide",
              textClass: "text-emerald-400",
              hoverClass: "hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgba(52,211,153,0.08)]",
            },
            {
              from: "Truth Patch",
              to: "EUREKA",
              example: "A verified fix reveals a pattern that improves 40 other chunks",
              textClass: "text-amber-400",
              hoverClass: "hover:border-amber-500/30 hover:shadow-[0_8px_30px_rgba(251,191,36,0.08)]",
            },
            {
              from: "EUREKA",
              to: "SOTA",
              example: "A recurring insight becomes state-of-the-art — your agent learns it once",
              textClass: "text-violet-400",
              hoverClass: "hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgba(167,139,250,0.08)]",
            },
          ].map((conn) => (
            <div
              key={conn.from}
              className={`bg-penguin-surface/40 backdrop-blur-sm border border-penguin-border rounded-xl p-4
                         transition-all duration-300 hover:-translate-y-1 ${conn.hoverClass}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`${conn.textClass} text-[11px] font-mono font-semibold`}>
                  {conn.from}
                </span>
                <span className="text-gray-700 text-[10px]">&rarr;</span>
                <span className={`${conn.textClass} text-[11px] font-mono font-semibold`}>
                  {conn.to}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                {conn.example}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <p
          className="text-gray-600 text-sm italic max-w-md mx-auto text-center"
          data-reveal
          data-reveal-delay="4"
        >
          &ldquo;Patterns emerge. A fix in one domain lights up three&nbsp;others.&rdquo;
        </p>

        {/* Transition: Topology → Colony */}
        <div className="mt-16" data-reveal data-reveal-delay="5">
          <p className="text-gray-400 text-base sm:text-lg">
            None of this was built alone.
          </p>
        </div>
      </div>

      {/* Back to sandbox */}
      <div className="fixed bottom-6 left-6 z-20">
        <a
          href="/sandbox/topology"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          &larr; all topology versions
        </a>
      </div>
    </main>
  );
}
