"use client";

import { useEffect, useRef } from "react";
import { PenguinSVG } from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Horizon v4 — Sharper aurora + floating wisps (hybrid)
 *
 * v3 feedback: "perdimos con tanta difuminación, más nítido, flotabilidad sensacional"
 * v4: Hybrid — CSS anchor layers for structure + canvas wisps for life
 *   - 3 CSS aurora anchors (smaller, less blur, more defined)
 *   - Canvas wisps: smaller, sharper gradient, brighter cores
 *   - Some wisps are elliptical for variety
 *   - Mouse still concentrates aurora
 *   - Not bland, not over-blurred — defined + floating
 */

const WISP_COLORS = [
  { r: 156, g: 163, b: 175 }, // gray
  { r: 52,  g: 211, b: 153 }, // green
  { r: 56,  g: 189, b: 248 }, // blue
  { r: 251, g: 191, b: 36  }, // gold
  { r: 167, g: 139, b: 250 }, // purple
];

interface Wisp {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  stretch: number; // 1=circle, >1=horizontal ellipse
  angle: number;   // rotation of ellipse
  color: number;
  life: number;
  maxLife: number;
  phase: number;
}

function spawnWisp(w: number, h: number): Wisp {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.15 - 0.08,
    size: 20 + Math.random() * 60,       // smaller than v3
    stretch: 1 + Math.random() * 0.8,    // some elliptical
    angle: Math.random() * Math.PI,
    color: Math.floor(Math.random() * WISP_COLORS.length),
    life: 0,
    maxLife: 5 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,
  };
}

export default function HorizonExperiment() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useDataReveal({ threshold: 0.05 });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let mouseX = 0.5, mouseY = 0.5;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };
    section.addEventListener("mousemove", onMouse);

    let scrollProgress = 0;
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

    const wispCount = 18;
    const wisps: Wisp[] = Array.from({ length: wispCount }, () => {
      const wisp = spawnWisp(w || 1200, h || 800);
      wisp.life = Math.random() * wisp.maxLife;
      return wisp;
    });

    let raf: number;
    const dt = 0.016;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);

      wisps.forEach((wisp, i) => {
        if (!prefersReduced) {
          wisp.life += dt;
          wisp.x += wisp.vx;
          wisp.y += wisp.vy;
          wisp.vx += (Math.random() - 0.5) * 0.008;
          wisp.vy += (Math.random() - 0.5) * 0.008;
          wisp.vx *= 0.997;
          wisp.vy *= 0.997;
          wisp.angle += 0.001; // slow rotation
        }

        const lifeRatio = wisp.life / wisp.maxLife;
        let alpha: number;
        if (lifeRatio < 0.12) {
          alpha = lifeRatio / 0.12;
        } else if (lifeRatio > 0.8) {
          alpha = (1 - lifeRatio) / 0.2;
        } else {
          alpha = 1;
        }

        const breath = 0.75 + Math.sin(wisp.life * 0.9 + wisp.phase) * 0.25;
        alpha *= breath;

        // Mouse boost
        const mdx = wisp.x / w - mouseX;
        const mdy = wisp.y / h - mouseY;
        const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const mouseBoost = mouseDist < 0.25 ? (1 - mouseDist / 0.25) * 0.5 : 0;

        // SHARPER: higher base alpha (0.15 vs 0.08), tighter gradient
        const finalAlpha = Math.max(0, Math.min(1, alpha * 0.15 + mouseBoost * 0.05));

        if (finalAlpha > 0.005) {
          const c = WISP_COLORS[wisp.color];
          const scrollY = scrollProgress * -30 * (1 - i / wispCount * 0.4);
          const wx = wisp.x;
          const wy = wisp.y + scrollY;

          ctx.save();
          ctx.translate(wx, wy);
          ctx.rotate(wisp.angle);
          ctx.scale(wisp.stretch, 1);

          // Sharper gradient: core visible, edge drops fast
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, wisp.size);
          grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${finalAlpha * 1.2})`);
          grad.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${finalAlpha * 0.6})`);
          grad.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${finalAlpha * 0.15})`);
          grad.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.arc(0, 0, wisp.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Bright core dot for definition
          if (finalAlpha > 0.05) {
            ctx.beginPath();
            ctx.arc(0, 0, wisp.size * 0.08, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha * 2})`;
            ctx.fill();
          }

          ctx.restore();
        }

        if (wisp.life >= wisp.maxLife) {
          Object.assign(wisp, spawnWisp(w, h));
        }
      });

      // Mouse spotlight
      const mxPx = mouseX * w;
      const myPx = mouseY * h;
      const spotGrad = ctx.createRadialGradient(mxPx, myPx, 0, mxPx, myPx, 160);
      spotGrad.addColorStop(0, "rgba(255,255,255,0.02)");
      spotGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(mxPx, myPx, 160, 0, Math.PI * 2);
      ctx.fillStyle = spotGrad;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="bg-penguin-bg text-gray-100">
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* CSS anchor layers — structure that wisps float around */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "15%", left: "5%",
            width: "35vw", height: "30vw",
            background: "radial-gradient(ellipse at 40% 40%, rgba(52,211,153,0.07) 0%, transparent 55%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "25%", right: "0%",
            width: "30vw", height: "35vw",
            background: "radial-gradient(ellipse at 60% 50%, rgba(56,189,248,0.06) 0%, transparent 55%)",
            filter: "blur(25px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            bottom: "15%", left: "20%",
            width: "35vw", height: "25vw",
            background: "radial-gradient(ellipse at 50% 60%, rgba(167,139,250,0.05) 0%, transparent 55%)",
            filter: "blur(28px)",
          }}
        />

        {/* Canvas wisps — floating, sharper, defined */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
          <PenguinSVG className="w-14 mx-auto mb-6 opacity-70" style={{ height: "72px" }} />

          <h2
            className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent"
            data-reveal
          >
            The Horizon
          </h2>

          <p className="text-gray-400 text-base sm:text-lg mb-4 leading-relaxed" data-reveal>
            Every journey starts with a single step.
          </p>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed" data-reveal data-reveal-delay="1">
            Every knowledge graph starts with a single node.
          </p>

          <div data-reveal data-reveal-delay="2">
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-lg
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(52,211,153,0.25)]
                         active:translate-y-0 active:shadow-none"
            >
              Start your journey
              <span className="animate-wave">&rarr;</span>
            </a>
          </div>

          <p
            className="text-gray-700 text-xs mt-20 tracking-wider"
            data-reveal
            data-reveal-delay="3"
          >
            se puede mejorar el mundo
          </p>
        </div>
      </section>

      {/* Back */}
      <div className="fixed bottom-6 left-6 z-50">
        <a href="/sandbox" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          &larr; sandbox
        </a>
      </div>
    </main>
  );
}
