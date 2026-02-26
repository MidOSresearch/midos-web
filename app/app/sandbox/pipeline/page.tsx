"use client";

import { SkiingPenguinSVG } from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

const stages = [
  { num: "01", label: "Absorb", desc: "Take in the world" },
  { num: "02", label: "Transform", desc: "Find the essence" },
  { num: "03", label: "Validate", desc: "Keep what's true" },
  { num: "04", label: "Promote", desc: "Let it shine" },
];

export default function PipelineExperiment() {
  useDataReveal({ threshold: 0.15 });

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 flex items-center py-24">
      <div className="max-w-5xl mx-auto px-6 w-full">

        {/* Title */}
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            The Slide Begins
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Knowledge doesn&apos;t arrive polished. It gets absorbed, shaped, tested, and earned.
          </p>
        </div>

        {/* Ice paths + penguins */}
        <div className="relative mb-12" data-reveal data-reveal-delay="1">
          <svg
            className="w-full h-32 sm:h-48"
            viewBox="0 0 1000 150"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 0 30 Q 200 10, 350 60 T 650 40 T 1000 70"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="3"
              opacity="0.4"
              className="animate-draw-path"
              style={{ animationDuration: "2.5s" }}
            />
            <path
              d="M 0 60 Q 250 35, 400 85 T 700 65 T 1000 95"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2"
              opacity="0.25"
              className="animate-draw-path"
              style={{ animationDuration: "3s", animationDelay: "0.4s" }}
            />
          </svg>

          {/* Skiing penguins */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 28}%`,
                top: `${15 + i * 12}%`,
                animation: `penguin-slide ${3.5 + i * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 1}s`,
              }}
            >
              <SkiingPenguinSVG
                className="w-8 h-8 sm:w-12 sm:h-12 opacity-60"
                flip={i % 2 === 1}
              />
            </div>
          ))}
        </div>

        {/* Stage cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stages.map((stage, idx) => (
            <div
              key={stage.label}
              data-reveal
              data-reveal-delay={String(idx + 1)}
              className="group bg-penguin-surface/80 backdrop-blur-sm border border-penguin-border rounded-xl p-4 sm:p-5 text-center
                         transition-all duration-300 hover:border-midos-500/30 hover:-translate-y-1
                         hover:shadow-[0_8px_30px_rgba(0,150,136,0.15)]"
            >
              <div className="text-2xl font-bold text-midos-400 mb-1">{stage.num}</div>
              <h3 className="font-semibold text-white text-base mb-1">{stage.label}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{stage.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Back to sandbox */}
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
