"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Journey — Full-scroll landing page composed of all 8 sandbox sections.
 *
 * Scroll philosophy: continuous unfolding, no hard breaks.
 * - All sections always mounted (next/dynamic handles code splitting)
 * - Each section fades in as it approaches viewport (CSS transition, no layout shift)
 * - No min-height forcing — sections size to their content in journey context
 * - SectionThread provides visual continuity between sections
 */

const Hero = dynamic(() => import("../hero/v5/page"), { ssr: false });
const BeforeAfter = dynamic(() => import("../before-after/page"), { ssr: false });
const Pipeline = dynamic(() => import("../pipeline/v5/page"), { ssr: false });
const Orchestrator = dynamic(() => import("../orchestrator/v4/page"), { ssr: false });
const Topology = dynamic(() => import("../topology/current/page"), { ssr: false });
const Colony = dynamic(() => import("../colony/v3/page"), { ssr: false });
const TierDemo = dynamic(() => import("../tier-demo/page"), { ssr: false });
const Pricing = dynamic(() => import("../pricing/page"), { ssr: false });
const Horizon = dynamic(() => import("../horizon/v4/page"), { ssr: false });

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        ${hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"}
        ${scrolled || mobileOpen ? "bg-penguin-bg/80 backdrop-blur-md border-b border-penguin-border/40 shadow-[0_2px_20px_rgba(0,0,0,0.3)]" : "bg-transparent"}`}
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

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-1.5 text-xs font-semibold rounded-lg
                       bg-emerald-600 hover:bg-emerald-500 text-white
                       shadow-[0_2px_12px_rgba(52,211,153,0.2)]
                       transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started
          </a>

          <button
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-penguin-border/30 bg-penguin-bg/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-3">
            <a
              href="#how-it-works"
              className="text-sm text-gray-400 hover:text-white transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-400 hover:text-white transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function SectionThread() {
  return (
    <div className="relative h-12 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
    </div>
  );
}

export default function JourneyPage() {
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
        /* Override viewport-based min-heights only — preserve content heights */
        .journey-section.compact main,
        .journey-section.compact section,
        .journey-section.compact > div > main,
        .journey-section.compact > div > section {
          min-height: 0 !important;
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
        }
        /* Flex containers that center content in full-viewport: undo justify-center stretching */
        .journey-section.compact [class*="min-h-screen"],
        .journey-section.compact [class*="min-h-\[100vh\]"] {
          min-height: 0 !important;
        }
        .journey-section.compact canvas {
          position: absolute !important;
          height: 100% !important;
        }
        .journey-section.compact {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .journey-section.compact.in-view {
          opacity: 1;
          transform: translateY(0);
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

      <div className="journey-section compact" style={{ minHeight: "90vh" }}>
        <Orchestrator />
      </div>

      <SectionThread />

      <div className="journey-section compact" style={{ minHeight: "90vh" }}>
        <Topology />
      </div>

      <SectionThread />

      <div className="journey-section compact">
        <Colony />
      </div>

      <SectionThread />

      <div className="journey-section compact">
        <TierDemo />
      </div>

      <SectionThread />

      <div className="journey-section compact" id="pricing">
        <Pricing />
      </div>

      <SectionThread />

      <div className="journey-section">
        <Horizon />
      </div>

      <footer className="bg-penguin-bg border-t border-penguin-border/30 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/MidOSresearch/midos-mcp" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://pypi.org/project/midos-mcp/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">PyPI</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-3">Community</h4>
              <ul className="space-y-2">
                <li><a href="https://discord.gg/midos" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-3">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:hello@midos.dev" className="text-sm text-gray-400 hover:text-white transition-colors">hello@midos.dev</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-penguin-border/20">
            <span className="text-sm font-bold text-white tracking-tight">MidOS</span>
            <span className="text-[11px] text-gray-600 mt-2 sm:mt-0">
              Community MCP Library
            </span>
          </div>
        </div>
      </footer>

      <SectionFadeObserver />
    </div>
  );
}

function SectionFadeObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(".journey-section.compact");
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.05 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
