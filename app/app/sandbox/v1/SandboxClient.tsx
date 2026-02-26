"use client";

import { useEffect, useRef, useState } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * V1: The Full Journey — all sandbox sections composed as one scroll story.
 *
 * Each section is an iframe of the live sandbox page, so it always renders
 * the latest version. Sections are separated by narrative transition cards
 * that explain the flow from one part to the next.
 *
 * The scroll IS the journey:
 *   Hero → Pipeline → Orchestrator → Topology → Colony → Horizon
 */

const sections = [
  {
    slug: "hero",
    title: "Hero",
    path: "/sandbox/hero/v4",
    narrative: "The first thing you see. Not a marketing banner — a living network. The product IS the background.",
    transition: "You've felt the pulse. Now follow where the knowledge goes.",
  },
  {
    slug: "pipeline",
    title: "Pipeline",
    path: "/sandbox/pipeline/v5",
    narrative: "Five layers of maturation. Raw sources enter at the top, validated patterns emerge at the bottom.",
    transition: "The pipeline needs a mind to coordinate it.",
  },
  {
    slug: "orchestrator",
    title: "Orchestrator",
    path: "/sandbox/orchestrator/v4",
    narrative: "The chameleon octopus. Eight tentacles, each a capability. It thinks in color — hover to see.",
    transition: "Now zoom out. See how everything connects.",
  },
  {
    slug: "topology",
    title: "Topology",
    path: "/sandbox/topology/current",
    narrative: "The constellation map. Every node is real data. Every connection earned. This is what MidOS looks like from above.",
    transition: "Behind every node, there's someone who built it.",
  },
  {
    slug: "colony",
    title: "Colony",
    path: "/sandbox/colony/v3",
    narrative: "Twelve penguins, each with a role. Researchers, builders, validators. A community in motion.",
    transition: "Where does it all lead?",
  },
  {
    slug: "horizon",
    title: "Horizon",
    path: "/sandbox/horizon/v4",
    narrative: "The aurora on the horizon. The CTA. Not an ending — a beginning.",
    transition: null,
  },
];

function TransitionCard({ text, index }: { text: string; index: number }) {
  return (
    <div
      className="flex items-center justify-center py-16 px-6"
      data-reveal
      data-reveal-delay={String(index)}
    >
      <div className="max-w-md text-center">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-700 to-transparent mx-auto mb-6" />
        <p className="text-sm text-gray-500 italic leading-relaxed">{text}</p>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-700 to-transparent mx-auto mt-6" />
      </div>
    </div>
  );
}

function SectionLabel({ title, narrative, index }: { title: string; narrative: string; index: number }) {
  return (
    <div
      className="text-center py-8 px-6"
      data-reveal
      data-reveal-delay={String(index)}
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">
        {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
      </span>
      <h3 className="text-xl font-bold text-white/80 mt-2 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">{narrative}</p>
    </div>
  );
}

export default function SandboxClient() {
  const [scrollProgress, setScrollProgress] = useState(0);
  useDataReveal({ rootMargin: "0px 0px -40px 0px" });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which section iframes are visible (lazy loading)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["hero"]));
  const observerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-section");
            if (slug) {
              setVisibleSections((prev) => new Set([...prev, slug]));
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observerRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative bg-penguin-bg text-gray-100 overflow-x-hidden">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-penguin-border/20">
        <div
          className="h-full transition-[width] duration-150"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(to right, #9ca3af, #34d399, #38bdf8, #fbbf24, #a78bfa)",
          }}
        />
      </div>

      {/* Section navigation (fixed right) */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3">
        {sections.map((s, i) => {
          const sectionProgress = i / (sections.length - 1);
          const isActive = Math.abs(scrollProgress - sectionProgress) < 0.1;
          return (
            <a
              key={s.slug}
              href={`#section-${s.slug}`}
              className="group flex items-center gap-2"
              title={s.title}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-2 h-2 bg-white" : "bg-gray-700 group-hover:bg-gray-500"
                }`}
              />
              <span
                className={`text-[9px] font-mono uppercase tracking-wider transition-opacity duration-300 ${
                  isActive ? "text-white/60 opacity-100" : "opacity-0 group-hover:opacity-100 text-gray-600"
                }`}
              >
                {s.title}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Journey header */}
      <div className="relative z-10 pt-20 pb-8 text-center px-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">
          MidOS Landing Page
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          The Full Journey
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
          Scroll down to experience each section as it would appear on the final site.
          Every animation is live. Every interaction works. This is the composition draft.
        </p>
        <div className="mt-8 text-gray-700 text-[10px] tracking-widest uppercase animate-pulse">
          scroll to begin
        </div>
      </div>

      {/* Sections */}
      <div className="relative z-10">
        {sections.map((section, idx) => (
          <div key={section.slug}>
            {/* Section label */}
            <SectionLabel title={section.title} narrative={section.narrative} index={idx} />

            {/* Iframe section */}
            <div
              id={`section-${section.slug}`}
              ref={(el) => { if (el) observerRefs.current.set(section.slug, el); }}
              data-section={section.slug}
              className="relative w-full border-y border-penguin-border/30"
              style={{ height: "100vh" }}
            >
              {visibleSections.has(section.slug) ? (
                <iframe
                  src={section.path}
                  title={section.title}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-700 text-xs font-mono">loading {section.title}...</span>
                </div>
              )}
            </div>

            {/* Transition card */}
            {section.transition && (
              <TransitionCard text={section.transition} index={idx} />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 py-20 text-center px-6 border-t border-penguin-border/20">
        <p className="text-gray-700 text-[10px] italic tracking-wide mb-4">
          del intercambio nace la creatividad
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <a href="/sandbox" className="hover:text-gray-400 transition-colors">&larr; sandbox index</a>
          <span className="text-gray-800">|</span>
          <span className="text-gray-700 font-mono text-[10px]">
            9 experiments, 4 feedback cycles, zero external libs
          </span>
        </div>
      </div>
    </main>
  );
}
