"use client";

import { useEffect, useRef } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Orchestrator B v2 — Interactive hub with expanding nodes
 *
 * v1 feedback: "NECESITO QUE ANIMES ESTO Y AGRANDES CADA PUNTO AL PASAR EL MOUSE"
 * v2:
 *   - Mouse on center → nodes push outward (expand radius)
 *   - Hover on node → node enlarges, shows full info panel
 *   - Nodes float with gentle organic motion, NOT overlapping title
 *   - Hub changes color to match hovered node
 *   - "Del intercambio nace la creatividad"
 */

const SPOKES = [
  { label: "Research", desc: "Deep dives into any topic. Curated from open knowledge.", color: { r: 156, g: 163, b: 175 }, icon: "\u{1F50D}" },
  { label: "Knowledge", desc: "Vast validated library. Docs, skills, patterns — ready.", color: { r: 52, g: 211, b: 153 }, icon: "\u{1F4DA}" },
  { label: "Tools", desc: "400+ instruments. Semantic search, pipelines, agent handshake.", color: { r: 56, g: 189, b: 248 }, icon: "\u{1F527}" },
  { label: "Community", desc: "Skills shared freely. Open source. Built by many, for everyone.", color: { r: 251, g: 191, b: 36 }, icon: "\u{1F91D}" },
  { label: "Skills", desc: "121 stacks. React, Rust, Go, Python — battle-tested patterns.", color: { r: 167, g: 139, b: 250 }, icon: "\u{26A1}" },
  { label: "Ingest", desc: "Continuous learning from docs, repos, community.", color: { r: 52, g: 211, b: 153 }, icon: "\u{1F33E}" },
  { label: "Truth", desc: "47 verified patches. EUREKA discoveries. What survived the fire.", color: { r: 251, g: 191, b: 36 }, icon: "\u{2705}" },
  { label: "Pipeline", desc: "5 layers: raw → chunks → tools → truth → SOTA. Knowledge matures.", color: { r: 167, g: 139, b: 250 }, icon: "\u{1F4CA}" },
];

export default function OrchestratorBExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useDataReveal({ threshold: 0.05 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let mouseX = -1000, mouseY = -1000;

    // Animated state
    let expandProgress = 0; // 0=normal, 1=fully expanded (mouse on center)
    let hoveredNode = -1;
    const nodeScales = SPOKES.map(() => 1); // smooth scale per node
    let hubColor = { r: 0, g: 150, b: 136 }; // current hub color (lerps)

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
    const onLeave = () => { mouseX = -1000; mouseY = -1000; hoveredNode = -1; };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    let raf: number;
    let time = 0;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.48; // slightly above center to avoid title overlap
      const hubR = Math.min(w, h) * 0.045;
      const baseLen = Math.min(w, h) * 0.25;
      const expandedLen = Math.min(w, h) * 0.35;

      // Is mouse near center hub?
      const distToHub = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2);
      const wantExpand = distToHub < hubR * 3;

      // Smooth expand/collapse
      const expandTarget = wantExpand ? 1 : 0;
      expandProgress += (expandTarget - expandProgress) * 0.06;

      const spokeLen = baseLen + (expandedLen - baseLen) * expandProgress;

      // Hub breathing
      const breath = prefersReduced ? 1 : 1 + Math.sin(time * 1.5) * 0.05;

      // Find hovered node
      hoveredNode = -1;
      const nodePositions: { x: number; y: number }[] = [];

      SPOKES.forEach((spoke, i) => {
        const angle = (i / SPOKES.length) * Math.PI * 2 - Math.PI / 2;
        const sway = prefersReduced ? 0 : Math.sin(time * (0.4 + i * 0.1) + i * 1.5) * 0.04;
        const a = angle + sway;
        const endX = cx + Math.cos(a) * spokeLen;
        const endY = cy + Math.sin(a) * spokeLen;
        nodePositions.push({ x: endX, y: endY });

        const distToNode = Math.sqrt((mouseX - endX) ** 2 + (mouseY - endY) ** 2);
        if (distToNode < 35) hoveredNode = i;
      });

      // Smooth node scales
      SPOKES.forEach((_, i) => {
        const target = hoveredNode === i ? 2.2 : 1;
        nodeScales[i] += (target - nodeScales[i]) * 0.1;
      });

      // Hub color lerps toward hovered node color (or teal default)
      const targetColor = hoveredNode >= 0 ? SPOKES[hoveredNode].color : { r: 0, g: 150, b: 136 };
      hubColor.r += (targetColor.r - hubColor.r) * 0.08;
      hubColor.g += (targetColor.g - hubColor.g) * 0.08;
      hubColor.b += (targetColor.b - hubColor.b) * 0.08;

      // --- DRAW SPOKES ---
      SPOKES.forEach((spoke, i) => {
        const { x: endX, y: endY } = nodePositions[i];
        const { r, g, b } = spoke.color;
        const scale = nodeScales[i];
        const isHovered = hoveredNode === i;
        const hoverAlpha = isHovered ? 1.5 : 1;

        const angle = Math.atan2(endY - cy, endX - cx);

        // Spoke glow
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * hubR, cy + Math.sin(angle) * hubR);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.04 * hoverAlpha})`;
        ctx.lineWidth = isHovered ? 14 : 8;
        ctx.stroke();

        // Spoke line
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * hubR, cy + Math.sin(angle) * hubR);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 * hoverAlpha})`;
        ctx.lineWidth = isHovered ? 2.5 : 1.2;
        ctx.stroke();

        // Pulse along spoke
        if (!prefersReduced) {
          const pulseT = (time * 0.3 + i * 0.35) % 1;
          const px = cx + Math.cos(angle) * (hubR + (spokeLen - hubR) * pulseT);
          const py = cy + Math.sin(angle) * (hubR + (spokeLen - hubR) * pulseT);
          const pAlpha = Math.sin(pulseT * Math.PI) * 0.5 * hoverAlpha;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${pAlpha})`;
          ctx.fill();
        }

        // Node — scales up on hover
        const nodeR = 14 * scale;

        // Node glow
        ctx.beginPath();
        ctx.arc(endX, endY, nodeR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.04 * hoverAlpha})`;
        ctx.fill();

        // Node fill
        ctx.beginPath();
        ctx.arc(endX, endY, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 0.25 : 0.12})`;
        ctx.strokeStyle = `rgba(${r},${g},${b},${isHovered ? 0.6 : 0.25})`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.fill();
        ctx.stroke();

        // Icon
        ctx.font = `${Math.round(nodeR * 0.7)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 1 : 0.7})`;
        ctx.fillText(spoke.icon, endX, endY);

        // Label — always visible, larger on hover
        const labelDist = nodeR + 14;
        const labelX = endX + Math.cos(angle) * labelDist;
        const labelY = endY + Math.sin(angle) * labelDist;

        ctx.font = `${isHovered ? "bold 13" : "11"}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 0.95 : 0.55})`;
        ctx.fillText(spoke.label, labelX, labelY);

        // Expanded info panel on hover
        if (isHovered && scale > 1.5) {
          const panelX = endX + Math.cos(angle) * (labelDist + 10);
          const panelY = labelY + 18;

          // Panel background
          const panelW = 200;
          const panelH = 48;
          const px0 = panelX - panelW / 2;
          const py0 = panelY - 4;

          ctx.fillStyle = "rgba(10, 22, 40, 0.85)";
          ctx.beginPath();
          ctx.roundRect(px0, py0, panelW, panelH, 6);
          ctx.fill();

          ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(px0, py0, panelW, panelH, 6);
          ctx.stroke();

          // Description text (wrap manually)
          ctx.font = "10px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;

          const words = spoke.desc.split(" ");
          let line = "";
          let lineY = py0 + 14;
          words.forEach(word => {
            const test = line + (line ? " " : "") + word;
            if (ctx.measureText(test).width > panelW - 16) {
              ctx.fillText(line, panelX, lineY);
              line = word;
              lineY += 13;
            } else {
              line = test;
            }
          });
          if (line) ctx.fillText(line, panelX, lineY);
        }
      });

      // --- HUB ---
      const hr = Math.round(hubColor.r);
      const hg = Math.round(hubColor.g);
      const hb = Math.round(hubColor.b);

      // Hub glow — colored
      const hubGrad = ctx.createRadialGradient(cx, cy, hubR * 0.3, cx, cy, hubR * 4);
      hubGrad.addColorStop(0, `rgba(${hr},${hg},${hb},0.12)`);
      hubGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, hubR * 4, 0, Math.PI * 2);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      // Hub ring — colored
      ctx.beginPath();
      ctx.arc(cx, cy, hubR * breath, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hr},${hg},${hb},0.18)`;
      ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.4)`;
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Hub core
      ctx.beginPath();
      ctx.arc(cx, cy, hubR * 0.5 * breath, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hr},${hg},${hb},0.55)`;
      ctx.fill();

      // Hub bright center
      ctx.beginPath();
      ctx.arc(cx, cy, hubR * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fill();

      // Hub label
      ctx.font = "9px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(${hr},${hg},${hb},0.5)`;
      ctx.fillText("PULPO", cx, cy + hubR * breath + 14);

      // Interaction hint
      if (expandProgress < 0.1 && hoveredNode < 0) {
        ctx.font = "10px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillText("hover the hub or nodes", cx, cy + hubR * 4 + 20);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-penguin-bg text-gray-100 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "crosshair" }}
      />

      {/* Title — positioned at top so it doesn't overlap the hub */}
      <div className="relative z-10 pt-12 text-center px-6" data-reveal>
        <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-2">
          Orchestrator B
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
          The Network Mind
        </h2>
        <p className="mt-2 text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
          Hover the hub to expand. Touch each node to learn.
        </p>
      </div>

      {/* Bottom quote */}
      <div className="fixed bottom-14 left-0 right-0 text-center z-10">
        <p className="text-gray-700 text-[10px] italic tracking-wide">
          del intercambio nace la creatividad
        </p>
      </div>

      <div className="fixed bottom-6 left-6 z-20">
        <a href="/sandbox/orchestrator-b" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          &larr; all orchestrator-b versions
        </a>
      </div>
    </main>
  );
}
