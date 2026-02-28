"use client";

import { useRef } from "react";
import { useCanvasTopology, useDataReveal } from "@/lib/ui/hooks";

/**
 * Pricing — Conversion-focused tier comparison
 *
 * Goal: visitor picks a tier and clicks "Get Started"
 * Tiers: Community ($0), Dev ($29/mo), Ops ($79/mo)
 * Design: dark bg, tier-colored cards, most popular highlight on Dev
 */

const tiers = [
  {
    name: "Community",
    price: "0",
    period: "forever",
    desc: "Evaluate MidOS. See if it fits.",
    color: { text: "text-gray-300", border: "border-gray-600/40", bg: "bg-gray-800/20", badge: "", glow: "" },
    cta: "Start Free",
    ctaStyle: "bg-gray-700 hover:bg-gray-600 text-white",
    features: [
      "8 MCP tools",
      "100 queries / month",
      "Search knowledge base",
      "Browse 121 skills",
      "Truncated content previews",
      "Community support",
    ],
    limits: [
      "Content truncated (250 chars)",
      "No EUREKA / SOTA access",
      "No semantic search",
    ],
  },
  {
    name: "Dev",
    price: "29",
    period: "/mo",
    annualPrice: "25",
    desc: "Full library access. Every answer, complete.",
    popular: true,
    color: { text: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-900/10", badge: "bg-emerald-500", glow: "shadow-[0_0_40px_rgba(52,211,153,0.10)]" },
    cta: "Get Started",
    ctaStyle: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_20px_rgba(52,211,153,0.25)]",
    features: [
      "Everything in Community",
      "Full content (no truncation)",
      "19K+ chunks, complete skills",
      "EUREKA discoveries & SOTA",
      "Semantic search across all content",
      "25,000 queries / month",
      "Agent configurations",
      "Truth patches & ATOMs",
    ],
    limits: [],
  },
  {
    name: "Ops",
    price: "79",
    period: "/mo",
    annualPrice: "67",
    desc: "Specialized knowledge. Team features. Priority.",
    color: { text: "text-violet-400", border: "border-violet-500/40", bg: "bg-violet-900/10", badge: "", glow: "" },
    cta: "Contact Us",
    ctaStyle: "bg-violet-700 hover:bg-violet-600 text-white",
    features: [
      "Everything in Dev",
      "Security operations patterns",
      "Infrastructure knowledge",
      "Advanced tooling packs",
      "100,000 queries / month (pool)",
      "Priority support",
      "Team access",
    ],
    limits: [],
  },
];

const comparisons = [
  { name: "Copilot Pro", price: "$10/mo", what: "Code completions" },
  { name: "Cursor Pro+", price: "$40/mo", what: "AI code editor" },
  { name: "Context7 Pro", price: "$29/mo", what: "Context retrieval" },
  { name: "MidOS Dev", price: "$29/mo", what: "Validated knowledge library" },
];

export default function PricingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTopology(canvasRef, { density: 0.15, brightness: 0.4 });
  useDataReveal({ threshold: 0.05 });

  return (
    <main className="relative min-h-screen bg-penguin-bg text-gray-100 overflow-hidden">
      {/* Subtle constellation background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-3">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Start free. Scale when&nbsp;ready.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Your AI agent gets 19,000+ validated answers. Pick the depth you&nbsp;need.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              data-reveal
              data-reveal-delay={String(i)}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-7
                         backdrop-blur-sm transition-all duration-300 hover:-translate-y-1
                         ${tier.color.border} ${tier.color.bg} ${tier.color.glow}
                         ${tier.popular ? "md:scale-105 md:-translate-y-2" : ""}`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white ${tier.color.badge}`}>
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier name + price */}
              <div className="mb-6">
                <h3 className={`text-[11px] font-mono uppercase tracking-[0.15em] ${tier.color.text} mb-3 opacity-80`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-gray-600">{tier.period}</span>
                </div>
                {tier.annualPrice && (
                  <p className="text-[11px] text-gray-600 mt-1.5 font-mono">
                    ${tier.annualPrice}/mo billed annually
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                  {tier.desc}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-300 leading-snug">
                    <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.color.text} opacity-80`} viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                    {f}
                  </li>
                ))}
                {tier.limits.map((l) => (
                  <li key={l} className="flex items-start gap-2.5 text-[13px] text-gray-600 leading-snug">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-700/60" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                    </svg>
                    {l}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.name === "Ops" ? "mailto:hello@midos.dev" : "/login"}
                className={`block text-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                           hover:-translate-y-0.5 active:translate-y-0 ${tier.ctaStyle}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Market comparison */}
        <div className="max-w-md mx-auto" data-reveal data-reveal-delay="3">
          <p className="text-center text-[11px] font-mono uppercase tracking-[0.2em] text-gray-600 mb-5">
            How we compare
          </p>
          <div className="space-y-2">
            {comparisons.map((c) => (
              <div
                key={c.name}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm
                           ${c.name === "MidOS Dev"
                             ? "bg-emerald-900/20 border border-emerald-500/20 text-emerald-300"
                             : "bg-penguin-surface/30 border border-penguin-border text-gray-400"}`}
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-gray-600">{c.what}</span>
                <span className={`font-mono text-sm ${c.name === "MidOS Dev" ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>
                  {c.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">
            They complete code. We validate knowledge.
          </p>
        </div>

        {/* FAQ / quick answers */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto" data-reveal data-reveal-delay="4">
          {[
            { q: "What is MCP?", a: "Model Context Protocol — the standard way AI agents fetch context. Claude, Cursor, Windsurf, and hundreds of AI clients already speak it." },
            { q: "What counts as a query?", a: "Each MCP tool call = 1 query. Search, get_skill, list_skills — each one. Community gets 100/mo, Dev gets 25K." },
            { q: "Can I cancel anytime?", a: "Yes. No contracts, no lock-in. Cancel from your dashboard, effective end of billing period." },
            { q: "Do I need to install anything?", a: "pip install midos — one line. Configure your MCP client (Claude, Cursor, etc.) and you're live in 2 minutes." },
          ].map((faq) => (
            <div key={faq.q} className="bg-penguin-surface/30 border border-penguin-border rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-2">{faq.q}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back */}
      <div className="fixed bottom-6 left-6 z-20">
        <a href="/sandbox" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          &larr; sandbox
        </a>
      </div>
    </main>
  );
}
