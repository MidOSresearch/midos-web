"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Tier Demo — Same query, three depths
 *
 * Shows how Community, Dev, and Ops tiers return different
 * levels of knowledge for the exact same MCP call.
 * Typewriter animation reveals each response progressively.
 */

interface TierResponse {
  name: string;
  color: string;
  borderColor: string;
  bgColor: string;
  dotColor: string;
  label: string;
  lines: { text: string; type: "cmd" | "ok" | "dim" | "result" | "truncated" | "locked" }[];
}

const TIERS: TierResponse[] = [
  {
    name: "Community",
    color: "text-gray-400",
    borderColor: "border-gray-700/40",
    bgColor: "bg-[#0a0a0f]",
    dotColor: "bg-gray-500/50",
    label: "$0 / forever",
    lines: [
      { text: "$ midos search 'React 19 migration'", type: "cmd" },
      { text: "", type: "dim" },
      { text: "Found 14 results  (0.08s)", type: "ok" },
      { text: "", type: "dim" },
      { text: "1. react_19_migration_guide_20250115", type: "result" },
      { text: "   Breaking changes: PropTypes removed, forwar...", type: "truncated" },
      { text: "", type: "dim" },
      { text: "2. react_server_components_patterns_20250201", type: "result" },
      { text: "   Server Components now default. Key patter...", type: "truncated" },
      { text: "", type: "dim" },
      { text: "   Content truncated (250 chars) — upgrade for full access", type: "locked" },
    ],
  },
  {
    name: "Dev",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-[#060f0a]",
    dotColor: "bg-emerald-400",
    label: "$29 / mo",
    lines: [
      { text: "$ midos search 'React 19 migration'", type: "cmd" },
      { text: "", type: "dim" },
      { text: "Found 14 results  (0.08s)  +  3 EUREKA", type: "ok" },
      { text: "", type: "dim" },
      { text: "1. react_19_migration_guide_20250115", type: "result" },
      { text: "   Breaking changes: PropTypes removed entirely.", type: "result" },
      { text: "   forwardRef deprecated — use ref as prop.", type: "result" },
      { text: "   use() hook replaces useContext + Suspense.", type: "result" },
      { text: "   Server Actions: form action={fn} pattern.", type: "result" },
      { text: "", type: "dim" },
      { text: "   EUREKA: useFormStatus + useOptimistic combo", type: "ok" },
      { text: "   eliminates 80% of loading state boilerplate.", type: "ok" },
      { text: "", type: "dim" },
      { text: "   Confidence: 0.94  |  Domain: web_development", type: "dim" },
    ],
  },
  {
    name: "Ops",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bgColor: "bg-[#0a060f]",
    dotColor: "bg-violet-400",
    label: "$79 / mo",
    lines: [
      { text: "$ midos search 'React 19 migration'", type: "cmd" },
      { text: "", type: "dim" },
      { text: "Found 14 results  +  3 EUREKA  +  2 SOTA", type: "ok" },
      { text: "", type: "dim" },
      { text: "1. react_19_migration_guide_20250115", type: "result" },
      { text: "   [Full content + EUREKA + SOTA as Dev tier]", type: "result" },
      { text: "", type: "dim" },
      { text: "   SOTA: Production migration playbook", type: "ok" },
      { text: "   Step 1: Codemods (npx react-codemod@latest)", type: "result" },
      { text: "   Step 2: Enable strict mode, fix hydration", type: "result" },
      { text: "   Step 3: Replace useEffect waterfalls w/ use()", type: "result" },
      { text: "", type: "dim" },
      { text: "   Team pool: 99,847 queries remaining", type: "dim" },
      { text: "   Priority routing: enabled", type: "dim" },
    ],
  },
];

const TYPE_STYLES: Record<string, string> = {
  cmd: "text-white font-semibold",
  ok: "text-emerald-400/90",
  dim: "text-gray-600",
  result: "text-gray-300",
  truncated: "text-gray-500 italic",
  locked: "text-amber-500/70 text-[10px] mt-1",
};

export default function TierDemoPage() {
  useDataReveal({ threshold: 0.05 });

  return (
    <main className="bg-penguin-bg text-gray-100">
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 max-w-2xl" data-reveal>
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-4">
            Three Tiers
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-5">
            Same query. Different&nbsp;depth.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Every tier gets the same search.
            <span className="text-gray-300 font-medium"> Higher tiers see&nbsp;more.</span>
          </p>
        </div>

        {/* Three terminal cards */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5" data-reveal data-reveal-delay="1">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} delayMs={i * 400} />
          ))}
        </div>

        {/* Summary line */}
        <div className="mt-10 sm:mt-14 text-center" data-reveal data-reveal-delay="3">
          <p className="text-gray-500 text-sm sm:text-base">
            Same library. Same MCP call. The difference is{" "}
            <span className="text-white font-medium">what comes back</span>.
          </p>
        </div>
      </section>

      {/* Back */}
      <a
        href="/sandbox"
        className="fixed bottom-6 left-6 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        &larr; sandbox
      </a>
    </main>
  );
}

function TierCard({ tier, delayMs }: { tier: TierResponse; delayMs: number }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Start typewriter when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => setStarted(true), delayMs);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs, started]);

  // Typewriter effect
  useEffect(() => {
    if (!started) return;
    if (visibleLines >= tier.lines.length) return;

    const line = tier.lines[visibleLines];
    const delay = line.text === "" ? 80 : line.type === "cmd" ? 600 : 120;

    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [started, visibleLines, tier.lines]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden border ${tier.borderColor} ${tier.bgColor}`}
    >
      {/* Header bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${tier.borderColor}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${tier.dotColor}`} />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-700/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-700/30" />
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ml-1 ${tier.color}`}>
            {tier.name}
          </span>
        </div>
        <span className="text-[9px] font-mono text-gray-600">{tier.label}</span>
      </div>

      {/* Terminal content */}
      <div className="px-4 sm:px-5 py-4 sm:py-5 font-mono text-[11px] sm:text-[12px] leading-[1.7] min-h-[280px] sm:min-h-[320px]">
        {tier.lines.slice(0, visibleLines).map((line, j) => (
          <div
            key={j}
            className={`${TYPE_STYLES[line.type]} ${line.text === "" ? "h-3" : ""}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines < tier.lines.length && (
          <span className={`inline-block w-1.5 h-3.5 ${tier.dotColor} animate-pulse mt-0.5`} />
        )}
      </div>
    </div>
  );
}
