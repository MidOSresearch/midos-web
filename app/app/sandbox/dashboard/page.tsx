"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useCanvasTopology } from "@/lib/ui/hooks/useCanvasTopology";
import { PenguinSVG } from "@/lib/ui/characters";
import { CoordinatorOctopusSVG } from "@/lib/ui/characters";

/* ─── Types ─── */

interface SystemStatus {
  ok: boolean;
  ts: number;
  community: {
    status: string;
    version: string;
    uptime_s: number;
    users: number;
    atoms: number;
  };
  knowledge: {
    chunks: number;
    skills: number;
    truth: number;
    eureka: number;
    sota: number;
    vectors: number;
    coherence: number;
  };
  security: {
    grade: string;
    pass_rate: number;
    findings: number;
    high: number;
    low: number;
  };
  infra: {
    hooks: number;
    tools: number;
    skills_claude: number;
    mcp_tools: number;
  };
}

/* ─── Helpers ─── */

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return n.toLocaleString();
}

function fmtUptime(s: number): string {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function timeSince(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

/* ─── Counter hook ─── */

function useCounter(target: number, duration = 1400): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setVal(target);
        clearInterval(id);
      } else {
        setVal(cur);
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return val;
}

/* ─── Pipeline Flow Canvas ─── */

const TIER_DEFS = [
  { key: "chunks", label: "Chunks", color: "#6ee7b7", rgb: [110, 231, 183] },
  { key: "skills", label: "Skills", color: "#67e8f9", rgb: [103, 232, 249] },
  { key: "truth", label: "Truth", color: "#60a5fa", rgb: [96, 165, 250] },
  { key: "eureka", label: "Eureka", color: "#fbbf24", rgb: [251, 191, 36] },
  { key: "sota", label: "SOTA", color: "#c084fc", rgb: [192, 132, 252] },
] as const;

interface Particle {
  x: number;
  y: number;
  tier: number;
  progress: number;
  speed: number;
  size: number;
}

function usePipelineCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  counts: number[],
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Node positions (vertical pipeline)
    const getNodeY = (i: number, h: number) => 50 + (i / (TIER_DEFS.length - 1)) * (h - 100);
    const nodeX = () => {
      const rect = canvas.getBoundingClientRect();
      return rect.width / 2;
    };

    // Particles
    const particles: Particle[] = [];
    const spawnParticle = () => {
      const tier = Math.floor(Math.random() * (TIER_DEFS.length - 1));
      const rect = canvas.getBoundingClientRect();
      const cx = nodeX();
      particles.push({
        x: cx + (Math.random() - 0.5) * 8,
        y: getNodeY(tier, rect.height),
        tier,
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        size: 1.5 + Math.random() * 2,
      });
    };

    let frame: number;
    let tick = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const cx = nodeX();

      // Spawn particles
      tick++;
      if (tick % 8 === 0 && particles.length < 60) spawnParticle();

      // Draw connections between tiers
      for (let i = 0; i < TIER_DEFS.length - 1; i++) {
        const y1 = getNodeY(i, h);
        const y2 = getNodeY(i + 1, h);
        const grad = ctx.createLinearGradient(cx, y1, cx, y2);
        const [r1, g1, b1] = TIER_DEFS[i].rgb;
        const [r2, g2, b2] = TIER_DEFS[i + 1].rgb;
        grad.addColorStop(0, `rgba(${r1},${g1},${b1},0.15)`);
        grad.addColorStop(1, `rgba(${r2},${g2},${b2},0.15)`);
        ctx.beginPath();
        ctx.moveTo(cx, y1 + 18);
        ctx.lineTo(cx, y2 - 18);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw particles (flowing between tiers)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const y1 = getNodeY(p.tier, h);
        const y2 = getNodeY(p.tier + 1, h);
        p.y = y1 + (y2 - y1) * p.progress;
        p.x = cx + Math.sin(p.progress * Math.PI * 3 + p.tier) * 6;

        const [r, g, b] = TIER_DEFS[p.tier].rgb;
        const alpha = Math.sin(p.progress * Math.PI) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
        ctx.fill();
      }

      // Draw tier nodes
      for (let i = 0; i < TIER_DEFS.length; i++) {
        const y = getNodeY(i, h);
        const [r, g, b] = TIER_DEFS[i].rgb;
        const count = counts[i] ?? 0;

        // Node glow
        const breath = Math.sin(Date.now() * 0.002 + i * 1.2) * 0.15 + 0.85;
        const glowR = 20 + count * 0.001;
        const glow = ctx.createRadialGradient(cx, y, 0, cx, y, glowR);
        glow.addColorStop(0, `rgba(${r},${g},${b},${0.25 * breath})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(cx, y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(cx, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.15 * breath})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.6 * breath})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(cx, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.9 * breath})`;
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, counts]);
}

/* ─── Penguin speech bubble ─── */

function PenguinStatus({
  grade,
  isOnline,
  chunks,
  coherence,
  findings,
}: {
  grade: string;
  isOnline: boolean;
  chunks: number;
  coherence: number;
  findings: number;
}) {
  const messages = (() => {
    const msgs: string[] = [];
    if (grade === "A" && isOnline) msgs.push("Todo tranqui, jefe.");
    else if (grade === "A") msgs.push("Bien, pero offline.");
    else msgs.push("Hay laburo que hacer...");

    if (chunks > 19000) msgs.push(`${fmtNum(chunks)} chunks. La biblioteca crece.`);
    if (coherence > 0.84) msgs.push(`Coherencia ${(coherence * 100).toFixed(0)}%. Nada mal.`);
    else if (coherence > 0) msgs.push(`Coherencia ${(coherence * 100).toFixed(0)}%. Hay que pulir.`);
    if (findings === 0) msgs.push("Cero findings. Blindado.");
    else if (findings > 0) msgs.push(`${findings} finding${findings > 1 ? "s" : ""}. Ojo.`);
    if (!isOnline) msgs.push("MCP offline. Solo modo local.");

    msgs.push("Del intercambio nace la creatividad.");
    return msgs;
  })();

  const [msgIdx, setMsgIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="flex items-end gap-3">
      <div className="relative">
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                      bg-white/[0.08] backdrop-blur-md border border-white/[0.1]
                      rounded-lg px-3 py-1.5 text-xs text-gray-300 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {messages[msgIdx]}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3
                          bg-white/[0.08] border-b border-r border-white/[0.1]
                          rotate-45" />
        </div>
        <PenguinSVG
          className="w-16 h-20 drop-shadow-lg"
          style={{
            animation: "pengu-bob 3s ease-in-out infinite",
            filter: "drop-shadow(0 4px 12px rgba(0,150,136,0.2))",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Draggable Notes (bolsitas de pengü) ─── */

interface NoteData {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  anchor: string;
  open: boolean;
}

const NOTES_KEY = "midos-dash-notes";

function loadNotes(): NoteData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return [
    { id: "n1", x: 30, y: 660, w: 220, h: 70, text: "", anchor: "pipeline", open: false },
    { id: "n2", x: 280, y: 660, w: 220, h: 70, text: "", anchor: "security", open: false },
  ];
}

function saveNotes(notes: NoteData[]) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch { /* noop */ }
}

function findNearestAnchor(x: number, y: number): string {
  const anchors = document.querySelectorAll("[data-note-anchor]");
  let best = "unknown";
  let bestDist = Infinity;
  anchors.forEach((el) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.hypot(x - cx, y - cy);
    if (d < bestDist) {
      bestDist = d;
      best = el.getAttribute("data-note-anchor") ?? "unknown";
    }
  });
  return best;
}

const ANCHOR_COLORS: Record<string, string> = {
  pipeline: "#6ee7b7",
  vectors: "#14b8a6",
  coherence: "#60a5fa",
  security: "#34d399",
  community: "#4db6ac",
  infra: "#e5e7eb",
  unknown: "#9ca3af",
};

function DraggableNote({
  note,
  onUpdate,
  onDelete,
}: {
  note: NoteData;
  onUpdate: (n: NoteData) => void;
  onDelete: (id: string) => void;
}) {
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; ow: number; oh: number } | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  /* Drag */
  const onDragDown = (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: note.x, oy: note.y };
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    onUpdate({ ...note, x: dragRef.current.ox + e.clientX - dragRef.current.startX, y: dragRef.current.oy + e.clientY - dragRef.current.startY });
  };
  const onDragUp = () => {
    if (!dragRef.current) return;
    const el = noteRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      onUpdate({ ...note, anchor: findNearestAnchor(r.left + r.width / 2, r.top + r.height / 2) });
    }
    dragRef.current = null;
  };

  /* Resize */
  const onResizeDown = (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, ow: note.w, oh: note.h };
  };
  const onResizeMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    onUpdate({
      ...note,
      w: Math.max(140, resizeRef.current.ow + e.clientX - resizeRef.current.startX),
      h: Math.max(40, resizeRef.current.oh + e.clientY - resizeRef.current.startY),
    });
  };
  const onResizeUp = () => { resizeRef.current = null; };

  const accentColor = ANCHOR_COLORS[note.anchor] ?? ANCHOR_COLORS.unknown;

  return (
    <div
      ref={noteRef}
      className="fixed z-50 select-none"
      style={{ left: note.x, top: note.y, width: note.w, touchAction: "none" }}
    >
      {/* Penguin drag handle */}
      <div
        className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing
                   bg-penguin-surface/80 backdrop-blur-md border border-white/[0.1]
                   rounded-t-lg px-2 py-1"
        style={{ borderBottomColor: `${accentColor}40` }}
        onPointerDown={onDragDown}
        onPointerMove={onDragMove}
        onPointerUp={onDragUp}
      >
        <svg viewBox="0 0 24 28" className="w-5 h-6 shrink-0" aria-hidden="true">
          <ellipse cx="12" cy="17" rx="8" ry="9" fill="#1a2940" />
          <ellipse cx="12" cy="18" rx="5" ry="6.5" fill="#e0f2f1" />
          <circle cx="12" cy="9" r="5.5" fill="#1a2940" />
          <circle cx="10" cy="8" r="1" fill="white" />
          <circle cx="14" cy="8" r="1" fill="white" />
          <circle cx="10.3" cy="8" r="0.5" fill="#0a1628" />
          <circle cx="14.3" cy="8" r="0.5" fill="#0a1628" />
          <polygon points="11,11 13,11 12,13" fill="#f59e0b" />
        </svg>
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: accentColor }}>
          {note.anchor}
        </span>
        <div className="flex-1" />
        <button
          className="text-gray-500 hover:text-gray-300 text-xs px-1"
          onClick={(e) => { e.stopPropagation(); onUpdate({ ...note, open: !note.open }); }}
        >{note.open ? "\u25B4" : "\u25BE"}</button>
        <button
          className="text-gray-600 hover:text-red-400 text-xs px-1"
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
        >x</button>
      </div>

      {/* Note body (resizable) */}
      {note.open && (
        <div
          className="relative bg-penguin-bg/90 backdrop-blur-md border border-white/[0.08] border-t-0
                     rounded-b-lg p-2 overflow-hidden"
          style={{ height: note.h, boxShadow: `0 4px 20px ${accentColor}10` }}
        >
          <textarea
            className="w-full h-full bg-transparent text-gray-300 text-xs font-mono resize-none
                       outline-none placeholder:text-gray-600"
            placeholder="tu comentario..."
            value={note.text}
            onChange={(e) => onUpdate({ ...note, text: e.target.value })}
          />
          {note.text && (
            <span className="absolute bottom-1 left-2 text-[9px] text-gray-600 pointer-events-none">
              {note.text.length}
            </span>
          )}
          {/* Resize grip */}
          <div
            className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize"
            style={{ touchAction: "none" }}
            onPointerDown={onResizeDown}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
          >
            <svg viewBox="0 0 16 16" className="w-full h-full opacity-30 hover:opacity-70 transition-opacity">
              <path d="M14 14L8 14L14 8Z" fill={accentColor} />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function NotesLayer() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // Load from localStorage on mount
  useEffect(() => { setNotes(loadNotes()); }, []);

  // Save on every change
  useEffect(() => { if (notes.length > 0) saveNotes(notes); }, [notes]);

  const updateNote = useCallback((updated: NoteData) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(next);
      return next;
    });
  }, []);

  const addNote = () => {
    const id = `n${Date.now()}`;
    const x = 80 + Math.random() * 200;
    const y = 200 + Math.random() * 300;
    setNotes((prev) => [...prev, { id, x, y, w: 220, h: 80, text: "", anchor: "unknown", open: true }]);
    setShowAdd(false);
  };

  return (
    <>
      {notes.map((n) => (
        <DraggableNote key={n.id} note={n} onUpdate={updateNote} onDelete={deleteNote} />
      ))}

      {/* Add note FAB */}
      <button
        className="fixed z-50 bottom-6 right-6 w-10 h-10 rounded-full
                   bg-teal-600/80 hover:bg-teal-500/80 backdrop-blur-sm
                   border border-teal-400/20 text-white text-lg font-bold
                   shadow-lg shadow-teal-900/30 transition-all hover:scale-110
                   flex items-center justify-center"
        onClick={addNote}
        title="Nueva nota"
      >
        +
      </button>
    </>
  );
}

/* ─── Main Dashboard ─── */

export default function DashboardPage() {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/system-status");
      const json: SystemStatus = await res.json();
      setData(json);
      setLastFetch(Date.now());
    } catch {
      /* keep stale */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5_000);
    return () => clearInterval(id);
  }, []);

  const k = data?.knowledge;
  const c = data?.community;
  const s = data?.security;
  const inf = data?.infra;
  const isOnline = c?.status === "alive" || c?.status === "healthy";
  const counts = [
    k?.chunks ?? 0,
    k?.skills ?? 0,
    k?.truth ?? 0,
    k?.eureka ?? 0,
    k?.sota ?? 0,
  ];

  // Background topology canvas
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTopology(bgCanvasRef, { density: 0.2, mouseGlow: true, brightness: 0.6 });

  // Pipeline flow canvas
  const pipeCanvasRef = useRef<HTMLCanvasElement>(null);
  usePipelineCanvas(pipeCanvasRef, counts);

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 relative overflow-hidden">
      {/* Keyframe animations */}
      <style>{`
        @keyframes pengu-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Draggable notes overlay */}
      <NotesLayer />

      {/* Background: topology constellation */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 w-full h-full opacity-30 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* ─── Header ─── */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">MidOS</h1>
            <span className="text-[11px] font-mono text-teal-400/70 bg-teal-500/[0.08] border border-teal-500/20 px-2.5 py-1 rounded-md">
              {loading ? "..." : c?.version && c.version !== "?" ? `v${c.version}` : "local"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                loading
                  ? "border-gray-600/50 text-gray-400 bg-gray-800/30"
                  : isOnline
                    ? "border-emerald-400/25 text-emerald-300 bg-emerald-500/[0.08]"
                    : "border-amber-400/25 text-amber-300 bg-amber-500/[0.08]"
              }`}
            >
              <span
                className={`relative inline-flex w-2 h-2 rounded-full ${
                  loading ? "bg-gray-500 animate-pulse" : isOnline ? "bg-emerald-400" : "bg-amber-400"
                }`}
              >
                {isOnline && !loading && (
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                )}
              </span>
              {loading ? "..." : isOnline ? "LIVE" : "LOCAL"}
            </div>
            {lastFetch > 0 && (
              <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                {timeSince(lastFetch)}
              </span>
            )}
          </div>
        </header>

        {/* ─── Health summary ─── */}
        {!loading && data && (
          <div className="flex items-center gap-3 mb-6 px-1 text-[11px] text-gray-500 font-mono animate-[fadeIn_0.6s_ease-out]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{
                backgroundColor: (k?.coherence ?? 0) > 0.84 ? "#34d399" : (k?.coherence ?? 0) > 0.75 ? "#fbbf24" : "#f87171"
              }} />
              {fmtNum(k?.chunks ?? 0)} chunks
            </span>
            <span className="text-gray-700">/</span>
            <span>{k?.skills ?? 0} skills</span>
            <span className="text-gray-700">/</span>
            <span>{fmtNum(k?.vectors ?? 0)} vectors</span>
            <span className="text-gray-700">/</span>
            <span style={{ color: s?.grade === "A" ? "#34d39988" : "#f8717188" }}>
              grade {s?.grade ?? "?"}
            </span>
            {isOnline && <span className="text-gray-700">/ <span className="text-emerald-500/60">{c?.users ?? 0} users</span></span>}
          </div>
        )}

        {/* ─── Main grid: Pipeline center + stats sides ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_1fr] gap-6 mb-8">

          {/* Left column: Knowledge counts + vectors */}
          <div className="space-y-4 order-2 lg:order-1" data-note-anchor="pipeline">
            {/* Tier cards in 2-col mini grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {TIER_DEFS.map((t, i) => {
                const val = counts[i];
                const animated = useCounter(val);
                const isChunks = i === 0;
                return (
                  <div
                    key={t.key}
                    className={`group relative rounded-xl transition-all duration-300 hover:scale-[1.03]
                               border backdrop-blur-sm overflow-hidden ${isChunks ? "p-5 col-span-2" : "p-4"}`}
                    style={{
                      background: `rgba(${t.rgb.join(",")},${isChunks ? 0.08 : 0.06})`,
                      borderColor: `rgba(${t.rgb.join(",")},${isChunks ? 0.22 : 0.15})`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 100%, rgba(${t.rgb.join(",")},0.12), transparent 70%)`,
                      }}
                    />
                    {isChunks ? (
                      <div className="relative flex items-baseline justify-between">
                        <div>
                          <p className="text-3xl font-extrabold font-mono" style={{ color: t.color }}>
                            {fmtNum(animated)}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: `${t.color}88` }}>
                            {t.label}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-gray-600">L1 &middot; foundation</span>
                      </div>
                    ) : (
                      <>
                        <p className="relative text-2xl font-bold font-mono" style={{ color: t.color }}>
                          {fmtNum(animated)}
                        </p>
                        <p className="relative text-[10px] uppercase tracking-widest mt-1" style={{ color: `${t.color}88` }}>
                          {t.label}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Vectors card */}
              <div className="rounded-xl p-4 border border-teal-500/15 bg-teal-500/[0.04] backdrop-blur-sm" data-note-anchor="vectors">
                <p className="text-2xl font-bold font-mono text-teal-400">
                  {fmtNum(useCounter(k?.vectors ?? 0))}
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-1 text-teal-400/50">
                  Vectors
                </p>
              </div>
            </div>

            {/* Coherence bar */}
            <div className="rounded-xl border border-blue-400/15 bg-blue-500/[0.04] backdrop-blur-sm p-4
                            hover:border-blue-400/25 transition-all duration-300" data-note-anchor="coherence">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-gray-400">Coherence</span>
                <span className="text-lg font-bold font-mono text-blue-400">
                  {((k?.coherence ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(k?.coherence ?? 0) * 100}%`,
                    background: "linear-gradient(90deg, #60a5fa60, #60a5fa)",
                    boxShadow: "0 0 12px rgba(96,165,250,0.3)",
                  }}
                />
                {/* Milestone markers */}
                {[80, 90].map((m) => (
                  <div
                    key={m}
                    className="absolute top-0 h-full w-px"
                    style={{ left: `${m}%`, background: (k?.coherence ?? 0) * 100 >= m ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.08)" }}
                  >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-gray-600">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center column: Pipeline flow visualization */}
          <div className="relative order-1 lg:order-2 hidden lg:block">
            <canvas
              ref={pipeCanvasRef}
              className="w-full h-full min-h-[400px]"
              style={{ imageRendering: "auto" }}
            />
            {/* Tier labels alongside nodes */}
            {TIER_DEFS.map((t, i) => (
              <div
                key={t.key}
                className="absolute left-full ml-3 -translate-y-1/2 whitespace-nowrap hidden xl:flex items-center gap-2"
                style={{ top: `${(i / (TIER_DEFS.length - 1)) * 100}%` }}
              >
                <span className="text-[10px] font-mono font-medium" style={{ color: `${t.color}99` }}>
                  L{i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Right column: Community + Security + Infra */}
          <div className="space-y-4 order-3">
            {/* Security */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5
                            hover:border-emerald-500/20 transition-all duration-300" data-note-anchor="security">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Security</span>
                <div className="relative">
                  {s?.grade === "A" && (
                    <span className="absolute inset-0 text-4xl font-black font-mono leading-none text-emerald-400/20 blur-md animate-pulse">
                      {s.grade}
                    </span>
                  )}
                  <span
                    className="relative text-4xl font-black font-mono leading-none"
                    style={{
                      color: s?.grade === "A" ? "#34d399" : s?.grade === "B" ? "#fbbf24" : "#f87171",
                      textShadow: s?.grade === "A" ? "0 0 24px rgba(52,211,153,0.3)" : "none",
                    }}
                  >
                    {s?.grade ?? "?"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Pass rate</span>
                <span className="font-mono text-emerald-400">{s?.pass_rate ?? 0}%</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-gray-500">Findings</span>
                <div className="flex items-center gap-2 font-mono">
                  {(s?.high ?? 0) > 0 && <span className="text-red-400 text-[10px]">{s?.high}H</span>}
                  {(s?.low ?? 0) > 0 && <span className="text-amber-400 text-[10px]">{s?.low}L</span>}
                  <span className="text-gray-300">{s?.findings ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5
                            hover:border-teal-500/20 transition-all duration-300" data-note-anchor="community">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Community</span>
                <CoordinatorOctopusSVG className="w-6 h-6 opacity-50" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Server</span>
                  <span className={`font-mono font-semibold ${isOnline ? "text-emerald-400" : "text-amber-400"}`}>
                    {isOnline ? "Online" : "Local"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Uptime</span>
                  <span className="font-mono text-gray-300">{fmtUptime(c?.uptime_s ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Users</span>
                  <span className="font-mono text-gray-300">{c?.users ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Atoms</span>
                  <span className="font-mono text-gray-300">{c?.atoms ?? "-"}</span>
                </div>
              </div>
            </div>

            {/* Infra */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5
                            hover:border-white/[0.12] transition-all duration-300" data-note-anchor="infra">
              <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Infra</span>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  { label: "Tools", val: inf?.tools ?? 0, color: "#14b8a6", icon: "T" },
                  { label: "Hooks", val: inf?.hooks ?? 0, color: "#fbbf24", icon: "H" },
                  { label: "Skills", val: inf?.skills_claude ?? 0, color: "#c084fc", icon: "S" },
                  { label: "MCP", val: inf?.mcp_tools ?? 0, color: "#60a5fa", icon: "M" },
                ].map((item) => (
                  <div key={item.label} className="text-center group/inf">
                    <p className="text-xl font-bold font-mono transition-all duration-200 group-hover/inf:scale-110" style={{ color: item.color }}>
                      {item.val}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider transition-colors" style={{ color: `${item.color}66` }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Footer with Penguin ─── */}
        <footer className="flex items-end justify-between pt-6 border-t border-white/[0.05]">
          <div>
            <p className="text-[11px] text-gray-500 font-mono flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-teal-500/40 animate-pulse" />
              auto-refresh 30s &middot; pulse.json + security_pulse.json
              {lastFetch > 0 && <span className="text-gray-600">&middot; fetched {timeSince(lastFetch)}</span>}
            </p>
            <Link
              href="/sandbox"
              className="group text-xs text-gray-500 hover:text-teal-400 transition-colors mt-1.5 inline-flex items-center gap-1"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span> back to sandbox
            </Link>
          </div>
          <PenguinStatus
            grade={s?.grade ?? "?"}
            isOnline={isOnline}
            chunks={k?.chunks ?? 0}
            coherence={k?.coherence ?? 0}
            findings={s?.findings ?? 0}
          />
        </footer>
      </div>
    </main>
  );
}
