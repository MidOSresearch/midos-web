"use client";

import Link from "next/link";

const sections = [
  {
    slug: "hero",
    title: "Hero",
    versions: 2,
    desc: "The first thing you see. Live topology canvas replaces static auroras. The product IS the background.",
  },
  {
    slug: "pipeline",
    title: "Pipeline",
    versions: 2,
    desc: "Vertical timeline — 5 tiers alternating left/right, gradient particles dripping down, insight panels.",
  },
  {
    slug: "orchestrator",
    title: "Orchestrator",
    versions: 3,
    desc: "The chameleon octopus. Two visual metaphors: organism (A) vs. architecture (B). Hub changes color on hover.",
  },
  {
    slug: "topology",
    title: "Topology",
    versions: 2,
    desc: "The constellation map. Tier-colored nodes, knowledge transfer pulses, mouse proximity glow.",
  },
  {
    slug: "colony",
    title: "Colony",
    versions: 2,
    desc: "12 penguins with unique idle animations — individual bob frequencies, sway angles, shadow pulses.",
  },
  {
    slug: "horizon",
    title: "Horizon",
    versions: 2,
    desc: "Hybrid aurora — CSS anchor layers for structure + canvas wisps for organic motion.",
  },
  {
    slug: "before-after",
    title: "Before / After",
    versions: 1,
    desc: "Split-screen terminal sim: agent without MidOS (chaos, 12K tokens, 8s) vs with MidOS (calm, 847 tokens, 0.3s).",
  },
  {
    slug: "pricing",
    title: "Pricing",
    versions: 1,
    desc: "Three tiers: Community ($0), Dev ($29/mo), Ops ($79/mo). Feature comparison, FAQ, market positioning.",
  },
  {
    slug: "graph",
    title: "Graph Viewer",
    versions: 1,
    desc: "Interactive architecture graph. Pan, zoom, click-to-inspect, filter chips. Canvas 2D, zero deps.",
  },
  {
    slug: "slope",
    title: "Slope Penguin",
    versions: 1,
    desc: "SVG path scroll follower — penguin rides down a curve as you scroll.",
  },
];

export default function SandboxIndex() {
  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Sandbox</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
            Each section of the MidOS landing page, isolated for review.
            Click a section to see all its versions, rate them with stars, and leave your comments.
            We iterate based on YOUR feedback.
          </p>
          <p className="text-midos-400/70 text-xs mt-3">
            {sections.length} sections, {sections.reduce((a, s) => a + s.versions, 0)} versions total
          </p>
        </div>

        {/* Section folders */}
        <div className="space-y-3">
          {sections.map((s) => (
            <Link
              key={s.slug}
              href={`/sandbox/${s.slug}`}
              className="group flex items-center gap-5 p-5 bg-penguin-surface/40 border border-penguin-border
                         rounded-xl transition-all duration-200 hover:border-midos-500/30
                         hover:shadow-[0_2px_16px_rgba(0,150,136,0.06)]"
            >
              {/* Folder icon */}
              <div className="shrink-0 w-10 h-10 rounded-lg bg-penguin-bg border border-penguin-border
                              flex items-center justify-center text-gray-600 group-hover:text-midos-400
                              group-hover:border-midos-500/30 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white group-hover:text-midos-300 transition-colors">
                    {s.title}
                  </h2>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {s.versions} version{s.versions > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate">{s.desc}</p>
              </div>

              {/* Arrow */}
              <span className="shrink-0 text-gray-700 group-hover:text-gray-400 transition-colors text-sm">
                &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Special links */}
        <div className="mt-10 pt-8 border-t border-penguin-border/30 space-y-3">
          <Link
            href="/sandbox/dashboard"
            className="group flex items-center gap-5 p-5 bg-penguin-surface/30 border border-penguin-border/60
                       rounded-xl transition-all duration-200 hover:border-teal-500/30
                       hover:shadow-[0_2px_20px_rgba(0,150,136,0.08)]"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-penguin-bg border border-penguin-border
                            flex items-center justify-center text-gray-600 group-hover:text-teal-400 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-white group-hover:text-teal-300 transition-colors">
                System Dashboard
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Live system status. Knowledge pipeline, community, security, infrastructure.</p>
            </div>
            <span className="shrink-0 text-gray-700 group-hover:text-gray-400 transition-colors text-sm">&rarr;</span>
          </Link>

          <Link
            href="/sandbox/journey"
            className="group flex items-center gap-5 p-5 bg-emerald-900/20 border border-emerald-500/30
                       rounded-xl transition-all duration-200 hover:border-emerald-400/50
                       hover:shadow-[0_2px_20px_rgba(52,211,153,0.12)]"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-penguin-bg border border-emerald-500/20
                            flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Full Journey
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">All 6 sections composed as one scroll. The conversion funnel.</p>
            </div>
            <span className="shrink-0 text-emerald-500/60 group-hover:text-emerald-400 transition-colors text-sm">&rarr;</span>
          </Link>

          <Link
            href="/sandbox/history"
            className="group flex items-center gap-5 p-5 bg-penguin-surface/30 border border-penguin-border/60
                       rounded-xl transition-all duration-200 hover:border-amber-500/30"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-penguin-bg border border-penguin-border
                            flex items-center justify-center text-gray-600 group-hover:text-amber-400 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">
                Version History
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Timeline of every iteration. See how far we came.</p>
            </div>
            <span className="shrink-0 text-gray-700 group-hover:text-gray-400 transition-colors text-sm">&rarr;</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[11px] text-gray-700 italic">
            &ldquo;Del intercambio nace la creatividad.&rdquo;
          </p>
          <p className="text-[10px] text-gray-600 mt-2">
            Enter each section, view the versions, leave your feedback. We iterate together.
          </p>
        </div>
      </div>
    </main>
  );
}
