"use client";

import { useRef } from "react";
import {
  PenguinSVG,
  SkiingPenguinSVG,
  BookPenguinSVG,
  WrenchPenguinSVG,
  SledPenguinSVG,
} from "@/lib/ui/characters";
import { useCanvasTopology, useDataReveal } from "@/lib/ui/hooks";

/**
 * Colony v3 — Penguins with continuous FLOW
 *
 * v2: names, roles, staggered entrance, hover transforms
 * v3: CONTINUOUS idle animations — the colony breathes even when nobody hovers
 *   - Each penguin has a unique idle cycle (bob + gentle sway)
 *   - Different frequencies create organic wave effect
 *   - Hover still enhances, but baseline is ALIVE
 *   - Subtle shadow pulse under each penguin
 *   - "Les falta flow" → now they flow
 */

const penguins = [
  { Component: SkiingPenguinSVG, name: "Scout", role: "Research", size: "w-10 h-10 sm:w-12 sm:h-12", bobDur: "2.8s", bobDelay: "0s", swayDeg: 3 },
  { Component: BookPenguinSVG, name: "Sage", role: "Knowledge", size: "w-10 h-12 sm:w-12 sm:h-14", bobDur: "3.2s", bobDelay: "0.3s", swayDeg: -2 },
  { Component: WrenchPenguinSVG, name: "Fix", role: "Tools", size: "w-10 h-12 sm:w-12 sm:h-14", bobDur: "2.5s", bobDelay: "0.6s", swayDeg: 4 },
  { Component: PenguinSVG, name: "Pip", role: "Community", size: "w-8 h-10 sm:w-10 sm:h-12", bobDur: "3.0s", bobDelay: "0.15s", swayDeg: -3 },
  { Component: SledPenguinSVG, name: "Rush", role: "Pipeline", size: "w-14 h-12 sm:w-16 sm:h-14", bobDur: "3.5s", bobDelay: "0.45s", swayDeg: 2 },
  { Component: SkiingPenguinSVG, name: "Drift", role: "Ingest", size: "w-10 h-10 sm:w-12 sm:h-12", bobDur: "2.6s", bobDelay: "0.8s", swayDeg: -4 },
  { Component: BookPenguinSVG, name: "Index", role: "Chunks", size: "w-10 h-12 sm:w-12 sm:h-14", bobDur: "3.3s", bobDelay: "0.2s", swayDeg: 3 },
  { Component: WrenchPenguinSVG, name: "Bolt", role: "Hooks", size: "w-10 h-12 sm:w-12 sm:h-14", bobDur: "2.9s", bobDelay: "0.55s", swayDeg: -2 },
  { Component: PenguinSVG, name: "Nova", role: "EUREKA", size: "w-8 h-10 sm:w-10 sm:h-12", bobDur: "2.7s", bobDelay: "0.4s", swayDeg: 5 },
  { Component: SledPenguinSVG, name: "Glide", role: "Delivery", size: "w-14 h-12 sm:w-16 sm:h-14", bobDur: "3.4s", bobDelay: "0.7s", swayDeg: -3 },
  { Component: SkiingPenguinSVG, name: "Apex", role: "SOTA", size: "w-10 h-10 sm:w-12 sm:h-12", bobDur: "3.1s", bobDelay: "0.1s", swayDeg: 4 },
  { Component: PenguinSVG, name: "Pengü", role: "Guide", size: "w-8 h-10 sm:w-10 sm:h-12", bobDur: "2.4s", bobDelay: "0.35s", swayDeg: -2 },
];

const values = [
  { title: "Open", desc: "Vast knowledge, one MCP call away", color: "text-emerald-400", borderColor: "hover:border-emerald-500/30", shadow: "hover:shadow-[0_8px_30px_rgba(52,211,153,0.10)]" },
  { title: "Reliable", desc: "5 layers of validation before your agent sees it", color: "text-amber-400", borderColor: "hover:border-amber-500/30", shadow: "hover:shadow-[0_8px_30px_rgba(251,191,36,0.10)]" },
  { title: "Evolving", desc: "Every cycle adds patterns, never removes them", color: "text-violet-400", borderColor: "hover:border-violet-500/30", shadow: "hover:shadow-[0_8px_30px_rgba(167,139,250,0.10)]" },
];

export default function ColonyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTopology(canvasRef, { density: 0.25, brightness: 0.5 });
  useDataReveal();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-penguin-bg via-[#0d1f3a] to-penguin-bg flex flex-col items-center justify-center py-16 px-6">
      {/* Constellation background — sparse, warm */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      {/* Idle animation keyframes — each penguin bobs and sways independently */}
      <style>{`
        @keyframes penguin-bob {
          0%, 100% { transform: translateY(0) rotate(var(--sway)); }
          40% { transform: translateY(-6px) rotate(calc(var(--sway) * -0.5)); }
          70% { transform: translateY(-2px) rotate(calc(var(--sway) * 0.3)); }
        }
        @keyframes shadow-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(1); }
          40% { opacity: 0.15; transform: scaleX(0.85); }
        }
        .penguin-idle {
          animation: penguin-bob var(--bob-dur) ease-in-out infinite;
          animation-delay: var(--bob-delay);
        }
        .penguin-shadow {
          animation: shadow-pulse var(--bob-dur) ease-in-out infinite;
          animation-delay: var(--bob-delay);
        }
        @media (prefers-reduced-motion: reduce) {
          .penguin-idle { animation: none; }
          .penguin-shadow { animation: none; }
        }
      `}</style>

      {/* Title */}
      <div className="relative z-10 text-center mb-10 max-w-lg" data-reveal>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
          The Colony
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Every skill was written by a developer who needed it&nbsp;first.
        </p>
      </div>

      {/* Penguin parade — continuous flow */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 sm:gap-6 mb-14 max-w-2xl">
        {penguins.map((p, i) => (
          <div
            key={p.name}
            data-reveal
            style={{
              transitionDelay: `${i * 60}ms`,
              "--bob-dur": p.bobDur,
              "--bob-delay": p.bobDelay,
              "--sway": `${p.swayDeg}deg`,
            } as React.CSSProperties}
            className="group relative flex flex-col items-center cursor-default"
          >
            {/* Penguin with continuous idle animation */}
            <div className="penguin-idle transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
              <p.Component
                className={`${p.size} opacity-85 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </div>

            {/* Ground shadow that pulses with the bob */}
            <div
              className="penguin-shadow w-6 h-1 rounded-full bg-white/10 mt-1 mx-auto"
              style={{
                "--bob-dur": p.bobDur,
                "--bob-delay": p.bobDelay,
              } as React.CSSProperties}
            />

            {/* Name + role — always visible, brighter on hover */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap flex flex-col items-center">
              <span className="text-[11px] text-white/80 font-semibold">
                {p.name}
              </span>
              <span className="text-[9px] text-gray-500 font-mono">
                {p.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Role legend */}
      <p className="relative z-10 text-[10px] text-gray-700 mb-10 tracking-wider uppercase" data-reveal>
        12 specialists — research, ingest, validate, deliver
      </p>

      {/* Value cards — tier colored */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
        {values.map((val, i) => (
          <div
            key={val.title}
            data-reveal
            style={{ transitionDelay: `${700 + i * 100}ms` }}
            className={`bg-penguin-surface/60 backdrop-blur-sm border border-penguin-border rounded-xl p-5
                       transition-all duration-300 cursor-default
                       ${val.borderColor} ${val.shadow} hover:-translate-y-1`}
          >
            <h3 className={`font-semibold ${val.color} text-base mb-1`}>
              {val.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {val.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Transition: Colony → Horizon */}
      <div className="relative z-10 mt-14 text-center" data-reveal>
        <p className="text-gray-400 text-base sm:text-lg">
          Everything above — one install&nbsp;away.
        </p>
      </div>

      {/* Back */}
      <a
        href="/sandbox/colony"
        className="fixed bottom-6 left-6 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        &larr; all colony versions
      </a>
    </main>
  );
}
