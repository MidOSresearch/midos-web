"use client";

import { useEffect, useRef } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Orchestrator v4 — Reactive chameleon hub + 8 tentacles
 *
 * v3 feedback: "darle al huevo del centro la posibilidad de variar de color
 *   al pasar el mouse por cada extremo, adopta el color y genera explicación
 *   ampliada. Más volatilidad. Falta el púrpura. Orden izquierda a derecha,
 *   rueda de tentáculos o dendritas."
 *
 * v4:
 *   - 8 capabilities (added Skills/purple, Harvest, Truth, Pipeline)
 *   - Ordered left-to-right in a fan (dendrite wheel)
 *   - Hover tentacle tip → body ADOPTS that color (smooth lerp)
 *   - Idle: slow chameleon cycle (pipeline colors)
 *   - Each tentacle tip: larger on hover, shows info panel
 *   - More tentacle volatility (wider sway, faster oscillation)
 *   - Speed correlation with mouse proximity to hub
 */

const CAPABILITIES = [
  { label: "Research",  desc: "Deep dives into any topic. Curated from open knowledge.",       color: { r: 156, g: 163, b: 175 }, icon: "\u{1F50D}" },
  { label: "Knowledge", desc: "Vast validated library. Docs, skills, patterns — ready.",       color: { r: 52,  g: 211, b: 153 }, icon: "\u{1F4DA}" },
  { label: "Ingest",    desc: "Continuous learning from docs, repos, community.",              color: { r: 52,  g: 211, b: 153 }, icon: "\u{1F33E}" },
  { label: "Tools",     desc: "68 MCP tools. Semantic search, agent handshake.",                color: { r: 56,  g: 189, b: 248 }, icon: "\u{1F527}" },
  { label: "Pipeline",  desc: "5 layers: raw → chunks → tools → truth → SOTA.",                color: { r: 56,  g: 189, b: 248 }, icon: "\u{1F4CA}" },
  { label: "Truth",     desc: "46 verified patches. EUREKA discoveries. Battle-tested.",        color: { r: 251, g: 191, b: 36  }, icon: "\u{2705}" },
  { label: "Community", desc: "Skills shared freely. Open source. Built by many.",              color: { r: 251, g: 191, b: 36  }, icon: "\u{1F91D}" },
  { label: "Skills",    desc: "121 stacks. React, Rust, Go, Python — battle-tested.",           color: { r: 167, g: 139, b: 250 }, icon: "\u{26A1}" },
];

// Pipeline colors for idle chromatophore cycling
const CHROMA_COLORS = [
  { r: 0,   g: 150, b: 136 }, // teal (home)
  { r: 52,  g: 211, b: 153 }, // green
  { r: 56,  g: 189, b: 248 }, // blue
  { r: 251, g: 191, b: 36  }, // gold
  { r: 167, g: 139, b: 250 }, // purple
  { r: 156, g: 163, b: 175 }, // gray
];

function chromaLerp(t: number): { r: number; g: number; b: number } {
  const n = CHROMA_COLORS.length;
  const scaled = ((t % 1) + 1) % 1 * n;
  const i = Math.floor(scaled) % n;
  const f = scaled - Math.floor(scaled);
  const a = CHROMA_COLORS[i];
  const b = CHROMA_COLORS[(i + 1) % n];
  return {
    r: a.r + (b.r - a.r) * f,
    g: a.g + (b.g - a.g) * f,
    b: a.b + (b.b - a.b) * f,
  };
}

function lerpRGB(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
) {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}

export default function OrchestratorExperiment() {
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
    let hoveredTentacle = -1;
    const tipScales = CAPABILITIES.map(() => 1);
    let hubColor = { r: 0, g: 150, b: 136 };

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
    const onLeave = () => { mouseX = -1000; mouseY = -1000; hoveredTentacle = -1; };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    let raf: number;
    let time = 0;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.44;
      const bodyRx = Math.min(w, h) * 0.07;
      const bodyRy = bodyRx * 1.15;

      // Breathing
      const breath = prefersReduced ? 1 : 1 + Math.sin(time * 1.2) * 0.04;
      const rx = bodyRx * breath;
      const ry = bodyRy * breath;

      // Mouse influence on body position
      const mdx = mouseX > -500 ? (mouseX - cx) * 0.012 : 0;
      const mdy = mouseX > -500 ? (mouseY - cy) * 0.008 : 0;
      const bx = cx + mdx;
      const by = cy + mdy;

      // Mouse distance to hub → affects chromatophore speed
      const distToHub = mouseX > -500 ? Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2) : 9999;
      const proximityBoost = Math.max(0, 1 - distToHub / 300) * 0.8;

      // --- FAN ANGLES: left-to-right, spread ~210° ---
      const tentacleLength = Math.min(w, h) * 0.28;
      const fanStart = -Math.PI * 0.85; // left
      const fanEnd = Math.PI * 0.85;    // right (wrapping below)
      const n = CAPABILITIES.length;

      // Detect hovered tentacle FIRST
      hoveredTentacle = -1;
      const tipPositions: { x: number; y: number }[] = [];

      CAPABILITIES.forEach((_, i) => {
        const baseAngle = fanStart + (i / (n - 1)) * (fanEnd - fanStart);
        const sway = prefersReduced ? 0 : Math.sin(time * (0.5 + i * 0.08) + i * 1.8) * 0.09
          + Math.sin(time * (0.25 + i * 0.04) + i * 3.1) * 0.02;
        const angle = baseAngle + sway;

        const endX = bx + Math.cos(angle) * tentacleLength;
        const endY = by + Math.sin(angle) * tentacleLength;

        // Mouse attraction — gentle suggestion, not possession
        let finalEndX = endX, finalEndY = endY;
        if (mouseX > -500) {
          const d = Math.sqrt((mouseX - endX) ** 2 + (mouseY - endY) ** 2);
          if (d < 120) {
            const pull = (1 - d / 120) * 0.12;
            finalEndX += (mouseX - endX) * pull;
            finalEndY += (mouseY - endY) * pull;
          }
        }

        tipPositions.push({ x: finalEndX, y: finalEndY });

        const distToTip = Math.sqrt((mouseX - finalEndX) ** 2 + (mouseY - finalEndY) ** 2);
        if (distToTip < 45) hoveredTentacle = i;
      });

      // Smooth tip scales
      CAPABILITIES.forEach((_, i) => {
        const target = hoveredTentacle === i ? 2.2 : 1;
        tipScales[i] += (target - tipScales[i]) * 0.05;
      });

      // Hub color: lerp toward hovered tentacle color (or idle chromatophore cycle)
      const colorSpeed = prefersReduced ? 0 : time * (0.06 + proximityBoost * 0.08);
      const idleColor = chromaLerp(colorSpeed);
      const targetColor = hoveredTentacle >= 0 ? CAPABILITIES[hoveredTentacle].color : idleColor;
      hubColor = lerpRGB(hubColor, targetColor, hoveredTentacle >= 0 ? 0.08 : 0.04);

      const bodyColorDark = { r: hubColor.r * 0.5, g: hubColor.g * 0.5, b: hubColor.b * 0.5 };

      // --- DRAW TENTACLES ---
      CAPABILITIES.forEach((cap, i) => {
        const baseAngle = fanStart + (i / (n - 1)) * (fanEnd - fanStart);
        const sway = prefersReduced ? 0 : Math.sin(time * (0.5 + i * 0.08) + i * 1.8) * 0.09
          + Math.sin(time * (0.25 + i * 0.04) + i * 3.1) * 0.02;
        const angle = baseAngle + sway;

        const { x: finalEndX, y: finalEndY } = tipPositions[i];
        const { r, g, b } = cap.color;
        const scale = tipScales[i];
        const isHovered = hoveredTentacle === i;

        // Bezier control points — smooth organic curve, single wave
        const cp1x = bx + Math.cos(angle + 0.20) * tentacleLength * 0.35;
        const cp1y = by + Math.sin(angle + 0.20) * tentacleLength * 0.35;
        const cp2x = bx + Math.cos(angle - 0.12) * tentacleLength * 0.7;
        const cp2y = by + Math.sin(angle - 0.12) * tentacleLength * 0.7;

        // Tentacle glow
        ctx.beginPath();
        ctx.moveTo(bx + Math.cos(angle) * rx * 0.8, by + Math.sin(angle) * ry * 0.8);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, finalEndX, finalEndY);
        ctx.strokeStyle = `rgba(${r},${g},${b},${isHovered ? 0.12 : 0.05})`;
        ctx.lineWidth = isHovered ? 16 : 10;
        ctx.lineCap = "round";
        ctx.stroke();

        // Tentacle line
        ctx.beginPath();
        ctx.moveTo(bx + Math.cos(angle) * rx * 0.8, by + Math.sin(angle) * ry * 0.8);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, finalEndX, finalEndY);
        ctx.strokeStyle = `rgba(${r},${g},${b},${isHovered ? 0.6 : 0.3})`;
        ctx.lineWidth = isHovered ? 3.5 : 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Energy pulse along tentacle
        if (!prefersReduced) {
          const pulseT = (time * 0.45 + i * 0.45) % 1;
          const t2 = pulseT * pulseT, t3 = t2 * pulseT;
          const mt = 1 - pulseT, mt2 = mt * mt, mt3 = mt2 * mt;
          const sx = bx + Math.cos(angle) * rx * 0.8;
          const sy = by + Math.sin(angle) * ry * 0.8;
          const px = mt3 * sx + 3 * mt2 * pulseT * cp1x + 3 * mt * t2 * cp2x + t3 * finalEndX;
          const py = mt3 * sy + 3 * mt2 * pulseT * cp1y + 3 * mt * t2 * cp2y + t3 * finalEndY;
          const pAlpha = Math.sin(pulseT * Math.PI) * 0.8;

          ctx.beginPath();
          ctx.arc(px, py, isHovered ? 4 : 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${pAlpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${pAlpha * 0.15})`;
          ctx.fill();
        }

        // Tip node — scales up on hover
        const tipR = 6 * scale;

        // Tip glow
        ctx.beginPath();
        ctx.arc(finalEndX, finalEndY, tipR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 0.08 : 0.04})`;
        ctx.fill();

        // Tip fill
        ctx.beginPath();
        ctx.arc(finalEndX, finalEndY, tipR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 0.3 : 0.15})`;
        ctx.strokeStyle = `rgba(${r},${g},${b},${isHovered ? 0.6 : 0.3})`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.fill();
        ctx.stroke();

        // Icon inside tip
        ctx.font = `${Math.round(tipR * 0.8)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 1 : 0.7})`;
        ctx.fillText(cap.icon, finalEndX, finalEndY);

        // Label — always visible
        const labelAngle = Math.atan2(finalEndY - by, finalEndX - bx);
        const labelDist = tipR + 16;
        const labelX = finalEndX + Math.cos(labelAngle) * labelDist;
        const labelY = finalEndY + Math.sin(labelAngle) * labelDist;

        ctx.font = `${isHovered ? "bold 13" : "11"}px ui-monospace, monospace`;
        const textWidth = ctx.measureText(cap.label).width;

        // Background pill
        ctx.fillStyle = `rgba(10, 22, 40, ${isHovered ? 0.8 : 0.55})`;
        ctx.beginPath();
        ctx.roundRect(labelX - textWidth / 2 - 8, labelY - 9, textWidth + 16, 20, 5);
        ctx.fill();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${r},${g},${b},${isHovered ? 0.95 : 0.7})`;
        ctx.fillText(cap.label, labelX, labelY);

        // Expanded info panel on hover
        if (isHovered && scale > 1.5) {
          const panelX = labelX;
          const panelY = labelY + 18;

          const panelW = 210;
          const panelH = 52;
          const px0 = panelX - panelW / 2;
          const py0 = panelY - 2;

          ctx.fillStyle = "rgba(10, 22, 40, 0.88)";
          ctx.beginPath();
          ctx.roundRect(px0, py0, panelW, panelH, 6);
          ctx.fill();

          ctx.strokeStyle = `rgba(${r},${g},${b},0.25)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(px0, py0, panelW, panelH, 6);
          ctx.stroke();

          // Description text (word-wrap)
          ctx.font = "10px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;

          const words = cap.desc.split(" ");
          let line = "";
          let lineY2 = py0 + 15;
          words.forEach(word => {
            const test = line + (line ? " " : "") + word;
            if (ctx.measureText(test).width > panelW - 18) {
              ctx.fillText(line, panelX, lineY2);
              line = word;
              lineY2 += 13;
            } else {
              line = test;
            }
          });
          if (line) ctx.fillText(line, panelX, lineY2);
        }
      });

      // --- BODY ---
      const hr = Math.round(hubColor.r);
      const hg = Math.round(hubColor.g);
      const hb = Math.round(hubColor.b);

      // Body glow — reactive colored
      const gradient = ctx.createRadialGradient(bx, by, rx * 0.3, bx, by, rx * 3);
      gradient.addColorStop(0, `rgba(${hr},${hg},${hb},0.14)`);
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(bx, by, rx * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Body shape — gradient
      ctx.beginPath();
      ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2);
      const bodyGrad = ctx.createLinearGradient(bx - rx, by - ry, bx + rx, by + ry);
      bodyGrad.addColorStop(0, `rgb(${hr},${hg},${hb})`);
      bodyGrad.addColorStop(1, `rgb(${Math.round(bodyColorDark.r)},${Math.round(bodyColorDark.g)},${Math.round(bodyColorDark.b)})`);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Chromatophore spots
      if (!prefersReduced) {
        const spotCount = 8;
        for (let s = 0; s < spotCount; s++) {
          const spotPhase = colorSpeed + s * 0.15 + Math.sin(time * 0.35 + s * 1.7) * 0.08;
          const spotColor = chromaLerp(spotPhase);
          const spotAngle = (s / spotCount) * Math.PI * 2 + time * 0.06;
          const spotDist = rx * (0.35 + Math.sin(time * 0.25 + s) * 0.15);
          const sx = bx + Math.cos(spotAngle) * spotDist;
          const sy = by + Math.sin(spotAngle) * spotDist * (ry / rx);
          const spotR = rx * (0.1 + Math.sin(time * 0.4 + s * 2) * 0.035);

          ctx.beginPath();
          ctx.arc(sx, sy, spotR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(spotColor.r)},${Math.round(spotColor.g)},${Math.round(spotColor.b)},0.4)`;
          ctx.fill();
        }
      }

      // Body highlight
      ctx.beginPath();
      ctx.ellipse(bx - rx * 0.15, by - ry * 0.25, rx * 0.45, ry * 0.28, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fill();

      // --- EYES (follow cursor) ---
      const eyeSpacing = rx * 0.38;
      const eyeY = by - ry * 0.12;
      const eyeR = rx * 0.2;
      const pupilR = eyeR * 0.55;

      let lookX = 0, lookY = 0;
      if (mouseX > -500) {
        const dx = mouseX - bx, dy = mouseY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxLook = eyeR * 0.35;
        const lookDist = Math.min(dist * 0.02, maxLook);
        lookX = (dx / (dist || 1)) * lookDist;
        lookY = (dy / (dist || 1)) * lookDist;
      }

      [-1, 1].forEach(side => {
        const ex = bx + side * eyeSpacing;
        ctx.beginPath();
        ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex + lookX, eyeY + lookY, pupilR, 0, Math.PI * 2);
        ctx.fillStyle = "#0a1628";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex + lookX - pupilR * 0.3, eyeY + lookY - pupilR * 0.3, pupilR * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();
      });

      // Smile
      ctx.beginPath();
      ctx.arc(bx, by + ry * 0.15, rx * 0.22, 0.1, Math.PI - 0.1);
      ctx.strokeStyle = "#0a1628";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Hub label
      ctx.font = "9px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(${hr},${hg},${hb},0.45)`;
      ctx.fillText("MidOS", bx, by + ry + 16);

      // Interaction hint
      if (hoveredTentacle < 0 && distToHub > 200) {
        ctx.font = "10px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillText("explore each capability", cx, h - 80);
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

      <div className="relative z-10 pt-12 text-center px-6" data-reveal>
        <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600 mb-2">
          The Orchestrator
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
          One Mind, Many Hands
        </h2>
        <p className="mt-2 text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
          Eight capabilities. One coordinator. Zero&nbsp;collisions.
        </p>
      </div>

      {/* Transition: Orchestrator → Topology */}
      <div className="fixed bottom-14 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-gray-500 text-xs sm:text-sm">
          When things connect, patterns appear.
        </p>
        <p className="text-gray-700 text-[10px] mt-1">
          That&apos;s what your agent actually&nbsp;uses.
        </p>
      </div>

      <div className="fixed bottom-6 left-6 z-20">
        <a href="/sandbox/orchestrator" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          &larr; all orchestrator versions
        </a>
      </div>
    </main>
  );
}
