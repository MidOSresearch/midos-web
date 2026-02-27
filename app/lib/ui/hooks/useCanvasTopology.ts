"use client";

import { useEffect, type RefObject } from "react";

/**
 * Topology canvas — Pipeline-colored network that evolves with density
 *
 * density controls the visual metaphor:
 *   0.0-0.3  "constellation" — sparse, starry, subtle (hero background)
 *   0.4-0.6  "network"       — medium density, organic (pipeline/orchestrator)
 *   0.7-1.0  "synaptic"      — dense, geometric, alive (topology/knowledge graph)
 *
 * All params auto-derive from density if not explicitly set.
 */

interface TopologyConfig {
  nodeCount?: number;
  connectionDistance?: number;
  mouseGlow?: boolean;
  /** 0-1: controls overall density. 0=constellation, 1=synaptic. Default 0.5 */
  density?: number;
  /** Downward drift speed. 0=none, 0.05=gentle. Default 0 */
  drift?: number;
  /** Base alpha multiplier. Higher = more visible. Default 1.0 */
  brightness?: number;
}

// Pipeline tier colors (rgb)
const TIER_COLORS = [
  { r: 156, g: 163, b: 175 }, // gray (staging)
  { r: 52,  g: 211, b: 153 }, // green (chunks)
  { r: 56,  g: 189, b: 248 }, // blue (dev)
  { r: 251, g: 191, b: 36  }, // gold (truth)
  { r: 167, g: 139, b: 250 }, // purple (SOTA)
];

// Weight distribution: more chunks (green), fewer SOTA (purple)
const TIER_WEIGHTS = [0.10, 0.35, 0.25, 0.18, 0.12];

function pickTier(): number {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < TIER_WEIGHTS.length; i++) {
    sum += TIER_WEIGHTS[i];
    if (r < sum) return i;
  }
  return 0;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
  tier: number;
  phase: number;
  cluster: number;
}

export function useCanvasTopology(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  config?: TopologyConfig
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const density = config?.density ?? 0.5;
    const nodeCount = config?.nodeCount ?? Math.round(25 + density * 50);
    const connectionDistance = config?.connectionDistance ?? Math.round(170 - density * 60);
    const mouseGlow = config?.mouseGlow ?? true;
    const driftSpeed = config?.drift ?? 0;
    const brightness = config?.brightness ?? 1.0;

    const clusterSpread = 0.22 - density * 0.08;
    const pulseSpeed = 0.3 + density * 0.3;
    const lineWidthBase = 0.4 + density * 0.3;
    const glowRadius = 3.5 - density * 1.0;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let mouseX = -1000, mouseY = -1000;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouseX = -1000; mouseY = -1000; };
    if (mouseGlow) {
      canvas.addEventListener("mousemove", onMouse);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    const clusterCount = 5;
    const clusterCenters = Array.from({ length: clusterCount }, (_, i) => ({
      x: (w || 800) * (0.15 + (i / (clusterCount - 1)) * 0.7),
      y: (h || 500) * (0.3 + Math.sin(i * 1.2) * 0.2),
      tier: i,
    }));

    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const cluster = i % clusterCount;
      const center = clusterCenters[cluster];
      const spread = Math.min(w || 800, h || 500) * clusterSpread;
      const depth = Math.random();
      const strayChance = 0.25 - density * 0.15;
      const isStray = Math.random() < strayChance;
      const x = isStray ? Math.random() * (w || 800) : center.x + (Math.random() - 0.5) * spread * 2;
      const y = isStray ? Math.random() * (h || 500) : center.y + (Math.random() - 0.5) * spread * 1.5;
      const clusterAffinity = 0.5 + density * 0.3;
      const tier = Math.random() < clusterAffinity ? center.tier : pickTier();

      return {
        x, y,
        vx: (Math.random() - 0.5) * (0.15 + depth * 0.1),
        vy: (Math.random() - 0.5) * (0.15 + depth * 0.1) + driftSpeed + depth * driftSpeed * 0.5,
        r: 1.5 + (1 - depth) * 2.5,
        depth, tier, phase: Math.random() * Math.PI * 2, cluster,
      };
    });

    let raf: number;
    let time = 0;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      if (!prefersReduced) {
        nodes.forEach(n => {
          n.x += n.vx; n.y += n.vy;
          if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
        });
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i], nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const maxDist = ni.cluster === nj.cluster ? connectionDistance * 1.3 : connectionDistance * 0.7;

          if (d < maxDist) {
            const fade = 1 - d / maxDist;
            const avgDepth = (ni.depth + nj.depth) / 2;
            const baseAlpha = fade * (0.04 + (1 - avgDepth) * 0.08) * brightness;
            const ci = TIER_COLORS[ni.tier], cj = TIER_COLORS[nj.tier];
            const mr = (ci.r + cj.r) / 2, mg = (ci.g + cj.g) / 2, mb = (ci.b + cj.b) / 2;

            ctx.beginPath(); ctx.moveTo(ni.x, ni.y); ctx.lineTo(nj.x, nj.y);
            ctx.strokeStyle = `rgba(${mr},${mg},${mb},${baseAlpha})`;
            ctx.lineWidth = lineWidthBase + (1 - avgDepth) * 0.5;
            ctx.stroke();

            const pulseT = (time * pulseSpeed + i * 0.1 + j * 0.05) % 1;
            const px = ni.x + (nj.x - ni.x) * pulseT;
            const py = ni.y + (nj.y - ni.y) * pulseT;
            const pulseAlpha = baseAlpha * 2 * Math.sin(pulseT * Math.PI);

            if (pulseAlpha > 0.01 && fade > 0.3) {
              ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${mr},${mg},${mb},${pulseAlpha})`;
              ctx.fill();
            }
          }
        }
      }

      nodes.forEach(n => {
        const c = TIER_COLORS[n.tier];
        const breath = 0.4 + Math.sin(time * 1.5 + n.phase) * 0.2;
        const depthAlpha = (0.15 + (1 - n.depth) * 0.55) * brightness;
        const alpha = depthAlpha * (0.6 + breath);
        const mouseDist = Math.sqrt((n.x - mouseX) ** 2 + (n.y - mouseY) ** 2);
        const mouseBoost = mouseDist < 120 ? (1 - mouseDist / 120) * 0.5 : 0;
        const finalAlpha = Math.min(1, alpha + mouseBoost);
        const finalR = n.r * (1 + mouseBoost * 0.8);

        if (finalAlpha > 0.3) {
          ctx.beginPath(); ctx.arc(n.x, n.y, finalR * glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha * 0.08})`;
          ctx.fill();
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, finalR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha})`;
        ctx.fill();

        const starThreshold = 0.3 + density * 0.15;
        if (finalAlpha > starThreshold) {
          ctx.beginPath(); ctx.arc(n.x, n.y, finalR * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(finalAlpha - 0.3) * (0.3 - density * 0.15)})`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (mouseGlow) {
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      }
      cancelAnimationFrame(raf);
    };
  }, []);
}
