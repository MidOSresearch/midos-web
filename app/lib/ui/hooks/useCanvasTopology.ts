"use client";

import { useEffect, type RefObject } from "react";

/**
 * Topology v2 — Pipeline-colored constellation network
 *
 * - 5 tier colors: gray, green, blue, gold, purple
 * - Constellation clusters (tight groups with bridges between them)
 * - Depth layers (size + opacity = z-distance)
 * - Pulsing "knowledge transfer" along connections
 * - Mouse proximity glow
 * - Subtle breathing (nodes pulse gently)
 */

interface TopologyConfig {
  nodeCount?: number;
  connectionDistance?: number;
  mouseGlow?: boolean;
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
  r: number;        // base radius
  depth: number;     // 0-1, 0=foreground 1=far
  tier: number;      // index into TIER_COLORS
  phase: number;     // breathing phase offset
  cluster: number;   // cluster ID for constellation grouping
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

    const nodeCount = config?.nodeCount ?? 55;
    const connectionDistance = config?.connectionDistance ?? 130;
    const mouseGlow = config?.mouseGlow ?? true;

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

    // Mouse tracking
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

    // Create constellation clusters
    const clusterCount = 5; // one per tier, roughly
    const clusterCenters = Array.from({ length: clusterCount }, (_, i) => ({
      x: (w || 800) * (0.15 + (i / (clusterCount - 1)) * 0.7),
      y: (h || 500) * (0.3 + Math.sin(i * 1.2) * 0.2),
      tier: i, // primary tier for this cluster
    }));

    // Create nodes with cluster affinity
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const cluster = i % clusterCount;
      const center = clusterCenters[cluster];
      const spread = Math.min(w || 800, h || 500) * 0.18;
      const depth = Math.random();

      // Most nodes near their cluster center, some strays
      const isStray = Math.random() < 0.2;
      const x = isStray
        ? Math.random() * (w || 800)
        : center.x + (Math.random() - 0.5) * spread * 2;
      const y = isStray
        ? Math.random() * (h || 500)
        : center.y + (Math.random() - 0.5) * spread * 1.5;

      // Tier: mostly matches cluster, some variation
      const tier = Math.random() < 0.6 ? center.tier : pickTier();

      return {
        x, y,
        vx: (Math.random() - 0.5) * (0.15 + depth * 0.1),
        vy: (Math.random() - 0.5) * (0.15 + depth * 0.1),
        r: 1.5 + (1 - depth) * 2.5, // foreground = bigger
        depth,
        tier,
        phase: Math.random() * Math.PI * 2,
        cluster,
      };
    });

    let raf: number;
    let time = 0;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      time += 0.016; // ~60fps timestep
      ctx.clearRect(0, 0, w, h);

      // Update positions
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i], nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          // Same cluster = longer connection distance
          const maxDist = ni.cluster === nj.cluster
            ? connectionDistance * 1.3
            : connectionDistance * 0.7;

          if (d < maxDist) {
            const fade = 1 - d / maxDist;
            const avgDepth = (ni.depth + nj.depth) / 2;
            const baseAlpha = fade * (0.04 + (1 - avgDepth) * 0.08);

            // Connection color: blend the two node colors
            const ci = TIER_COLORS[ni.tier], cj = TIER_COLORS[nj.tier];
            const mr = (ci.r + cj.r) / 2, mg = (ci.g + cj.g) / 2, mb = (ci.b + cj.b) / 2;

            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(nj.x, nj.y);
            ctx.strokeStyle = `rgba(${mr},${mg},${mb},${baseAlpha})`;
            ctx.lineWidth = 0.5 + (1 - avgDepth) * 0.5;
            ctx.stroke();

            // Pulse traveling along connection (knowledge transfer)
            const pulseT = (time * 0.4 + i * 0.1 + j * 0.05) % 1;
            const px = ni.x + (nj.x - ni.x) * pulseT;
            const py = ni.y + (nj.y - ni.y) * pulseT;
            const pulseAlpha = baseAlpha * 2 * Math.sin(pulseT * Math.PI);

            if (pulseAlpha > 0.01 && fade > 0.3) {
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${mr},${mg},${mb},${pulseAlpha})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const c = TIER_COLORS[n.tier];
        const breath = 0.4 + Math.sin(time * 1.5 + n.phase) * 0.2;
        const depthAlpha = 0.15 + (1 - n.depth) * 0.55;
        const alpha = depthAlpha * (0.6 + breath);

        // Mouse proximity boost
        const mouseDist = Math.sqrt((n.x - mouseX) ** 2 + (n.y - mouseY) ** 2);
        const mouseBoost = mouseDist < 120 ? (1 - mouseDist / 120) * 0.5 : 0;

        const finalAlpha = Math.min(1, alpha + mouseBoost);
        const finalR = n.r * (1 + mouseBoost * 0.8);

        // Outer glow
        if (finalAlpha > 0.3) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, finalR * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha * 0.08})`;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, finalR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${finalAlpha})`;
        ctx.fill();

        // Bright center (stars effect)
        if (finalAlpha > 0.4) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, finalR * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(finalAlpha - 0.3) * 0.3})`;
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
