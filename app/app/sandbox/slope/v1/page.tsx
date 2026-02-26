"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Slope Penguin — Un solo experimento.
 *
 * Un pingüino que baja por una pista de hielo SVG
 * siguiendo el scroll. Nada más.
 */

// The slope path — a gentle S-curve descent
const SLOPE_D = "M 80,60 C 80,200 320,250 320,400 C 320,550 80,600 80,750 C 80,900 320,950 320,1100";
const VIEWBOX_H = 1160;

export default function SlopePage() {
  const pathRef = useRef<SVGPathElement>(null);
  const penguinRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    const penguin = penguinRef.current;
    if (!path || !penguin) return;

    setReady(true);
    const totalLength = path.getTotalLength();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

          // Get point on path
          const point = path.getPointAtLength(progress * totalLength);

          // Get direction (tangent) for rotation
          const ahead = path.getPointAtLength(Math.min(progress * totalLength + 5, totalLength));
          const angle = Math.atan2(ahead.y - point.y, ahead.x - point.x) * (180 / Math.PI);

          // Map SVG coords to screen position
          // SVG viewBox is 400 x VIEWBOX_H, rendered in a fixed container
          const svg = path.ownerSVGElement!;
          const svgRect = svg.getBoundingClientRect();
          const scaleX = svgRect.width / 400;
          const scaleY = svgRect.height / VIEWBOX_H;

          const screenX = svgRect.left + point.x * scaleX;
          const screenY = svgRect.top + point.y * scaleY;

          penguin.style.transform = `translate(${screenX - 20}px, ${screenY - 20}px) rotate(${angle - 90}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial position

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative bg-penguin-bg text-gray-100">
      {/* Tall scroll container */}
      <div style={{ height: "400vh" }}>
        {/* Fixed viewport */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          {/* Slope SVG */}
          <svg
            viewBox={`0 0 400 ${VIEWBOX_H}`}
            className="h-[90vh] w-auto max-w-[90vw]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Ice slope glow */}
            <path
              d={SLOPE_D}
              fill="none"
              stroke="#bae6fd"
              strokeWidth="24"
              opacity="0.06"
              strokeLinecap="round"
            />
            {/* Ice slope main */}
            <path
              ref={pathRef}
              d={SLOPE_D}
              fill="none"
              stroke="#bae6fd"
              strokeWidth="4"
              opacity="0.3"
              strokeLinecap="round"
            />
            {/* Dashed center line */}
            <path
              d={SLOPE_D}
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="1.5"
              opacity="0.15"
              strokeDasharray="8 16"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* The penguin — positioned via JS */}
        <div
          ref={penguinRef}
          className="fixed top-0 left-0 z-20 pointer-events-none transition-none"
          style={{ opacity: ready ? 1 : 0, willChange: "transform" }}
        >
          <svg viewBox="0 0 40 50" width="40" height="50" aria-label="Skiing penguin">
            {/* Mini skis */}
            <rect x="6" y="44" width="14" height="2" rx="1" fill="#7dd3fc" transform="rotate(-6 13 45)" />
            <rect x="20" y="44" width="14" height="2" rx="1" fill="#7dd3fc" transform="rotate(-6 27 45)" />
            {/* Body */}
            <ellipse cx="20" cy="30" rx="10" ry="14" fill="#1a2940" />
            <ellipse cx="20" cy="32" rx="7" ry="10" fill="#e0f2f1" />
            {/* Head */}
            <circle cx="20" cy="16" r="8" fill="#1a2940" />
            {/* Eyes */}
            <circle cx="17" cy="14.5" r="1.5" fill="white" />
            <circle cx="23" cy="14.5" r="1.5" fill="white" />
            <circle cx="17.5" cy="14.5" r="0.8" fill="#0a1628" />
            <circle cx="23.5" cy="14.5" r="0.8" fill="#0a1628" />
            {/* Beak */}
            <polygon points="18,18 22,18 20,21" fill="#f59e0b" />
            {/* Wings out (skiing pose) */}
            <line x1="10" y1="26" x2="3" y2="20" stroke="#1a2940" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="26" x2="37" y2="20" stroke="#1a2940" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Scroll hint */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="text-xs text-gray-600 tracking-widest uppercase animate-pulse">scroll to slide</p>
        </div>

        {/* Labels along the descent */}
        <div className="fixed top-6 left-6 z-10">
          <a href="/sandbox" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← sandbox
          </a>
        </div>
      </div>
    </main>
  );
}
