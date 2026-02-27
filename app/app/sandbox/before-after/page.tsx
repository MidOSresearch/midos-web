"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Before/After — The pain of working without MidOS vs. the relief with it
 *
 * Visual concept: split-screen terminal simulation
 * LEFT (Before): chaotic agent searching the web, failing, retrying, burning tokens
 * RIGHT (After): calm agent querying MidOS, getting validated answers instantly
 *
 * The animation runs automatically — the visitor watches both agents work side by side.
 * The contrast sells itself.
 */

// Terminal line types
interface TermLine {
  text: string;
  type: "cmd" | "ok" | "warn" | "error" | "dim" | "result" | "midos";
  delay: number; // ms after previous line
}

const BEFORE_LINES: TermLine[] = [
  { text: "$ agent ask 'React 19 migration guide'", type: "cmd", delay: 0 },
  { text: "Searching web...", type: "dim", delay: 600 },
  { text: "Found 2,847 results (0.43s)", type: "dim", delay: 1400 },
  { text: "Parsing stackoverflow.com/q/78234...", type: "dim", delay: 800 },
  { text: "  \u26a0 Answer from 2024 \u2014 may be outdated", type: "warn", delay: 600 },
  { text: "Parsing medium.com/react-19-guide...", type: "dim", delay: 900 },
  { text: "  \u2718 Paywall hit. Skipping.", type: "error", delay: 500 },
  { text: "Parsing dev.to/react-migration...", type: "dim", delay: 700 },
  { text: "  \u26a0 Contradicts previous source", type: "warn", delay: 600 },
  { text: "Trying reactjs.org/blog...", type: "dim", delay: 1000 },
  { text: "  \u2718 404 \u2014 URL changed", type: "error", delay: 400 },
  { text: "Synthesizing from 3 partial sources...", type: "dim", delay: 1200 },
  { text: "  \u26a0 Low confidence: sources disagree", type: "warn", delay: 500 },
  { text: "Tokens used: 12,340", type: "error", delay: 300 },
  { text: "Time: 8.2s", type: "error", delay: 200 },
  { text: "", type: "dim", delay: 400 },
  { text: "Result: 'React 19 introduces use() hook...", type: "result", delay: 600 },
  { text: "  maybe... probably... check the docs'", type: "warn", delay: 400 },
];

const AFTER_LINES: TermLine[] = [
  { text: "$ midos search 'React 19 migration'", type: "cmd", delay: 0 },
  { text: "Querying MidOS knowledge base...", type: "midos", delay: 600 },
  { text: "\u2714 Found: react_19_migration_guide_20260115.md", type: "ok", delay: 400 },
  { text: "  Confidence: 0.94 | Layer: EUREKA", type: "ok", delay: 200 },
  { text: "  Validated: 3 truth patches applied", type: "ok", delay: 200 },
  { text: "", type: "dim", delay: 300 },
  { text: "Result:", type: "midos", delay: 200 },
  { text: "  1. Replace PropTypes \u2192 TypeScript", type: "result", delay: 150 },
  { text: "  2. forwardRef \u2192 ref as prop", type: "result", delay: 150 },
  { text: "  3. useContext \u2192 use(Context)", type: "result", delay: 150 },
  { text: "  4. Suspense boundaries for async", type: "result", delay: 150 },
  { text: "  5. Server Components: 'use server'", type: "result", delay: 150 },
  { text: "", type: "dim", delay: 200 },
  { text: "  + 12 related skills available", type: "ok", delay: 300 },
  { text: "  + 3 truth patches (edge cases)", type: "ok", delay: 200 },
  { text: "", type: "dim", delay: 200 },
  { text: "Tokens used: 847", type: "ok", delay: 200 },
  { text: "Time: 0.3s", type: "ok", delay: 150 },
];

// Color map for terminal line types
const TYPE_COLORS: Record<TermLine["type"], string> = {
  cmd: "text-white",
  ok: "text-emerald-400",
  warn: "text-amber-400",
  error: "text-red-400",
  dim: "text-gray-600",
  result: "text-gray-300",
  midos: "text-emerald-300",
};

function useTerminalAnimation(lines: TermLine[], startDelay: number) {
  const [visible, setVisible] = useState<number>(0);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    setVisible(0);
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let timeout: ReturnType<typeof setTimeout>;
    let current = 0;

    const showNext = () => {
      if (current >= lines.length) {
        // Loop after pause
        timeout = setTimeout(() => {
          setVisible(0);
          current = 0;
          timeout = setTimeout(showNext, 1000);
        }, 4000);
        return;
      }
      const delay = current === 0 ? startDelay : lines[current].delay;
      timeout = setTimeout(() => {
        current++;
        setVisible(current);
        showNext();
      }, delay);
    };

    showNext();

    return () => clearTimeout(timeout);
  }, [started, lines, startDelay]);

  return { visible, start };
}

// Chaos canvas — random floating error fragments, red/amber particles
function ChaosCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    // Floating error fragments
    const fragments = Array.from({ length: 20 }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 2,
      color: Math.random() > 0.5 ? "239,68,68" : "251,191,36", // red or amber
      alpha: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);

      fragments.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        f.phase += 0.02;

        // Wrap
        if (f.x < 0) f.x = w;
        if (f.x > w) f.x = 0;
        if (f.y < 0) f.y = h;
        if (f.y > h) f.y = 0;

        const flicker = 0.5 + Math.sin(f.phase) * 0.5;
        const a = f.alpha * flicker;

        // Glow
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${f.color},${a * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${f.color},${a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);

  return null;
}

// Order canvas — calm emerald particles flowing downward
function OrderCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    // Calm downward-flowing particles
    const particles = Array.from({ length: 15 }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      vy: 0.15 + Math.random() * 0.2,
      size: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.y += p.vy;
        p.phase += 0.01;
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }

        const pulse = 0.7 + Math.sin(p.phase) * 0.3;
        const a = p.alpha * pulse;

        // Soft trail
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,211,153,${a * 0.12})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,211,153,${a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);

  return null;
}

export default function BeforeAfterPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const chaosCanvasRef = useRef<HTMLCanvasElement>(null);
  const orderCanvasRef = useRef<HTMLCanvasElement>(null);

  useDataReveal({ threshold: 0.1 });

  const before = useTerminalAnimation(BEFORE_LINES, 800);
  const after = useTerminalAnimation(AFTER_LINES, 2400);

  // Start animations when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          before.start();
          after.start();
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, [before, after]);

  return (
    <main className="bg-penguin-bg text-gray-100">
      <section
        ref={sectionRef}
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24"
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-2xl" data-reveal>
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-4">
            The Difference
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-5">
            Your agent, with and without a&nbsp;library
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Same question. Same agent.
            <span className="text-gray-300 font-medium"> Different&nbsp;source.</span>
          </p>
        </div>

        {/* Split terminals */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6" data-reveal data-reveal-delay="1">

          {/* BEFORE — chaos */}
          <div className="relative rounded-2xl overflow-hidden border border-red-900/20 bg-[#0c0a0a]">
            {/* Chaos background */}
            <canvas
              ref={chaosCanvasRef}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            <ChaosCanvas canvasRef={chaosCanvasRef} />

            {/* Terminal chrome */}
            <div className="relative z-10">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-red-900/15 bg-red-950/30">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-700/30" />
                  </div>
                  <span className="text-[10px] font-mono text-red-400/50 uppercase tracking-[0.15em] ml-1">
                    Without MidOS
                  </span>
                </div>
                <span className="text-[9px] font-mono text-red-400/30">web search</span>
              </div>

              {/* Terminal body */}
              <div className="px-4 sm:px-5 py-4 sm:py-5 font-mono text-[11px] sm:text-[13px] leading-[1.7] min-h-[360px] sm:min-h-[400px]">
                {BEFORE_LINES.slice(0, before.visible).map((line, i) => (
                  <div
                    key={i}
                    className={`${TYPE_COLORS[line.type]} ${line.text === "" ? "h-3.5" : ""} ${line.text.startsWith("  ") ? "pl-4" : ""}`}
                    style={{ animation: "fadeIn 0.2s ease-out" }}
                  >
                    {line.text.trimStart()}
                  </div>
                ))}
                {before.visible < BEFORE_LINES.length && before.visible > 0 && (
                  <span className="inline-block w-1.5 h-4 bg-red-400/50 animate-pulse mt-0.5" />
                )}
              </div>

              {/* Bottom status bar */}
              {before.visible >= BEFORE_LINES.length && (
                <div className="px-4 sm:px-5 py-2.5 border-t border-red-900/15 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-red-400/40 uppercase tracking-wider">3 sources, 0 reliable</span>
                  <span className="text-[9px] font-mono text-red-400/50">8.2s</span>
                </div>
              )}
            </div>
          </div>

          {/* AFTER — order */}
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/25 bg-[#060f0a] shadow-[0_0_60px_rgba(52,211,153,0.04)]">
            {/* Order background */}
            <canvas
              ref={orderCanvasRef}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            <OrderCanvas canvasRef={orderCanvasRef} />

            {/* Terminal chrome */}
            <div className="relative z-10">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-emerald-500/10 bg-emerald-950/30">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/45" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/25" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-[0.15em] ml-1 font-semibold">
                    With MidOS
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400/40">knowledge base</span>
              </div>

              {/* Terminal body */}
              <div className="px-4 sm:px-5 py-4 sm:py-5 font-mono text-[11px] sm:text-[13px] leading-[1.7] min-h-[360px] sm:min-h-[400px]">
                {AFTER_LINES.slice(0, after.visible).map((line, i) => (
                  <div
                    key={i}
                    className={`${TYPE_COLORS[line.type]} ${line.text === "" ? "h-3.5" : ""} ${line.text.startsWith("  ") ? "pl-4" : ""}`}
                    style={{ animation: "fadeIn 0.2s ease-out" }}
                  >
                    {line.text.trimStart()}
                  </div>
                ))}
                {after.visible < AFTER_LINES.length && after.visible > 0 && (
                  <span className="inline-block w-1.5 h-4 bg-emerald-400/50 animate-pulse mt-0.5" />
                )}
              </div>

              {/* Bottom status bar */}
              {after.visible >= AFTER_LINES.length && (
                <div className="px-4 sm:px-5 py-2.5 border-t border-emerald-500/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-emerald-400/50 uppercase tracking-wider">1 source, validated</span>
                  <span className="text-[9px] font-mono text-emerald-400/60">0.3s</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison stats — numbers as heroes */}
        <div
          className="mt-12 sm:mt-16 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5"
          data-reveal
          data-reveal-delay="3"
        >
          {[
            { label: "Tokens", before: "12,340", after: "847", improvement: "14x less", color: "text-emerald-400", hoverBorder: "hover:border-emerald-500/25", hoverShadow: "hover:shadow-[0_8px_30px_rgba(52,211,153,0.06)]" },
            { label: "Time", before: "8.2s", after: "0.3s", improvement: "27x faster", color: "text-sky-400", hoverBorder: "hover:border-sky-500/25", hoverShadow: "hover:shadow-[0_8px_30px_rgba(56,189,248,0.06)]" },
            { label: "Sources", before: "3 partial", after: "1", improvement: "Validated", color: "text-amber-400", hoverBorder: "hover:border-amber-500/25", hoverShadow: "hover:shadow-[0_8px_30px_rgba(251,191,36,0.06)]" },
            { label: "Confidence", before: "Low", after: "0.94", improvement: "Verified", color: "text-violet-400", hoverBorder: "hover:border-violet-500/25", hoverShadow: "hover:shadow-[0_8px_30px_rgba(167,139,250,0.06)]" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-penguin-surface/30 border border-penguin-border rounded-xl p-4 sm:p-5 text-center
                         transition-all duration-300 hover:-translate-y-1 ${stat.hoverBorder} ${stat.hoverShadow}`}
            >
              {/* Label whisper */}
              <div className="text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-3">
                {stat.label}
              </div>
              {/* Hero number */}
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${stat.color} mb-1.5`}>
                {stat.after}
              </div>
              {/* Ghost "before" */}
              <div className="text-[10px] font-mono text-red-400/40 line-through mb-2">
                was {stat.before}
              </div>
              {/* Improvement badge */}
              <div className={`inline-block text-[9px] font-semibold uppercase tracking-wider ${stat.color} opacity-70`}>
                {stat.improvement}
              </div>
            </div>
          ))}
        </div>

        {/* Closing line — the line that stays with you */}
        <div className="mt-12 sm:mt-16 text-center" data-reveal data-reveal-delay="4">
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            Your agent already knows how to ask.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            MidOS gives it somewhere worth&nbsp;asking.
          </p>
        </div>
      </section>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Back */}
      <div className="fixed bottom-6 left-6 z-50">
        <a href="/sandbox" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          &larr; sandbox
        </a>
      </div>
    </main>
  );
}
