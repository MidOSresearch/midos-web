"use client";

import { useEffect, useRef } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Pipeline v5 — Vertical flow + filled empty sides
 *
 * v4 feedback: "qué harías con los espacios vacíos, si los rellenarías
 *   con más información o con animaciones o personajes"
 *
 * v5: Empty spacer sides now contain contextual micro-insights:
 *   - Each stage's opposite side shows a brief insight/stat
 *   - Small floating dots echo the tier color
 *   - Transition arrows between stages on the empty side
 *   - The journey feels FULL, not alternating emptiness
 */

const stages = [
  {
    num: "01", name: "Staging", label: "Raw Sources",
    desc: "Everything enters here. Books, docs, repos, transcriptions. The raw material of knowledge.",
    count: "\u221E",
    insight: "376 books ingested, web harvests, Discord scrapes, video transcriptions",
    color: { r: 156, g: 163, b: 175, hex: "#9ca3af" },
    tw: { num: "text-gray-400", dot: "bg-gray-500", border: "hover:border-gray-500/40", shadow: "hover:shadow-[0_8px_30px_rgba(156,163,175,0.10)]", insight: "text-gray-600", insightBorder: "border-gray-800" },
  },
  {
    num: "02", name: "Chunks", label: "Knowledge",
    desc: "19K+ validated pieces. Docs, skills, patterns, research. Shaped and indexed.",
    count: "19,067",
    insight: "Each chunk: frontmatter, tags, confidence score, domain, access tier",
    color: { r: 52, g: 211, b: 153, hex: "#34d399" },
    tw: { num: "text-emerald-400", dot: "bg-emerald-400", border: "hover:border-emerald-500/40", shadow: "hover:shadow-[0_8px_30px_rgba(52,211,153,0.12)]", insight: "text-emerald-700", insightBorder: "border-emerald-900/30" },
  },
  {
    num: "03", name: "Dev", label: "Tools & Depth",
    desc: "400+ instruments. Semantic search. Agent handshake. Professional depth.",
    count: "413",
    insight: "Harvest, vector search, pipeline synergy, cost tracking, quality scoring",
    color: { r: 56, g: 189, b: 248, hex: "#38bdf8" },
    tw: { num: "text-sky-400", dot: "bg-sky-400", border: "hover:border-sky-500/40", shadow: "hover:shadow-[0_8px_30px_rgba(56,189,248,0.12)]", insight: "text-sky-700", insightBorder: "border-sky-900/30" },
  },
  {
    num: "04", name: "Truth", label: "Verified",
    desc: "47 truth patches. 236 EUREKA discoveries. Battle-tested and proven.",
    count: "283",
    insight: "What survived the fire. Patches, discoveries, proven under pressure",
    color: { r: 251, g: 191, b: 36, hex: "#fbbf24" },
    tw: { num: "text-amber-400", dot: "bg-amber-400", border: "hover:border-amber-500/40", shadow: "hover:shadow-[0_8px_30px_rgba(251,191,36,0.12)]", insight: "text-amber-700", insightBorder: "border-amber-900/30" },
  },
  {
    num: "05", name: "SOTA", label: "State of the Art",
    desc: "32 validated patterns. The best of everything. Earned, not given.",
    count: "32",
    insight: "Promoted from EUREKA. Highest confidence. The crown jewels",
    color: { r: 167, g: 139, b: 250, hex: "#a78bfa" },
    tw: { num: "text-violet-400", dot: "bg-violet-400", border: "hover:border-violet-500/40", shadow: "hover:shadow-[0_8px_30px_rgba(167,139,250,0.12)]", insight: "text-violet-700", insightBorder: "border-violet-900/30" },
  },
];

function lerpColor(t: number): { r: number; g: number; b: number } {
  const colors = stages.map(s => s.color);
  const scaled = t * (colors.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const a = colors[Math.min(i, colors.length - 1)];
  const b = colors[Math.min(i + 1, colors.length - 1)];
  return { r: a.r + (b.r - a.r) * f, g: a.g + (b.g - a.g) * f, b: a.b + (b.b - a.b) * f };
}

export default function PipelineExperiment() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useDataReveal({ threshold: 0.1 });

  // Particle drip animation along the vertical timeline
  useEffect(() => {
    const timeline = timelineRef.current;
    const canvas = canvasRef.current;
    if (!timeline || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles that drip down the center line
    const particleCount = 12;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      t: i / particleCount,
      speed: 0.0005 + Math.random() * 0.0005,
      size: 1.5 + Math.random() * 1.5,
      wobble: Math.random() * Math.PI * 2,
    }));

    let raf: number;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;

      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t -= 1;
        p.wobble += 0.02;

        const y = p.t * h;
        const wobbleX = Math.sin(p.wobble) * 3;
        const x = centerX + wobbleX;

        const col = lerpColor(p.t);
        const fadeIn = p.t < 0.05 ? p.t / 0.05 : 1;
        const fadeOut = p.t > 0.95 ? (1 - p.t) / 0.05 : 1;
        const alpha = fadeIn * fadeOut * 0.7;

        // Trail glow
        ctx.beginPath();
        ctx.arc(x, y, p.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},${alpha * 0.08})`;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},${alpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(x, y, p.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 py-24">
      <div className="max-w-4xl mx-auto px-6 w-full">

        {/* Title */}
        <div className="text-center mb-20" data-reveal>
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-3">
            5-Layer Knowledge Pipeline
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            From raw source to agent-ready
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Scroll down. Follow the path. Knowledge matures as it descends.
          </p>
        </div>

        {/* Vertical timeline */}
        <div ref={timelineRef} className="relative">

          {/* Central gradient line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, ${stages.map((s, i) => `${s.color.hex} ${(i / (stages.length - 1)) * 100}%`).join(", ")})`,
              opacity: 0.3,
            }}
          />

          {/* Central line glow */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, ${stages.map((s, i) => `${s.color.hex} ${(i / (stages.length - 1)) * 100}%`).join(", ")})`,
              opacity: 0.08,
              filter: "blur(4px)",
            }}
          />

          {/* Particle canvas overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          />

          {/* Stage cards — alternating left/right with insights on empty side */}
          <div className="relative z-10">
            {stages.map((stage, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={stage.name}
                  data-reveal
                  data-reveal-delay={String(idx)}
                  className={`flex items-center gap-6 mb-16 last:mb-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Card side */}
                  <div
                    className={`flex-1 group relative bg-penguin-surface/60 backdrop-blur-sm border border-penguin-border rounded-xl p-5 sm:p-6
                               transition-all duration-300 cursor-default ${stage.tw.border} ${stage.tw.shadow} hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${stage.tw.dot}`}
                        style={{ boxShadow: `0 0 8px rgba(${stage.color.r},${stage.color.g},${stage.color.b},0.3)` }}
                      />
                      <span className={`text-xs font-mono ${stage.tw.num} opacity-60`}>{stage.num}</span>
                      <h3 className="font-semibold text-white text-base">{stage.name}</h3>
                    </div>

                    <div className={`text-2xl font-bold font-mono ${stage.tw.num} mb-1`}>
                      {stage.count}
                    </div>

                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
                      {stage.label}
                    </p>

                    <p className="text-sm leading-relaxed text-gray-400">
                      {stage.desc}
                    </p>

                    {/* Bottom glow */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(to right, transparent, rgba(${stage.color.r},${stage.color.g},${stage.color.b},0.3), transparent)` }}
                    />
                  </div>

                  {/* Center node — on the timeline line */}
                  <div className="relative flex-shrink-0 w-8 flex justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${stage.tw.dot} z-10`}
                      style={{ boxShadow: `0 0 12px rgba(${stage.color.r},${stage.color.g},${stage.color.b},0.4)` }}
                    />
                  </div>

                  {/* Insight side (was empty spacer) */}
                  <div className="flex-1 flex items-center">
                    <div className={`w-full border-l-2 ${stage.tw.insightBorder} pl-4 py-2`}>
                      <p className={`text-[10px] font-mono uppercase tracking-widest ${stage.tw.insight} mb-1`}>
                        inside {stage.name.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {stage.insight}
                      </p>
                      {/* Tier transition arrow (not on last) */}
                      {idx < stages.length - 1 && (
                        <div className="mt-3 flex items-center gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: stage.color.hex, opacity: 0.4 }}
                          />
                          <span className="text-[9px] text-gray-700 font-mono">&#8595;</span>
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: stages[idx + 1].color.hex, opacity: 0.4 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 flex items-center justify-center gap-3 text-xs text-gray-600 font-mono" data-reveal>
          <div className="w-8 h-px bg-gray-800" />
          <span>&infin; sources &darr; 32 validated patterns</span>
          <div className="w-8 h-px bg-gray-800" />
        </div>

      </div>

      {/* Transition: Pipeline → Orchestrator */}
      <div className="py-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md" data-reveal>
          <p className="text-gray-400 text-base sm:text-lg leading-loose">
            Five layers, hundreds of tools.
          </p>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            Something has to keep them in&nbsp;sync.
          </p>
        </div>
      </div>

      {/* Back */}
      <div className="fixed bottom-6 left-6">
        <a href="/sandbox/pipeline" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          &larr; all pipeline versions
        </a>
      </div>
    </main>
  );
}
