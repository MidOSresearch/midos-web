"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * midos.dev — Public landing page.
 * Conversion funnel: Hook → Pain → Trust → Value → Scale → Community → Pricing → CTA
 */

const Hero = dynamic(() => import("./sandbox/hero/v5/page"), { ssr: false });
const BeforeAfter = dynamic(() => import("./sandbox/before-after/page"), { ssr: false });
const Pipeline = dynamic(() => import("./sandbox/pipeline/v5/page"), { ssr: false });
const Orchestrator = dynamic(() => import("./sandbox/orchestrator/v4/page"), { ssr: false });
const Topology = dynamic(() => import("./sandbox/topology/current/page"), { ssr: false });
const Colony = dynamic(() => import("./sandbox/colony/v3/page"), { ssr: false });
const Pricing = dynamic(() => import("./sandbox/pricing/page"), { ssr: false });
const Horizon = dynamic(() => import("./sandbox/horizon/v4/page"), { ssr: false });

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY);
      setScrolled(y > 20);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${scrolled ? "bg-penguin-bg/80 backdrop-blur-md border-b border-penguin-border/40 shadow-[0_2px_20px_rgba(0,0,0,0.3)]" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            MidOS
          </span>
          <span className="text-[9px] font-mono text-gray-600 hidden sm:inline">
            MCP Library
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-6">
          <a href="#how-it-works" className="text-xs text-gray-400 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-xs text-gray-400 hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        <a
          href="/login"
          className="px-4 py-1.5 text-xs font-semibold rounded-lg
                     bg-emerald-600 hover:bg-emerald-500 text-white
                     shadow-[0_2px_12px_rgba(52,211,153,0.2)]
                     transition-all duration-200 hover:-translate-y-0.5"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}

function SectionThread() {
  return (
    <div className="relative h-16 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-penguin-bg text-gray-100 scroll-smooth">
      <Navbar />

      <style>{`
        .journey-section {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          z-index: 0;
        }
        .journey-section .fixed {
          position: absolute !important;
        }
        .journey-section a[href*="/sandbox"] {
          display: none !important;
        }
        /* Compress middle sections: allow natural height instead of forcing 100vh */
        .journey-section.compact main,
        .journey-section.compact section {
          min-height: auto !important;
        }
      `}</style>

      <div className="journey-section">
        <Hero />
      </div>

      <SectionThread />

      <div className="journey-section compact" id="how-it-works">
        <BeforeAfter />
      </div>

      <SectionThread />

      <div className="journey-section compact">
        <Pipeline />
      </div>

      <SectionThread />

      <div className="journey-section compact">
        <Orchestrator />
      </div>

      <SectionThread />

      <div className="journey-section compact">
        <Topology />
      </div>

      <SectionThread />

      <div className="journey-section compact">
        <Colony />
      </div>

      <SectionThread />

      <div className="journey-section compact" id="pricing">
        <Pricing />
      </div>

      <SectionThread />

      <div className="journey-section">
        <Horizon />
      </div>
    </div>
  );
}
