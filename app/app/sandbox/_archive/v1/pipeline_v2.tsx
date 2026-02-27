"use client";

import { SkiingPenguinSVG } from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Pipeline v2 — 5 knowledge tiers with color progression
 *
 * Color system (user-defined, maps to real pipeline):
 *   Gray    → Raw / Staging (unprocessed)
 *   Green   → Chunks / Free (knowledge, docs, skills)
 *   Blue    → Dev (tools, depth, professional)
 *   Gold    → Truth + EUREKA (verified, discovered)
 *   Purple  → SOTA + AOTC (epic, state-of-the-art)
 *
 * Flow: left → right, color intensity builds as knowledge matures
 */

const stages = [
  {
    num: "01",
    name: "Staging",
    label: "Raw Sources",
    desc: "Everything enters here. Docs, repos, research, community knowledge.",
    count: "∞",
    // Gray tier
    numColor: "text-gray-400",
    borderHover: "hover:border-gray-500/40",
    shadowHover: "hover:shadow-[0_8px_30px_rgba(156,163,175,0.10)]",
    dotColor: "bg-gray-500",
    glowColor: "rgba(156, 163, 175, 0.15)",
  },
  {
    num: "02",
    name: "Chunks",
    label: "Knowledge",
    desc: "21K+ validated pieces. Docs, skills, patterns, research.",
    count: "21,346",
    // Green tier
    numColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/40",
    shadowHover: "hover:shadow-[0_8px_30px_rgba(52,211,153,0.12)]",
    dotColor: "bg-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.15)",
  },
  {
    num: "03",
    name: "Dev",
    label: "Tools & Depth",
    desc: "300+ instruments. Semantic search. Agent handshake.",
    count: "300+",
    // Blue tier
    numColor: "text-sky-400",
    borderHover: "hover:border-sky-500/40",
    shadowHover: "hover:shadow-[0_8px_30px_rgba(56,189,248,0.12)]",
    dotColor: "bg-sky-400",
    glowColor: "rgba(56, 189, 248, 0.15)",
  },
  {
    num: "04",
    name: "Truth",
    label: "Verified",
    desc: "47 truth patches. 168 EUREKA discoveries. Battle-tested.",
    count: "215",
    // Gold tier
    numColor: "text-amber-400",
    borderHover: "hover:border-amber-500/40",
    shadowHover: "hover:shadow-[0_8px_30px_rgba(251,191,36,0.12)]",
    dotColor: "bg-amber-400",
    glowColor: "rgba(251, 191, 36, 0.15)",
  },
  {
    num: "05",
    name: "SOTA",
    label: "State of the Art",
    desc: "32 validated patterns. The best of everything, proven.",
    count: "32",
    // Purple tier
    numColor: "text-violet-400",
    borderHover: "hover:border-violet-500/40",
    shadowHover: "hover:shadow-[0_8px_30px_rgba(167,139,250,0.12)]",
    dotColor: "bg-violet-400",
    glowColor: "rgba(167, 139, 250, 0.15)",
  },
];

export default function PipelineExperiment() {
  useDataReveal({ threshold: 0.15 });

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 py-24">
      <div className="max-w-6xl mx-auto px-6 w-full">

        {/* Title */}
        <div className="text-center mb-16" data-reveal>
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-3">
            5-Layer Knowledge Pipeline
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            From raw source to agent-ready
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Every piece of knowledge is absorbed, validated, and earned
            before it reaches your agent.
          </p>
        </div>

        {/* Ice paths with color gradient */}
        <div className="relative mb-6" data-reveal data-reveal-delay="1">
          <svg
            className="w-full h-20 sm:h-28"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="25%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="75%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="pipeline-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.08" />
                <stop offset="25%" stopColor="#34d399" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.08" />
                <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            {/* Glow path */}
            <path
              d="M 0 50 Q 150 20, 300 50 T 600 50 T 1000 50"
              fill="none"
              stroke="url(#pipeline-glow)"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Main path */}
            <path
              d="M 0 50 Q 150 20, 300 50 T 600 50 T 1000 50"
              fill="none"
              stroke="url(#pipeline-gradient)"
              strokeWidth="2.5"
              opacity="0.6"
              strokeLinecap="round"
              className="animate-draw-path"
              style={{ animationDuration: "2s" }}
            />
            {/* Dashed center */}
            <path
              d="M 0 50 Q 150 20, 300 50 T 600 50 T 1000 50"
              fill="none"
              stroke="url(#pipeline-gradient)"
              strokeWidth="1"
              opacity="0.2"
              strokeDasharray="6 14"
              strokeLinecap="round"
              className="animate-draw-path"
              style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}
            />
          </svg>

          {/* Skiing penguins along the path */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 32}%`,
                top: `${20 + (i % 2) * 20}%`,
                animation: `penguin-slide ${3.5 + i * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 1.2}s`,
              }}
            >
              <SkiingPenguinSVG
                className="w-7 h-7 sm:w-10 sm:h-10 opacity-50"
                flip={i % 2 === 1}
              />
            </div>
          ))}
        </div>

        {/* Stage cards — 5 columns with tier colors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {stages.map((stage, idx) => (
            <div
              key={stage.name}
              data-reveal
              data-reveal-delay={String(idx + 1)}
              className={`group relative bg-penguin-surface/60 backdrop-blur-sm border border-penguin-border rounded-xl p-4 sm:p-5 text-center
                         transition-all duration-300 ${stage.borderHover} hover:-translate-y-1
                         ${stage.shadowHover}`}
            >
              {/* Tier color dot */}
              <div className="flex items-center justify-center mb-3">
                <div className={`w-2 h-2 rounded-full ${stage.dotColor}`}
                  style={{ boxShadow: `0 0 8px ${stage.glowColor}` }}
                />
              </div>

              {/* Step number */}
              <div className={`text-xs font-mono ${stage.numColor} mb-1 opacity-60`}>
                {stage.num}
              </div>

              {/* Name */}
              <h3 className="font-semibold text-white text-sm sm:text-base mb-0.5">
                {stage.name}
              </h3>

              {/* Count */}
              <div className={`text-lg sm:text-xl font-bold font-mono ${stage.numColor} mb-1`}>
                {stage.count}
              </div>

              {/* Label */}
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
                {stage.label}
              </p>

              {/* Description */}
              <p className="text-xs leading-relaxed text-gray-400">
                {stage.desc}
              </p>

              {/* Bottom glow line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to right, transparent, ${stage.glowColor}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Summary line */}
        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-600 font-mono" data-reveal>
          <div className="w-8 h-px bg-gray-800" />
          <span>∞ sources → 32 validated patterns</span>
          <div className="w-8 h-px bg-gray-800" />
        </div>

      </div>

      {/* Back to sandbox */}
      <div className="fixed bottom-6 left-6">
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
