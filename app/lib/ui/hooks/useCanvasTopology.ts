"use client";

import { useEffect, type RefObject } from "react";

/**
 * Renders an animated floating-nodes-and-connections topology on a canvas.
 * Handles DPR, resize, animation loop, and cleanup.
 */
export function useCanvasTopology(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  config?: { nodeCount?: number; color?: string; connectionDistance?: number }
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodeCount = config?.nodeCount ?? 35;
    const color = config?.color ?? "0,150,136";
    const connectionDistance = config?.connectionDistance ?? 110;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * (w || 600), y: Math.random() * (h || 400),
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1.5, b: Math.random(),
    }));

    let raf: number;
    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.b = 0.3 + Math.sin(Date.now() * 0.001 + n.x) * 0.3;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < connectionDistance) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${color},${(1 - d / connectionDistance) * 0.15})`; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${n.b})`; ctx.fill();
        if (n.b > 0.5) {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${(n.b - 0.5) * 0.12})`; ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
}
