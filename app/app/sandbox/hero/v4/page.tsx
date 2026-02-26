"use client";

import { useEffect, useRef } from "react";
import { SkiingPenguinSVG } from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Hero v4 — Live topology canvas replaces static auroras
 *
 * v3: pipeline gradient text + 5 static aurora blobs
 * v4: LIVE mini-topology canvas as background (from 5-star topology)
 *   - Ambient network: fewer nodes (30), lower opacity, wider spread
 *   - Pipeline colors preserved in node network
 *   - Parallax scroll still works (canvas layer shifts)
 *   - Gradient text + content unchanged
 *   - "INCLUSO PODRÍA EMPEZAR ASÍ LA WEB" — user vision
 */

// Pipeline tier colors (rgb) — same as topology
const TIER_COLORS = [
  { r: 156, g: 163, b: 175 }, // gray (staging)
  { r: 52,  g: 211, b: 153 }, // green (chunks)
  { r: 56,  g: 189, b: 248 }, // blue (dev)
  { r: 251, g: 191, b: 36  }, // gold (truth)
  { r: 167, g: 139, b: 250 }, // purple (SOTA)
];

const TIER_WEIGHTS = [0.10, 0.35, 0.25, 0.18, 0.12];

function pickTier(): number {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < TIER_WEIGHTS.length; i++) {
    sum += TIER_WEIGHTS[i];
    if (r < sum) return i;
  }
  return 0;
}

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  depth: number;
  tier: number;
  phase: number;
}

export default function HeroV4() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useDataReveal({ threshold: 0.05 });

  // Mini-topology canvas — ambient background
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let scrollProgress = 0;
    let mouseX = -1000, mouseY = -1000;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse for subtle glow
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouseX = -1000; mouseY = -1000; };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Scroll parallax
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        scrollProgress = Math.max(0, Math.min(1, -rect.top / vh));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Create nodes — fewer, wider spread, ambient feel
    const nodeCount = 35;
    const connectionDistance = 160;

    const nodes: Node[] = Array.from({ length: nodeCount }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * (w || 1200),
        y: Math.random() * (h || 800),
        vx: (Math.random() - 0.5) * (0.12 + depth * 0.08),
        vy: (Math.random() - 0.5) * (0.12 + depth * 0.08),
        r: 1.2 + (1 - depth) * 2,
        depth,
        tier: pickTier(),
        phase: Math.random() * Math.PI * 2,
      };
    });

    let raf: number;
    let time = 0;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Scroll-driven vertical offset for parallax feel
      const yOffset = scrollProgress * -60;

      // Update positions
      nodes.forEach(n => {
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < -30) n.x = w + 30;
        if (n.x > w + 30) n.x = -30;
        if (n.y < -30) n.y = h + 30;
        if (n.y > h + 30) n.y = -30;
      });

      // Draw connections — more subtle than topology page
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i], nj = nodes[j];
          const dy1 = ni.y + yOffset * (1 - ni.depth);
          const dy2 = nj.y + yOffset * (1 - nj.depth);
          const dx = ni.x - nj.x, dy = dy1 - dy2;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < connectionDistance) {
            const fade = 1 - d / connectionDistance;
            const avgDepth = (ni.depth + nj.depth) / 2;
            // Lower base alpha than topology — this is ambient background
            const baseAlpha = fade * (0.02 + (1 - avgDepth) * 0.05);

            const ci = TIER_COLORS[ni.tier], cj = TIER_COLORS[nj.tier];
            const mr = (ci.r + cj.r) / 2, mg = (ci.g + cj.g) / 2, mb = (ci.b + cj.b) / 2;

            ctx.beginPath();
            ctx.moveTo(ni.x, dy1);
            ctx.lineTo(nj.x, dy2);
            ctx.strokeStyle = `rgba(${mr},${mg},${mb},${baseAlpha})`;
            ctx.lineWidth = 0.4 + (1 - avgDepth) * 0.4;
            ctx.stroke();

            // Subtle pulse along connections
            if (!prefersReduced && fade > 0.4) {
              const pulseT = (time * 0.3 + i * 0.1 + j * 0.05) % 1;
              const px = ni.x + (nj.x - ni.x) * pulseT;
              const py = dy1 + (dy2 - dy1) * pulseT;
              const pulseAlpha = baseAlpha * 1.5 * Math.sin(pulseT * Math.PI);

              if (pulseAlpha > 0.008) {
                ctx.beginPath();
                ctx.arc(px, py, 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${mr},${mg},${mb},${pulseAlpha})`;
                ctx.fill();
              }
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const c = TIER_COLORS[n.tier];
        const yPos = n.y + yOffset * (1 - n.depth);
        const breath = prefersReduced ? 0.5 : 0.4 + Math.sin(time * 1.2 + n.phase) * 0.2;
        const depthAlpha = 0.10 + (1 - n.depth) * 0.35;
        const alpha = depthAlpha * (0.5 + breath);

        // Mouse proximity — subtle since this is background
        const mouseDist = Math.sqrt((n.x - mouseX) ** 2 + (yPos - mouseY) ** 2);
        const mouseBoost = mouseDist < 150 ? (1 - mouseDist / 150) * 0.3 : 0;

        const finalAlpha = Math.min(0.7, alpha + mouseBoost);
        const finalR = n.r * (1 + mouseBoost * 0.5);

        // Outer glow
        if (finalAlpha > 0.15) {
          ctx.beginPath();
          ctx.arc(n.x, yPos, finalR * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha * 0.05})`;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, yPos, finalR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha})`;
        ctx.fill();

        // Star center
        if (finalAlpha > 0.3) {
          ctx.beginPath();
          ctx.arc(n.x, yPos, finalR * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(finalAlpha - 0.2) * 0.2})`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="bg-penguin-bg text-gray-100">
      {/* Pipeline gradient keyframes */}
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
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* LIVE topology canvas — replaces static aurora blobs */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
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
              <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-penguin-surface/80 backdrop-blur-sm border border-penguin-border transition-all duration-300 group-hover:border-emerald-500/30 group-hover:shadow-[0_4px_24px_rgba(52,211,153,0.10)]">
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

      {/* Back link */}
      <div className="fixed bottom-6 left-6 z-50">
        <a href="/sandbox/hero" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">&larr; all hero versions</a>
      </div>
    </main>
  );
}
