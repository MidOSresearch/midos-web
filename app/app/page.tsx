"use client";

import dynamic from "next/dynamic";

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

export default function LandingPage() {
  return (
    <div className="bg-penguin-bg text-gray-100">
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
      `}</style>

      <div className="journey-section"><Hero /></div>
      <div className="journey-section"><BeforeAfter /></div>
      <div className="journey-section"><Pipeline /></div>
      <div className="journey-section"><Orchestrator /></div>
      <div className="journey-section"><Topology /></div>
      <div className="journey-section"><Colony /></div>
      <div className="journey-section"><Pricing /></div>
      <div className="journey-section"><Horizon /></div>
    </div>
  );
}
