"use client";
import { useEffect, useRef } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

const capabilities = [
  { title: "Research", desc: "Deep dives into any topic" },
  { title: "Tools", desc: "300+ instruments ready" },
  { title: "Knowledge", desc: "21K+ validated chunks" },
  { title: "Community", desc: "Skills shared freely" },
];

export default function OrchestratorExperiment() {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse tracking spotlight
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

  useDataReveal({ threshold: 0.15 });

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 flex items-center py-24">
      <div className="max-w-5xl mx-auto px-6 w-full">
        {/* Title */}
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            One Mind, Many Hands
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            The orchestrator sees everything. Each tentacle reaches where it&apos;s needed.
          </p>
        </div>

        {/* Main container with spotlight */}
        <div
          ref={ref}
          className="relative bg-penguin-surface/60 border border-penguin-border rounded-2xl p-8 sm:p-12 overflow-hidden"
          style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
        >
          {/* Spotlight overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                "radial-gradient(circle 400px at var(--mx) var(--my), rgba(0,150,136,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Octopus */}
          <div className="flex justify-center mb-10" data-reveal="scale">
            <svg
              viewBox="0 0 200 200"
              className="w-40 h-40 sm:w-56 sm:h-56"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="oct-g" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#009688" />
                  <stop offset="100%" stopColor="#00695c" />
                </linearGradient>
              </defs>

              {/* 8 tentacles */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <path
                    key={i}
                    d={`M ${100 + Math.cos(rad) * 35} ${110 + Math.sin(rad) * 30} C ${100 + Math.cos(rad) * 60} ${110 + Math.sin(rad) * 55}, ${100 + Math.cos(rad) * 75} ${110 + Math.sin(rad) * 70}, ${100 + Math.cos(rad) * 85} ${110 + Math.sin(rad) * 80}`}
                    fill="none"
                    stroke="#4db6ac"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.6"
                    style={{
                      animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                );
              })}

              {/* Body */}
              <ellipse cx="100" cy="90" rx="40" ry="45" fill="url(#oct-g)" />

              {/* Eyes */}
              <circle cx="85" cy="85" r="7" fill="white" />
              <circle cx="115" cy="85" r="7" fill="white" />
              <circle cx="87" cy="85" r="4" fill="#0a1628" />
              <circle cx="117" cy="85" r="4" fill="#0a1628" />

              {/* Smile */}
              <path
                d="M 88 100 Q 100 112, 112 100"
                fill="none"
                stroke="#0a1628"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Capability cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => (
              <div
                key={cap.title}
                data-reveal
                className="group relative bg-penguin-surface/80 backdrop-blur-sm border border-penguin-border rounded-xl p-4 sm:p-5
                           transition-all duration-300 cursor-default
                           hover:border-midos-500/40 hover:-translate-y-2
                           hover:shadow-[0_12px_40px_rgba(0,150,136,0.2)]"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-midos-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <h3 className="font-semibold text-white text-base mb-1">
                    {cap.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back to sandbox link */}
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
