"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDataReveal } from "@/lib/ui/hooks";

/**
 * Graph Viewer v1 — Interactive architecture graph, pure Canvas 2D
 *
 * Ported from tools/graph_viewer.html into sandbox.
 * Features: pan, zoom, node inspector, filter chips, search, glass panels.
 * Uses pipeline tier colors + demo MidOS topology data.
 *
 * Next: load real architecture_sigma.json, add idle animations.
 */

// Pipeline tier colors (matching sandbox design system)
const TIER_COLORS: Record<string, string> = {
  staging:   "#9ca3af",
  chunks:    "#34d399",
  skills:    "#38bdf8",
  truth:     "#fbbf24",
  eureka:    "#a78bfa",
  sota:      "#c084fc",
  tool:      "#58a6ff",
  hook:      "#f0883e",
  mcp:       "#3fb950",
  module:    "#a371f7",
  config:    "#d29922",
  unknown:   "#484f58",
};

interface GraphNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

// Demo MidOS architecture data — real enough to be useful
function buildDemoGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const rawNodes = [
    // Pipeline tiers
    { id: "staging", label: "Staging", type: "staging", size: 14, x: 0, y: -200 },
    { id: "chunks", label: "Chunks (19K)", type: "chunks", size: 22, x: 0, y: -80 },
    { id: "skills", label: "Skills (121)", type: "skills", size: 16, x: -160, y: 20 },
    { id: "truth", label: "Truth (46)", type: "truth", size: 12, x: 0, y: 60 },
    { id: "eureka", label: "EUREKA (168)", type: "eureka", size: 14, x: 0, y: 160 },
    { id: "sota", label: "SOTA (67)", type: "sota", size: 10, x: 0, y: 260 },
    // Tools cluster
    { id: "tools", label: "Tools (412)", type: "tool", size: 18, x: 280, y: -100 },
    { id: "harvest", label: "Harvest Intel", type: "tool", size: 8, x: 360, y: -160 },
    { id: "pipeline_synergy", label: "Pipeline Synergy", type: "tool", size: 8, x: 380, y: -60 },
    { id: "vector_store", label: "Vector Store", type: "tool", size: 10, x: 340, y: 0 },
    { id: "cost_dashboard", label: "Cost Dashboard", type: "tool", size: 6, x: 400, y: -120 },
    // Hooks cluster
    { id: "hooks", label: "Hooks (65)", type: "hook", size: 14, x: -280, y: -100 },
    { id: "security_hook", label: "Security Gate", type: "hook", size: 8, x: -360, y: -160 },
    { id: "delegation_hook", label: "Delegation Guard", type: "hook", size: 8, x: -380, y: -60 },
    { id: "memory_hook", label: "Memory Protocol", type: "hook", size: 7, x: -340, y: 0 },
    // MCP
    { id: "mcp_local", label: "MCP Local (68)", type: "mcp", size: 16, x: 200, y: 140 },
    { id: "mcp_community", label: "MCP Community", type: "mcp", size: 12, x: 260, y: 220 },
    // Modules
    { id: "midos_core", label: "Rust Core (PyO3)", type: "module", size: 10, x: -200, y: 180 },
    { id: "midos_gateway", label: "Go Gateway", type: "module", size: 9, x: -260, y: 240 },
    { id: "hive_commons", label: "Hive Commons", type: "module", size: 12, x: -140, y: 120 },
    // Config
    { id: "pulse", label: "pulse.json", type: "config", size: 7, x: 140, y: -200 },
    { id: "backlog", label: "BACKLOG.md", type: "config", size: 6, x: -140, y: -200 },
  ];

  const rawEdges = [
    // Pipeline flow
    { source: "staging", target: "chunks", label: "matures" },
    { source: "chunks", target: "skills", label: "extracts" },
    { source: "chunks", target: "truth", label: "validates" },
    { source: "truth", target: "eureka", label: "promotes" },
    { source: "eureka", target: "sota", label: "elevates" },
    // Tools connections
    { source: "tools", target: "harvest", label: "contains" },
    { source: "tools", target: "pipeline_synergy", label: "contains" },
    { source: "tools", target: "vector_store", label: "contains" },
    { source: "tools", target: "cost_dashboard", label: "contains" },
    { source: "harvest", target: "staging", label: "feeds" },
    { source: "pipeline_synergy", target: "chunks", label: "orchestrates" },
    { source: "vector_store", target: "chunks", label: "indexes" },
    // Hooks connections
    { source: "hooks", target: "security_hook", label: "contains" },
    { source: "hooks", target: "delegation_hook", label: "contains" },
    { source: "hooks", target: "memory_hook", label: "contains" },
    { source: "security_hook", target: "tools", label: "guards" },
    { source: "delegation_hook", target: "mcp_local", label: "routes" },
    // MCP connections
    { source: "mcp_local", target: "chunks", label: "serves" },
    { source: "mcp_local", target: "skills", label: "serves" },
    { source: "mcp_local", target: "tools", label: "exposes" },
    { source: "mcp_community", target: "mcp_local", label: "extends" },
    // Native
    { source: "midos_core", target: "vector_store", label: "accelerates" },
    { source: "midos_gateway", target: "mcp_local", label: "proxies" },
    { source: "hive_commons", target: "vector_store", label: "provides" },
    { source: "hive_commons", target: "midos_core", label: "bridges" },
    // Config
    { source: "pulse", target: "staging", label: "tracks" },
    { source: "pulse", target: "chunks", label: "tracks" },
    { source: "backlog", target: "tools", label: "queues" },
  ];

  const nodes: GraphNode[] = rawNodes.map(n => ({
    ...n,
    color: TIER_COLORS[n.type] || TIER_COLORS.unknown,
  }));

  return { nodes, edges: rawEdges };
}

// ── World ↔ Screen transforms ──
function worldToScreen(wx: number, wy: number, camX: number, camY: number, camZoom: number, w: number, h: number): [number, number] {
  return [(wx - camX) * camZoom + w / 2, (wy - camY) * camZoom + h / 2];
}
function screenToWorld(sx: number, sy: number, camX: number, camY: number, camZoom: number, w: number, h: number): [number, number] {
  return [(sx - w / 2) / camZoom + camX, (sy - h / 2) / camZoom + camY];
}

export default function GraphViewerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  useDataReveal();

  // Build graph once
  const graphRef = useRef<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  if (!graphRef.current) graphRef.current = buildDemoGraph();
  const { nodes, edges } = graphRef.current;

  // Camera state
  const camRef = useRef({ x: 0, y: 0, zoom: 1.8 });
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; camStartX: number; camStartY: number }>({
    dragging: false, startX: 0, startY: 0, camStartX: 0, camStartY: 0,
  });
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const searchRef = useRef("");

  // Sync selected node id to ref for render loop
  useEffect(() => { selectedRef.current = selectedNode?.id ?? null; }, [selectedNode]);
  useEffect(() => { searchRef.current = search.toLowerCase(); }, [search]);

  // Initialize active types
  useEffect(() => {
    const types = new Set(nodes.map(n => n.type));
    setActiveTypes(types);
  }, [nodes]);

  const activeTypesRef = useRef(activeTypes);
  useEffect(() => { activeTypesRef.current = activeTypes; }, [activeTypes]);

  // Build neighbor map
  const neighborsRef = useRef<Map<string, Set<string>>>(new Map());
  useEffect(() => {
    const m = new Map<string, Set<string>>();
    nodes.forEach(n => m.set(n.id, new Set()));
    edges.forEach(e => {
      m.get(e.source)?.add(e.target);
      m.get(e.target)?.add(e.source);
    });
    neighborsRef.current = m;
  }, [nodes, edges]);

  // Node lookup
  const nodeMapRef = useRef<Map<string, GraphNode>>(new Map());
  useEffect(() => {
    const m = new Map<string, GraphNode>();
    nodes.forEach(n => m.set(n.id, n));
    nodeMapRef.current = m;
  }, [nodes]);

  const getNodeAt = useCallback((mx: number, my: number): GraphNode | null => {
    const cam = camRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const [wx, wy] = screenToWorld(mx, my, cam.x, cam.y, cam.zoom, w, h);

    let closest: GraphNode | null = null;
    let closestDist = Infinity;

    for (const n of nodes) {
      if (!activeTypesRef.current.has(n.type)) continue;
      const s = searchRef.current;
      if (s && !n.label.toLowerCase().includes(s) && !n.id.includes(s)) continue;
      const dx = n.x - wx, dy = n.y - wy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitR = (n.size * 0.8) / cam.zoom;
      if (dist < hitR && dist < closestDist) {
        closest = n;
        closestDist = dist;
      }
    }
    return closest;
  }, [nodes]);

  // Canvas render + interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let time = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse handlers
    const onDown = (e: MouseEvent) => {
      const node = getNodeAt(e.offsetX, e.offsetY);
      if (node) {
        setSelectedNode(node);
        camRef.current.x = node.x;
        camRef.current.y = node.y;
        return;
      }
      dragRef.current = {
        dragging: true,
        startX: e.clientX, startY: e.clientY,
        camStartX: camRef.current.x, camStartY: camRef.current.y,
      };
    };

    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (d.dragging) {
        camRef.current.x = d.camStartX - (e.clientX - d.startX) / camRef.current.zoom;
        camRef.current.y = d.camStartY - (e.clientY - d.startY) / camRef.current.zoom;
        canvas.style.cursor = "grabbing";
        return;
      }
      const node = getNodeAt(e.offsetX, e.offsetY);
      hoveredRef.current = node?.id ?? null;
      canvas.style.cursor = node ? "pointer" : "crosshair";
    };

    const onUp = () => {
      dragRef.current.dragging = false;
      canvas.style.cursor = "crosshair";
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const cam = camRef.current;
      const [wx, wy] = screenToWorld(e.offsetX, e.offsetY, cam.x, cam.y, cam.zoom, w, h);
      cam.zoom = Math.max(0.3, Math.min(10, cam.zoom * factor));
      const [nwx, nwy] = screenToWorld(e.offsetX, e.offsetY, cam.x, cam.y, cam.zoom, w, h);
      cam.x -= nwx - wx;
      cam.y -= nwy - wy;
    };

    const onDblClick = () => {
      setSelectedNode(null);
      // Auto-fit
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      nodes.forEach(n => {
        if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
        if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
      });
      camRef.current.x = (minX + maxX) / 2;
      camRef.current.y = (minY + maxY) / 2;
      camRef.current.zoom = Math.min(w / ((maxX - minX) * 1.4 || 1), h / ((maxY - minY) * 1.4 || 1));
      camRef.current.zoom = Math.max(0.5, Math.min(camRef.current.zoom, 5));
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDblClick);

    let raf: number;

    const draw = () => {
      if (!w) { raf = requestAnimationFrame(draw); return; }
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      const cam = camRef.current;
      const sel = selectedRef.current;
      const hov = hoveredRef.current;
      const srch = searchRef.current;
      const aTypes = activeTypesRef.current;
      const neighbors = neighborsRef.current;

      const isVisible = (n: GraphNode) => {
        if (!aTypes.has(n.type)) return false;
        if (srch && !n.label.toLowerCase().includes(srch) && !n.id.includes(srch)) return false;
        return true;
      };

      // Draw edges
      edges.forEach(e => {
        const sn = nodeMapRef.current.get(e.source);
        const tn = nodeMapRef.current.get(e.target);
        if (!sn || !tn || !isVisible(sn) || !isVisible(tn)) return;

        const [sx, sy] = worldToScreen(sn.x, sn.y, cam.x, cam.y, cam.zoom, w, h);
        const [tx, ty] = worldToScreen(tn.x, tn.y, cam.x, cam.y, cam.zoom, w, h);

        let alpha = 0.15;
        let lineWidth = 0.8;

        if (sel) {
          if (e.source === sel || e.target === sel) {
            alpha = 0.6; lineWidth = 2;
          } else {
            alpha = 0.04;
          }
        }

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(140,148,160,${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Edge label on selected
        if (sel && (e.source === sel || e.target === sel) && cam.zoom > 0.8) {
          const mx = (sx + tx) / 2, my = (sy + ty) / 2;
          ctx.font = "9px ui-monospace, monospace";
          ctx.fillStyle = `rgba(126,231,135,${alpha * 0.8})`;
          ctx.textAlign = "center";
          ctx.fillText(e.label, mx, my - 4);
        }
      });

      // Draw nodes
      nodes.forEach(n => {
        if (!isVisible(n)) return;
        const [sx, sy] = worldToScreen(n.x, n.y, cam.x, cam.y, cam.zoom, w, h);
        if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) return;

        let radius = n.size * cam.zoom * 0.4;
        let alpha = 1;

        if (sel) {
          if (n.id === sel) {
            radius *= 1.4;
          } else if (neighbors.get(sel)?.has(n.id)) {
            alpha = 0.9;
          } else {
            alpha = 0.15;
          }
        }
        if (hov === n.id) radius *= 1.2;

        // Idle breathing
        const breath = 0.9 + Math.sin(time * 1.2 + n.x * 0.01) * 0.1;
        radius *= breath;

        // Outer glow
        if (radius > 4 && alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(sx, sy, radius + 4, 0, Math.PI * 2);
          const c = n.color;
          ctx.fillStyle = c.replace(")", ",0.10)").replace("rgb", "rgba").replace("#", "");
          // hex to rgba glow
          const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.12 * alpha})`;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(2, radius), 0, Math.PI * 2);
        const r = parseInt(n.color.slice(1, 3), 16), g = parseInt(n.color.slice(3, 5), 16), b = parseInt(n.color.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Bright center
        if (alpha > 0.5 && radius > 5) {
          ctx.beginPath();
          ctx.arc(sx, sy, radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.2 * alpha})`;
          ctx.fill();
        }

        // Labels
        if (cam.zoom > 0.6 && alpha > 0.3) {
          const fontSize = Math.max(9, Math.min(13, radius * 0.9));
          ctx.font = `600 ${fontSize}px ui-monospace, monospace`;
          ctx.fillStyle = `rgba(230,237,243,${alpha * 0.8})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(n.label, sx, sy + radius + 4);
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDblClick);
      cancelAnimationFrame(raf);
    };
  }, [nodes, edges, getNodeAt]);

  // Compute type counts for filter chips
  const typeCounts = nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  const toggleType = (type: string) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Inspector data
  const inEdges = selectedNode ? edges.filter(e => e.target === selectedNode.id) : [];
  const outEdges = selectedNode ? edges.filter(e => e.source === selectedNode.id) : [];
  const degree = selectedNode ? (neighborsRef.current.get(selectedNode.id)?.size ?? 0) : 0;

  return (
    <main className="relative min-h-screen bg-penguin-bg text-gray-100 overflow-hidden">
      {/* Full canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "crosshair" }}
      />

      {/* Header bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 h-12 flex items-center gap-4 px-5
                    bg-penguin-bg/92 backdrop-blur-md border-b border-penguin-border"
        data-reveal
      >
        <span className="text-sm font-bold text-sky-400">
          MidOS <span className="text-gray-500 font-normal">Architecture Graph</span>
        </span>

        {/* Search */}
        <div className="flex items-center gap-2 bg-penguin-surface/60 border border-penguin-border rounded-md px-3 h-7 max-w-xs flex-1">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-gray-600 flex-shrink-0">
            <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04Z" />
          </svg>
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-200 placeholder:text-gray-600"
          />
        </div>

        <div className="ml-auto flex gap-4 text-[11px] text-gray-500">
          <span>Nodes <span className="text-sky-400 font-semibold ml-1">{nodes.length}</span></span>
          <span>Edges <span className="text-sky-400 font-semibold ml-1">{edges.length}</span></span>
        </div>
      </div>

      {/* Left sidebar: filter chips */}
      <div
        className="absolute top-14 left-3 z-20 w-52 max-h-[calc(100vh-80px)] overflow-y-auto
                    bg-penguin-bg/88 backdrop-blur-md border border-penguin-border rounded-xl p-3"
        data-reveal
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">Node Types</div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border transition-all cursor-pointer
                  ${activeTypes.has(type)
                    ? "border-current bg-white/[0.04]"
                    : "border-penguin-border text-gray-600 opacity-50"
                  }`}
                style={{ color: activeTypes.has(type) ? TIER_COLORS[type] : undefined }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: TIER_COLORS[type] || TIER_COLORS.unknown }}
                />
                {type}
                <span className="text-[10px] opacity-60">{count}</span>
              </button>
            ))}
        </div>

        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mt-4 mb-2">Controls</div>
        <div className="text-[10px] text-gray-600 leading-relaxed">
          Scroll to zoom. Drag to pan.<br />
          Click node to inspect.<br />
          Double-click to reset view.
        </div>
      </div>

      {/* Right panel: node inspector */}
      {selectedNode && (
        <div
          className="absolute top-14 right-3 z-20 w-72 max-h-[calc(100vh-80px)] overflow-y-auto
                      bg-penguin-bg/88 backdrop-blur-md border border-penguin-border rounded-xl p-4"
        >
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2.5 right-3 w-6 h-6 flex items-center justify-center
                       border border-penguin-border rounded text-gray-600 text-sm
                       hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            &times;
          </button>

          <div className="text-sm font-semibold text-white mb-1">{selectedNode.label}</div>
          <div className="text-[11px] text-gray-600 font-mono mb-3">{selectedNode.id}</div>

          <div className="flex flex-wrap gap-1 mb-3">
            <span
              className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${selectedNode.color}20`,
                color: selectedNode.color,
              }}
            >
              {selectedNode.type}
            </span>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400">
              degree: {degree}
            </span>
          </div>

          {inEdges.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 pb-1 border-b border-penguin-border mb-1">
                Incoming ({inEdges.length})
              </div>
              {inEdges.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 py-1 text-[11px] cursor-pointer hover:bg-white/[0.03] rounded"
                  onClick={() => {
                    const n = nodeMapRef.current.get(e.source);
                    if (n) { setSelectedNode(n); camRef.current.x = n.x; camRef.current.y = n.y; }
                  }}
                >
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                    {e.label}
                  </span>
                  <span className="text-gray-500 truncate">
                    {nodeMapRef.current.get(e.source)?.label || e.source}
                  </span>
                </div>
              ))}
            </div>
          )}

          {outEdges.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 pb-1 border-b border-penguin-border mb-1">
                Outgoing ({outEdges.length})
              </div>
              {outEdges.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 py-1 text-[11px] cursor-pointer hover:bg-white/[0.03] rounded"
                  onClick={() => {
                    const n = nodeMapRef.current.get(e.target);
                    if (n) { setSelectedNode(n); camRef.current.x = n.x; camRef.current.y = n.y; }
                  }}
                >
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                    {e.label}
                  </span>
                  <span className="text-gray-500 truncate">
                    {nodeMapRef.current.get(e.target)?.label || e.target}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
                    bg-penguin-bg/88 backdrop-blur-md border border-penguin-border rounded-lg
                    flex gap-5 px-5 py-2 text-[11px] text-gray-500"
        data-reveal
      >
        <span>Demo dataset — MidOS architecture topology</span>
        <span className="w-px bg-penguin-border" />
        <span>Drop <code className="text-sky-400 bg-penguin-surface/60 px-1 rounded text-[10px]">architecture_sigma.json</code> to load real data</span>
      </div>

      {/* Back */}
      <a
        href="/sandbox/graph"
        className="fixed bottom-6 left-6 z-30 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        &larr; all graph versions
      </a>
    </main>
  );
}
