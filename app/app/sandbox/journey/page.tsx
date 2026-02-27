"use client";

import dynamic from "next/dynamic";

/**
 * Journey — Full-scroll landing page composed of all 6 sandbox sections.
 *
 * PURPOSE: Convert visitors into free-tier users or subscribers.
 * FLOW: Hook → How it works → What it does → Scale → Community → CTA
 *
 * Each section is dynamically imported from its latest sandbox version.
 * Wrapper divs clip fixed-positioned sandbox nav and normalize <main> nesting.
 *
 * Transition copy between sections guides the conversion narrative.
 */

const Hero = dynamic(() => import("../hero/v5/page"), { ssr: false });
const BeforeAfter = dynamic(() => import("../before-after/page"), { ssr: false });
const Pipeline = dynamic(() => import("../pipeline/v5/page"), { ssr: false });
const Orchestrator = dynamic(() => import("../orchestrator/v4/page"), { ssr: false });
const Topology = dynamic(() => import("../topology/current/page"), { ssr: false });
const Colony = dynamic(() => import("../colony/v3/page"), { ssr: false });
const Pricing = dynamic(() => import("../pricing/page"), { ssr: false });
const Horizon = dynamic(() => import("../horizon/v4/page"), { ssr: false });

export default function JourneyPage() {
  return (
    <div className="bg-penguin-bg text-gray-100">
      {/* Global style: hide sandbox back-links and clip fixed elements within sections */}
      <style>{`
        .journey-section {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          z-index: 0;
        }
        /* Hide ALL fixed-positioned elements inside journey sections
           (sandbox back-links, transition text overlays) */
        .journey-section .fixed {
          position: absolute !important;
        }
        .journey-section a[href*="/sandbox"] {
          display: none !important;
        }
      `}</style>

      {/* 1. HERO — Hook: What is MidOS + immediate CTA */}
      <div className="journey-section">
        <Hero />
      </div>

      {/* 2. BEFORE/AFTER — Pain: why you need a library */}
      <div className="journey-section">
        <BeforeAfter />
      </div>

      {/* 3. PIPELINE — How it works: trust building */}
      <div className="journey-section">
        <Pipeline />
      </div>

      {/* 4. ORCHESTRATOR — What it does for you: value prop */}
      <div className="journey-section">
        <Orchestrator />
      </div>

      {/* 5. TOPOLOGY — Scale: social proof through data */}
      <div className="journey-section">
        <Topology />
      </div>

      {/* 6. COLONY — Community: trust through people */}
      <div className="journey-section">
        <Colony />
      </div>

      {/* 7. PRICING — Convert: pick your tier */}
      <div className="journey-section">
        <Pricing />
      </div>

      {/* 8. HORIZON — Close the deal: final CTA */}
      <div className="journey-section">
        <Horizon />
      </div>
    </div>
  );
}
