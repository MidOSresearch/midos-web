"use client";

import Link from "next/link";

/**
 * Sandbox History — The evolution tree.
 *
 * Shows each experiment's version progression so the team can see
 * where we started, what changed at each iteration, and why.
 * Every version is clickable and renders live.
 */

const timeline = [
  {
    experiment: "Hero",
    current: "/sandbox/hero",
    rating: "5★ frozen",
    ratingColor: "text-emerald-400",
    versions: [
      {
        version: "v2",
        path: "/sandbox/versions/hero-v2",
        desc: "Static aurora radial-gradient blobs + shimmer text + floating penguin SVG.",
        change: "Starting point — pure CSS decoration, no interactivity.",
      },
      {
        version: "v3",
        path: null,
        desc: "Added floating particles, improved aurora layers.",
        change: "Incremental — still felt decorative, not alive.",
      },
      {
        version: "v4 (current)",
        path: "/sandbox/hero",
        desc: "Live Canvas 2D topology network as background. 35 nodes, tier-colored, mouse proximity glow, scroll parallax.",
        change: "Breakthrough: replaced decoration with the actual product. The network IS the hero.",
      },
    ],
  },
  {
    experiment: "Pipeline",
    current: "/sandbox/pipeline",
    rating: "4★ iterating",
    ratingColor: "text-amber-400",
    versions: [
      {
        version: "v2",
        path: "/sandbox/versions/pipeline-v2",
        desc: "Horizontal SVG ice slides + 4-column stage cards below.",
        change: "Path and cards felt disconnected — two separate things on the same page.",
      },
      {
        version: "v3",
        path: null,
        desc: "Attempted to merge SVG path with card layout.",
        change: "Feedback: 'falta conexion entre el slide y los elementos'.",
      },
      {
        version: "v4",
        path: null,
        desc: "Complete redesign: vertical timeline with alternating left/right cards, central gradient line, dripping particles.",
        change: "Layout revolution — knowledge flows DOWN. Cards connected to the central line.",
      },
      {
        version: "v5 (current)",
        path: "/sandbox/pipeline",
        desc: "Empty sides filled with contextual insight panels. Tier transition dots. 12 particles.",
        change: "Every side tells a story. Empty space = wasted narrative.",
      },
    ],
  },
  {
    experiment: "Orchestrator A",
    current: "/sandbox/orchestrator",
    rating: "3★ iterating",
    ratingColor: "text-amber-400",
    versions: [
      {
        version: "v1",
        path: "/sandbox/versions/orchestrator-v1",
        desc: "Static SVG octopus + 4 capability cards in a grid. Mouse spotlight effect.",
        change: "Starting point — the octopus was an illustration, not alive.",
      },
      {
        version: "v2",
        path: null,
        desc: "Canvas octopus with bezier tentacles, eyes following cursor, breathing body.",
        change: "It moved! But it was monochrome teal. Feedback: 'como son los pulpos — cambian de color'.",
      },
      {
        version: "v3",
        path: null,
        desc: "Chameleon body — chromatophore spots cycling through pipeline colors. Tentacles inherit body color.",
        change: "The octopus thinks in color. But only 4 tentacles, no purple, labels collided with paths.",
      },
      {
        version: "v4 (current)",
        path: "/sandbox/orchestrator",
        desc: "8 tentacles in a fan (left-to-right dendrite wheel). Hub ADOPTS hovered tentacle color. Larger tips with info panels. More volatility.",
        change: "Interactivity = understanding. Hover a tentacle → the whole body reacts. Purple is present. Info panels teach.",
      },
    ],
  },
  {
    experiment: "Orchestrator B",
    current: "/sandbox/orchestrator-b",
    rating: "0★ iterating",
    ratingColor: "text-gray-500",
    versions: [
      {
        version: "v1",
        path: null,
        desc: "Hub-and-spoke static layout — 8 nodes around a center point.",
        change: "Alternative concept: network architecture instead of biological organism.",
      },
      {
        version: "v2 (current)",
        path: "/sandbox/orchestrator-b",
        desc: "Animated hub: center expands nodes outward on proximity. Hover node → scale 2.4x + info panel. Hub adopts hovered node color.",
        change: "Two metaphors for Pulpo: A = organism, B = architecture. Different people learn differently.",
      },
    ],
  },
  {
    experiment: "Topology",
    current: "/sandbox/topology",
    rating: "5★ frozen",
    ratingColor: "text-emerald-400",
    versions: [
      {
        version: "v1",
        path: "/sandbox/versions/topology-v1",
        desc: "Early canvas node experiment — basic dots and lines.",
        change: "Proof of concept for Canvas 2D network rendering.",
      },
      {
        version: "v2+ (current)",
        path: "/sandbox/topology",
        desc: "Full constellation: 6 clusters with tier-colored nodes, knowledge transfer pulses, mouse proximity glow, floating stats, aurora quote breathing.",
        change: "AOTC. This is the reference implementation. Everything else aspires to this level.",
      },
    ],
  },
  {
    experiment: "Colony",
    current: "/sandbox/colony",
    rating: "4★ iterating",
    ratingColor: "text-amber-400",
    versions: [
      {
        version: "v1",
        path: "/sandbox/versions/colony-v1",
        desc: "12 penguin SVGs in a static grid. Hover → show name/role. 3 value cards below.",
        change: "Felt lifeless — penguins were frozen in place.",
      },
      {
        version: "v2",
        path: null,
        desc: "Added hover animations — scale up + translate on mouse over.",
        change: "Interactive but still static at rest. No sense of a living colony.",
      },
      {
        version: "v3 (current)",
        path: "/sandbox/colony",
        desc: "Continuous idle animations: unique penguin-bob keyframes per character (--bob-dur 2.4-3.5s, --sway degrees). Shadow pulses synced. Hover enhances on top of idle.",
        change: "Personality requires individuality. Each penguin has its own rhythm. CSS custom properties per element.",
      },
    ],
  },
  {
    experiment: "Horizon",
    current: "/sandbox/horizon",
    rating: "3★ iterating",
    ratingColor: "text-amber-400",
    versions: [
      {
        version: "v1",
        path: "/sandbox/versions/horizon-v1",
        desc: "CSS aurora morph + CTA button. Simple radial gradients with blur.",
        change: "Decorative but static. No sense of being at the edge of something.",
      },
      {
        version: "v3",
        path: null,
        desc: "Full canvas wisps — 24 particles with lifecycle (born → drift → fade → respawn).",
        change: "Feedback: 'perdimos con tanta difuminacion, necesitamos nitidez'.",
      },
      {
        version: "v4 (current)",
        path: "/sandbox/horizon",
        desc: "Hybrid: 3 CSS anchor layers (sharp shapes, 25-30px blur) + 18 canvas wisps (smaller, sharper gradients, elliptical). Mouse proximity boost.",
        change: "Blur without structure is noise. Sharpness + flotability. Not either/or — both.",
      },
    ],
  },
  {
    experiment: "Slope",
    current: "/sandbox/slope",
    rating: "4★ iterating",
    ratingColor: "text-amber-400",
    versions: [
      {
        version: "v1 (current)",
        path: "/sandbox/slope",
        desc: "SVG path scroll follower — penguin rides a curve as you scroll. Pipeline-colored path with gradient.",
        change: "Future convergence: merge with Pipeline scroll. The penguin GUIDES you through the knowledge tiers.",
      },
    ],
  },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 py-12 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-3xl font-bold">Version History</h1>
            <Link href="/sandbox" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              &larr; sandbox
            </Link>
          </div>

          <div className="bg-penguin-surface/30 border border-penguin-border rounded-xl p-5 space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">
              This page traces the evolution of each sandbox experiment.
              Every version is the result of a feedback cycle: build, rate, discuss, rebuild.
              Click any version to see it live. Versions without links existed as intermediate states
              that were overwritten during iteration.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600">
              <span>4 feedback cycles</span>
              <span className="text-gray-800">|</span>
              <span>~30 iterations total</span>
              <span className="text-gray-800">|</span>
              <span>0 external libraries</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-10">
          {timeline.map((exp) => (
            <div key={exp.experiment} className="relative">
              {/* Experiment header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-white">{exp.experiment}</h2>
                <span className={`text-xs font-mono ${exp.ratingColor}`}>{exp.rating}</span>
                <Link
                  href={exp.current}
                  className="ml-auto text-[10px] text-midos-400/60 hover:text-midos-400 transition-colors font-mono"
                >
                  view current &rarr;
                </Link>
              </div>

              {/* Version chain */}
              <div className="relative ml-4 border-l border-penguin-border/40 pl-6 space-y-4">
                {exp.versions.map((v, vi) => {
                  const isCurrent = vi === exp.versions.length - 1;
                  return (
                    <div key={v.version} className="relative">
                      {/* Dot on the line */}
                      <div
                        className={`absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                          isCurrent
                            ? "bg-midos-500 border-midos-500"
                            : "bg-penguin-bg border-gray-700"
                        }`}
                      />

                      <div
                        className={`bg-penguin-surface/40 border rounded-lg p-4 transition-colors ${
                          isCurrent
                            ? "border-midos-500/20"
                            : "border-penguin-border/30 hover:border-penguin-border/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-mono font-bold ${isCurrent ? "text-midos-400" : "text-gray-500"}`}>
                            {v.version}
                          </span>
                          {v.path && (
                            <Link
                              href={v.path}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-penguin-border/30 text-gray-500 hover:text-white hover:bg-midos-500/20 transition-colors"
                            >
                              view live
                            </Link>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-2">{v.desc}</p>
                        <p className="text-[10px] text-gray-600 italic border-l-2 border-midos-500/15 pl-2">
                          {v.change}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer insight */}
        <div className="mt-16 text-center border-t border-penguin-border/20 pt-8">
          <p className="text-gray-600 text-xs italic max-w-lg mx-auto">
            &ldquo;Del intercambio nace la creatividad.&rdquo;
            Each version exists because someone looked at the previous one and said
            &ldquo;this could be more alive.&rdquo; The constraint was always the same:
            zero libraries, Canvas 2D + CSS, pipeline colors.
            The discovery was that expression matters more than decoration.
          </p>
        </div>

      </div>
    </main>
  );
}
