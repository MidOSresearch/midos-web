"use client";

import { useEffect, useRef } from "react";
import { SkiingPenguinSVG } from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Hero v3 — Pipeline gradient title + aurora with all 5 tier colors
 *
 * v1 feedback: "needs pipeline gradient on MidOS letters, grab me like Antigravity"
 * Changes from v2:
 * - Title gradient: gray→green→blue→gold→purple (pipeline colors)
 * - Aurora layers now use ALL 5 pipeline colors
 * - Animated gradient shift on title (slow, subtle)
 * - Stronger presence, more depth
 * - Teaser section uses pipeline colors per word
 */

export default function HeroExperiment() {
  const sectionRef = useRef<HTMLElement>(null);
  useDataReveal({ threshold: 0.05 });

  // Scroll-driven parallax
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / vh));
        section.style.setProperty("--parallax", String(progress));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-penguin-bg text-gray-100">
      {/* Inline keyframes for the pipeline gradient animation */}
      <style>{`
        @keyframes pipeline-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .pipeline-text {
          background: linear-gradient(
            90deg,
            #9ca3af 0%,
            #34d399 20%,
            #38bdf8 40%,
            #fbbf24 65%,
            #a78bfa 85%,
            #9ca3af 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pipeline-shift 8s ease-in-out infinite;
        }
        @keyframes aurora-drift {
          0%, 100% { transform: translateY(calc(var(--parallax) * var(--speed))) scale(1); }
          50% { transform: translateY(calc(var(--parallax) * var(--speed))) scale(1.05); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ "--parallax": "0" } as React.CSSProperties}
      >
        {/* Aurora layer 1 — Gray (staging, top-center, very subtle) */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "0%",
            left: "30%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(ellipse at center, rgba(156, 163, 175, 0.06) 0%, transparent 70%)",
            filter: "blur(50px)",
            transform: "translateY(calc(var(--parallax) * -40px))",
            willChange: "transform",
          }}
        />

        {/* Aurora layer 2 — Green (chunks, top-left) */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "10%",
            left: "5%",
            width: "55vw",
            height: "55vw",
            background: "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translateY(calc(var(--parallax) * -80px))",
            willChange: "transform",
          }}
        />

        {/* Aurora layer 3 — Blue (dev, right) */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "25%",
            right: "0%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.09) 0%, transparent 70%)",
            filter: "blur(65px)",
            transform: "translateY(calc(var(--parallax) * -120px))",
            willChange: "transform",
          }}
        />

        {/* Aurora layer 4 — Gold (truth, bottom-left) */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            bottom: "15%",
            left: "10%",
            width: "45vw",
            height: "35vw",
            background: "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.06) 0%, transparent 70%)",
            filter: "blur(55px)",
            transform: "translateY(calc(var(--parallax) * -160px))",
            willChange: "transform",
          }}
        />

        {/* Aurora layer 5 — Purple (SOTA, bottom-right) */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            bottom: "5%",
            right: "15%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(ellipse at center, rgba(167, 139, 250, 0.07) 0%, transparent 70%)",
            filter: "blur(50px)",
            transform: "translateY(calc(var(--parallax) * -200px))",
            willChange: "transform",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div data-reveal className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-900/10 text-emerald-300 text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open Source MCP Library
            </span>
          </div>

          {/* Title — PIPELINE GRADIENT */}
          <h1
            data-reveal
            data-reveal-delay="1"
            className="pipeline-text text-7xl sm:text-9xl font-extrabold tracking-tight pb-2 leading-none"
          >
            MidOS
          </h1>

          {/* Tagline */}
          <p
            data-reveal
            data-reveal-delay="2"
            className="mt-5 text-xl sm:text-2xl text-gray-300 font-light leading-relaxed max-w-xl"
          >
            The knowledge library your AI agents were&nbsp;missing.
          </p>

          {/* Sub-tagline */}
          <p
            data-reveal
            data-reveal-delay="3"
            className="mt-3 text-sm sm:text-base text-gray-500 max-w-md leading-relaxed"
          >
            Skills, research, and tools — absorbed, validated, and served through one MCP&nbsp;server.
          </p>

          {/* Dual CTA */}
          <div
            data-reveal
            data-reveal-delay="4"
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            {/* Primary: install command */}
            <div className="group relative">
              <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-penguin-surface border border-penguin-border transition-all duration-300 group-hover:border-emerald-500/30 group-hover:shadow-[0_4px_24px_rgba(52,211,153,0.10)]">
                <span className="text-emerald-400 text-xs font-mono select-none">$</span>
                <code className="text-sm font-mono text-gray-200 select-all">pip install midos</code>
                <button
                  className="text-gray-600 hover:text-emerald-300 transition-colors text-xs"
                  title="Copy"
                  onClick={() => navigator.clipboard?.writeText("pip install midos")}
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25z"/>
                    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Secondary */}
            <a
              href="#explore"
              className="px-5 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              See how it works
              <span className="animate-wave">&rarr;</span>
            </a>
          </div>

          {/* Micro stats — each with its tier color */}
          <div
            data-reveal
            data-reveal-delay="4"
            className="mt-14 flex items-center gap-5 sm:gap-6 text-xs text-gray-600 flex-wrap justify-center"
          >
            <span>
              <strong className="text-emerald-400/80 font-semibold">21K+</strong> chunks
            </span>
            <span className="w-px h-3 bg-gray-800" />
            <span>
              <strong className="text-sky-400/80 font-semibold">300+</strong> tools
            </span>
            <span className="w-px h-3 bg-gray-800" />
            <span>
              <strong className="text-amber-400/80 font-semibold">118</strong> skills
            </span>
            <span className="w-px h-3 bg-gray-800" />
            <span>
              <strong className="text-violet-400/80 font-semibold">Open</strong> source
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 z-10">
          <SkiingPenguinSVG className="w-10 h-10 opacity-40 animate-float" />
          <span className="text-[10px] text-gray-600 tracking-[0.2em] uppercase">
            scroll to explore
          </span>
        </div>
      </section>

      {/* Teaser — pipeline colors per stage word */}
      <section
        id="explore"
        className="min-h-[60vh] flex items-center justify-center px-6"
      >
        <div className="text-center max-w-lg" data-reveal>
          <p className="text-gray-500 text-sm sm:text-base leading-loose">
            Knowledge doesn&apos;t arrive polished.
            <br />
            It gets{" "}
            <span className="text-gray-400 font-medium">absorbed</span>,{" "}
            <span className="text-emerald-400 font-medium">shaped</span>,{" "}
            <span className="text-sky-400 font-medium">deepened</span>,{" "}
            <span className="text-amber-400 font-medium">verified</span>,{" "}
            and{" "}
            <span className="text-violet-400 font-medium">earned</span>.
          </p>
        </div>
      </section>

      {/* Back to sandbox */}
      <div className="fixed bottom-6 left-6 z-50">
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
