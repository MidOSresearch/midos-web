"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  PenguinSVG,
  SkiingPenguinSVG,
  BookPenguinSVG,
  WrenchPenguinSVG,
  SledPenguinSVG,
  CoordinatorOctopusSVG,
  CaveSVG,
} from "@/lib/ui/characters";
import { useDataReveal, useCanvasTopology } from "@/lib/ui/hooks";

/* ═══════════════════════════════════════════
   Mountain silhouette for parallax background
   ═══════════════════════════════════════════ */

function MountainLayer({ opacity = 0.3, offset = 0, color = "#0f1d32" }: { opacity?: number; offset?: number; color?: string }) {
  return (
    <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none" style={{ opacity }} aria-hidden="true">
      <path
        d={`M 0 200 L 0 ${140 + offset} L 120 ${80 + offset} L 240 ${120 + offset} L 360 ${50 + offset} L 480 ${100 + offset} L 600 ${30 + offset} L 720 ${90 + offset} L 840 ${40 + offset} L 960 ${110 + offset} L 1080 ${60 + offset} L 1200 ${100 + offset} L 1320 ${45 + offset} L 1440 ${80 + offset} L 1440 200 Z`}
        fill={color}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Slope Path — The continuous descent
   ═══════════════════════════════════════════ */

const SLOPE_PATH = "M 50 0 C 50 150, 85 200, 85 350 C 85 500, 15 550, 15 700 C 15 850, 85 900, 85 1050 C 85 1200, 15 1250, 15 1400 C 15 1550, 50 1600, 50 1700";
const SLOPE_HEIGHT = 1700;

/* ═══════════════════════════════════════════
   Section Components — Caves along the descent
   ═══════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-1/2 opacity-30 animate-aurora"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(0,150,136,0.4) 0%, transparent 70%), " +
              "radial-gradient(ellipse 50% 60% at 80% 30%, rgba(99,102,241,0.3) 0%, transparent 70%), " +
              "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(168,85,247,0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 animate-shimmer">
          MidOS
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-4 animate-float" style={{ animationDelay: "0.5s" }}>
          Where knowledge flows like water
        </p>
        <p className="text-base text-gray-500 mb-12">
          Words and bridges. Building something that matters.
        </p>
        <div className="animate-float" style={{ animationDelay: "1s" }}>
          <SkiingPenguinSVG className="w-14 h-14 mx-auto opacity-60" />
          <p className="text-xs text-gray-600 mt-3 tracking-widest uppercase">scroll to descend</p>
        </div>
      </div>
    </section>
  );
}

function CaveSection({
  title,
  subtitle,
  caveLabel,
  enterCharacter,
  exitCharacter,
  children,
}: {
  title: string;
  subtitle: string;
  caveLabel: string;
  enterCharacter: React.ReactNode;
  exitCharacter: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden">
      {/* Cave entrance */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-40 sm:w-56 opacity-50" data-reveal>
        <CaveSVG label={caveLabel} />
        {/* Character entering */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-10 opacity-70 animate-float">
          {enterCharacter}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 w-full">
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-3" data-reveal>
          {title}
        </h2>
        <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto" data-reveal>
          {subtitle}
        </p>
        {children}
      </div>

      {/* Character exiting at bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-12 h-14 opacity-60" data-reveal>
        {exitCharacter}
      </div>
    </section>
  );
}

function PipelineContent() {
  return (
    <>
      {/* Ice slide paths */}
      <div className="relative mb-12">
        <svg className="w-full h-32 sm:h-48" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 0 30 Q 200 10, 350 60 T 650 40 T 1000 70"
            fill="none" stroke="#bae6fd" strokeWidth="3" opacity="0.4"
            className="animate-draw-path" style={{ animationDuration: "2.5s" }} />
          <path d="M 0 60 Q 250 35, 400 85 T 700 65 T 1000 95"
            fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.25"
            className="animate-draw-path" style={{ animationDuration: "3s", animationDelay: "0.4s" }} />
        </svg>
        {/* Skiing penguins on paths */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute" style={{
            left: `${15 + i * 28}%`, top: `${15 + i * 12}%`,
            animation: `penguin-slide ${3.5 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 1}s`,
          }}>
            <SkiingPenguinSVG className="w-8 h-8 sm:w-12 sm:h-12 opacity-60" flip={i % 2 === 1} />
          </div>
        ))}
      </div>

      {/* Pipeline stages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Absorb", desc: "Take in the world", num: "1" },
          { label: "Transform", desc: "Find the essence", num: "2" },
          { label: "Validate", desc: "Keep what\u2019s true", num: "3" },
          { label: "Promote", desc: "Let it shine", num: "4" },
        ].map((stage, i) => (
          <div key={stage.label}
            className="group bg-penguin-surface/80 backdrop-blur-sm border border-penguin-border rounded-xl p-4 sm:p-5 text-center
                       transition-all duration-300 hover:border-midos-500/30 hover:-translate-y-1
                       hover:shadow-[0_8px_30px_rgba(0,150,136,0.15)]"
            data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="text-2xl font-bold text-midos-400 mb-1">{stage.num}</div>
            <h3 className="font-semibold text-white text-base mb-1">{stage.label}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{stage.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function OrchestratorContent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("mousemove", handleMouse);
    return () => el.removeEventListener("mousemove", handleMouse);
  }, []);

  const capabilities = [
    { title: "Research", desc: "Deep dives into any topic" },
    { title: "Tools", desc: "300+ instruments ready" },
    { title: "Knowledge", desc: "21K+ validated chunks" },
    { title: "Community", desc: "Skills shared freely" },
  ];

  return (
    <div ref={ref} className="relative" style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}>
      {/* Spotlight */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: "radial-gradient(circle 400px at var(--mx) var(--my), rgba(0,150,136,0.06) 0%, transparent 70%)" }} />

      <div className="flex flex-col items-center">
        {/* Octopus */}
        <div className="mb-8" data-reveal="scale">
          <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-56 sm:h-56" aria-hidden="true">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <path key={i}
                  d={`M ${100 + Math.cos(rad) * 35} ${110 + Math.sin(rad) * 30} C ${100 + Math.cos(rad) * 60} ${110 + Math.sin(rad) * 55}, ${100 + Math.cos(rad) * 75} ${110 + Math.sin(rad) * 70}, ${100 + Math.cos(rad) * 85} ${110 + Math.sin(rad) * 80}`}
                  fill="none" stroke="#4db6ac" strokeWidth="4" strokeLinecap="round" opacity="0.6"
                  style={{ animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
              );
            })}
            <defs>
              <linearGradient id="oct-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#009688" /><stop offset="100%" stopColor="#00695c" />
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="90" rx="40" ry="45" fill="url(#oct-g)" />
            <circle cx="85" cy="85" r="7" fill="white" /><circle cx="115" cy="85" r="7" fill="white" />
            <circle cx="87" cy="85" r="4" fill="#0a1628" /><circle cx="117" cy="85" r="4" fill="#0a1628" />
            <path d="M 88 100 Q 100 112, 112 100" fill="none" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Capability cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
          {capabilities.map((cap, i) => (
            <div key={cap.title}
              className="group relative bg-penguin-surface/80 backdrop-blur-sm border border-penguin-border rounded-xl p-4 sm:p-5
                         transition-all duration-300 cursor-default
                         hover:border-midos-500/40 hover:-translate-y-2
                         hover:shadow-[0_12px_40px_rgba(0,150,136,0.2)]"
              data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-midos-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <h3 className="font-semibold text-white text-base mb-1">{cap.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopologyContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTopology(canvasRef);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" style={{ minHeight: 300 }} />
      <div className="relative z-10 text-center py-12">
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { num: "21K+", label: "Knowledge nodes" },
            { num: "168", label: "Discoveries" },
            { num: "∞", label: "Connections" },
          ].map((stat, i) => (
            <div key={stat.label} data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="text-3xl sm:text-4xl font-extrabold text-midos-400">{stat.num}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm italic max-w-md mx-auto" data-reveal>
          &ldquo;The world might not be ready for the technical truth.
          But they can feel it through motion.&rdquo;
        </p>
      </div>
    </div>
  );
}

function ColonyContent() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
            {i % 5 === 0 ? <SkiingPenguinSVG className="w-10 h-10 sm:w-12 sm:h-12 opacity-60 hover:opacity-100 transition-opacity" /> :
             i % 5 === 1 ? <BookPenguinSVG className="w-10 h-12 sm:w-12 sm:h-14 opacity-60 hover:opacity-100 transition-opacity" /> :
             i % 5 === 2 ? <WrenchPenguinSVG className="w-10 h-12 sm:w-12 sm:h-14 opacity-60 hover:opacity-100 transition-opacity" /> :
             i % 5 === 3 ? <SledPenguinSVG className="w-14 h-12 sm:w-16 sm:h-14 opacity-60 hover:opacity-100 transition-opacity" /> :
              <PenguinSVG className="w-8 h-10 sm:w-10 sm:h-12 opacity-50 hover:opacity-100 transition-all duration-300 hover:-translate-y-1" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { title: "Open", desc: "Knowledge shared freely" },
          { title: "Reliable", desc: "Validated, versioned, true" },
          { title: "Evolving", desc: "Better with every cycle" },
        ].map((val, i) => (
          <div key={val.title}
            className="bg-penguin-surface/60 backdrop-blur-sm border border-penguin-border/50 rounded-lg p-4
                       hover:border-midos-500/20 transition-colors duration-300"
            data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <h3 className="font-semibold text-midos-300 text-base">{val.title}</h3>
            <p className="text-sm leading-relaxed text-gray-400 mt-1">{val.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function HorizonSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-24">
      <div className="absolute inset-0 animate-aurora-morph opacity-15" style={{ filter: "blur(60px)" }} />
      <div className="relative z-10 text-center px-6">
        <PenguinSVG className="w-14 h-18 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl sm:text-5xl font-bold mb-4" data-reveal>The Horizon</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto" data-reveal>
          Every journey starts with a single step. Every knowledge graph starts with a single node.
        </p>
        <a href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 bg-midos-600 text-white font-semibold rounded-lg
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,150,136,0.3)]
                     active:translate-y-0 active:shadow-none"
          data-reveal>
          Start your journey
          <span className="animate-wave">→</span>
        </a>
        <p className="text-gray-700 text-xs mt-16" data-reveal>se puede mejorar el mundo</p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Parallax Background Layer
   ═══════════════════════════════════════════ */

function ParallaxBackground({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Far mountains — slow parallax */}
      <div style={{ transform: `translateY(${scrollProgress * -80}px)`, willChange: "transform" }}
        className="absolute bottom-0 w-full">
        <MountainLayer opacity={0.15} offset={20} color="#0d1829" />
      </div>
      {/* Mid mountains */}
      <div style={{ transform: `translateY(${scrollProgress * -150}px)`, willChange: "transform" }}
        className="absolute bottom-0 w-full">
        <MountainLayer opacity={0.1} offset={-10} color="#111f36" />
      </div>
      {/* Near mountains — faster parallax */}
      <div style={{ transform: `translateY(${scrollProgress * -220}px)`, willChange: "transform" }}
        className="absolute bottom-0 w-full">
        <MountainLayer opacity={0.08} offset={-30} color="#152238" />
      </div>

      {/* Slope path SVG — runs full height */}
      <svg className="absolute top-0 left-0 w-24 sm:w-32 opacity-[0.07]"
        viewBox={`0 0 100 ${SLOPE_HEIGHT}`} preserveAspectRatio="none"
        style={{ height: "500vh", transform: `translateY(${scrollProgress * -100}px)` }}>
        <path d={SLOPE_PATH} fill="none" stroke="#bae6fd" strokeWidth="2" />
        <path d={SLOPE_PATH} fill="none" stroke="#bae6fd" strokeWidth="8" opacity="0.3"
          strokeDasharray="4 20" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Fixed Coordinator Octopus
   ═══════════════════════════════════════════ */

function FixedCoordinator({ scrollProgress }: { scrollProgress: number }) {
  const tilt = Math.sin(scrollProgress * Math.PI * 2) * 5;
  const writing = scrollProgress > 0.1;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 transition-opacity duration-500"
      style={{ opacity: scrollProgress > 0.05 ? 0.8 : 0 }}>
      <div style={{ transform: `rotate(${tilt}deg)`, transition: "transform 0.3s ease" }}>
        <CoordinatorOctopusSVG className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>
      {writing && (
        <div className="text-[9px] text-midos-400/60 text-center mt-1 font-mono tracking-tight max-w-[80px] truncate">
          {scrollProgress < 0.25 ? "noting..." :
           scrollProgress < 0.5 ? "observing..." :
           scrollProgress < 0.75 ? "connecting..." : "complete!"}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Scroll Progress Indicator (left side slope)
   ═══════════════════════════════════════════ */

function ScrollProgressBar({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden sm:block"
      style={{ opacity: scrollProgress > 0.05 ? 0.5 : 0, transition: "opacity 0.5s" }}>
      <div className="relative w-1 h-40 bg-penguin-border/30 rounded-full overflow-hidden">
        <div className="absolute bottom-0 w-full bg-midos-500/60 rounded-full transition-all duration-150"
          style={{ height: `${scrollProgress * 100}%` }} />
      </div>
      {/* Mini penguin at progress point */}
      <div className="absolute left-3 transition-all duration-150"
        style={{ bottom: `${scrollProgress * 100}%`, transform: "translateY(50%)" }}>
        <PenguinSVG className="w-4 h-5 opacity-60" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Client Component
   ═══════════════════════════════════════════ */

export default function SandboxClient() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll tracking with rAF
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

  // data-reveal observer
  useDataReveal({ rootMargin: "0px 0px -40px 0px" });

  // Draw-path trigger
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.3 }
    );
    document.querySelectorAll(".animate-draw-path").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main className="relative bg-penguin-bg text-gray-100 overflow-x-hidden">
      {/* Parallax background */}
      <ParallaxBackground scrollProgress={scrollProgress} />

      {/* Fixed UI elements */}
      <FixedCoordinator scrollProgress={scrollProgress} />
      <ScrollProgressBar scrollProgress={scrollProgress} />

      {/* Content sections — the descent */}
      <div className="relative z-10">
        <HeroSection />

        <CaveSection
          title="The Slide Begins"
          subtitle="Knowledge doesn't sit still. It flows, transforms, and finds its place."
          caveLabel="PIPELINE"
          enterCharacter={<SkiingPenguinSVG className="w-full h-full" />}
          exitCharacter={<BookPenguinSVG className="w-full h-full" />}>
          <PipelineContent />
        </CaveSection>

        <CaveSection
          title="One Mind, Many Hands"
          subtitle="The orchestrator sees everything. Each tentacle reaches where it's needed."
          caveLabel="ORCHESTRATOR"
          enterCharacter={<BookPenguinSVG className="w-full h-full" />}
          exitCharacter={<WrenchPenguinSVG className="w-full h-full" />}>
          <OrchestratorContent />
        </CaveSection>

        <CaveSection
          title="Everything Connects"
          subtitle="Patterns emerge. Bridges form between ideas that never met before."
          caveLabel="TOPOLOGY"
          enterCharacter={<WrenchPenguinSVG className="w-full h-full" />}
          exitCharacter={<SledPenguinSVG className="w-full h-full" />}>
          <TopologyContent />
        </CaveSection>

        <CaveSection
          title="The Colony"
          subtitle="Built by many, for everyone. Each penguin finds its purpose."
          caveLabel="COMMUNITY"
          enterCharacter={<SledPenguinSVG className="w-full h-full" />}
          exitCharacter={<PenguinSVG className="w-full h-full" />}>
          <ColonyContent />
        </CaveSection>

        <HorizonSection />
      </div>
    </main>
  );
}
