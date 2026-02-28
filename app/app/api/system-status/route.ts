import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const MCP_URL = process.env.NEXT_PUBLIC_MIDOS_API_URL ?? "";

// Path to MidOS root — works in dev (monorepo sibling) and prod (env override)
const MIDOS_ROOT = process.env.MIDOS_ROOT ?? join(process.cwd(), "..");

export const revalidate = 30; // ISR: revalidate every 30s

/* ─── Read live data from pulse.json + security_pulse.json ─── */

interface PulseData {
  knowledge: { chunks: number; skills: number; truth: number; eureka: number; sota: number; vectors: number; coherence: number };
  infra: { hooks: number; tools: number; skills_claude: number; mcp_tools: number };
}

function readPulse(): PulseData {
  try {
    const raw = readFileSync(join(MIDOS_ROOT, "knowledge", "SYSTEM", "pulse.json"), "utf-8");
    const pulse = JSON.parse(raw);
    const s = pulse?.agents?.MIDOS_L1?.session_summary;
    const kp = s?.knowledge_pipeline ?? {};
    return {
      knowledge: {
        chunks: kp.chunks ?? 0,
        skills: kp.skills ?? 0,
        truth: kp.truth ?? 0,
        eureka: kp.eureka ?? 0,
        sota: kp.sota ?? 0,
        vectors: s?.vectors ?? 0,
        coherence: pulse?.agents?.MIDOS_L1?.coherence?.phi_total ?? 0,
      },
      infra: {
        hooks: s?.hooks_active ?? 0,
        tools: s?.tools_count ?? 0,
        skills_claude: s?.claude_skills ?? 0,
        mcp_tools: 68,
      },
    };
  } catch {
    return {
      knowledge: { chunks: 0, skills: 0, truth: 0, eureka: 0, sota: 0, vectors: 0, coherence: 0 },
      infra: { hooks: 0, tools: 0, skills_claude: 0, mcp_tools: 0 },
    };
  }
}

interface SecurityData {
  grade: string; pass_rate: number; findings: number; high: number; low: number;
}

function readSecurity(): SecurityData {
  try {
    const raw = readFileSync(join(MIDOS_ROOT, "knowledge", "SYSTEM", "security_pulse.json"), "utf-8");
    const sec = JSON.parse(raw);
    const lp = sec?.last_pentest ?? {};
    const findings = lp.findings ?? [];
    const high = findings.filter((f: { severity: string }) => f.severity === "high").length;
    const low = findings.filter((f: { severity: string }) => f.severity === "low").length;
    return {
      grade: lp.grade ?? "?",
      pass_rate: lp.pass_rate ?? 0,
      findings: findings.length,
      high,
      low,
    };
  } catch {
    return { grade: "?", pass_rate: 0, findings: 0, high: 0, low: 0 };
  }
}

/* ─── API Route ─── */

export async function GET() {
  // Always read live pulse + security data from disk
  const pulse = readPulse();
  const security = readSecurity();

  const offlineResponse = {
    ok: false,
    ts: Date.now(),
    error: "MCP server unreachable",
    community: { status: "offline", version: "?", uptime_s: 0, users: 0, atoms: 0 },
    knowledge: pulse.knowledge,
    security,
    infra: pulse.infra,
  };

  if (!MCP_URL) return NextResponse.json(offlineResponse, { status: 200 });

  try {
    const res = await fetch(`${MCP_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return NextResponse.json(offlineResponse, { status: 200 });

    const health = await res.json();

    return NextResponse.json({
      ok: true,
      ts: Date.now(),
      community: {
        status: health.status ?? "unknown",
        version: health.version ?? "?",
        uptime_s: health.uptime_seconds ?? 0,
        users: health.registered_users ?? 0,
        atoms: health.atoms_stored ?? 0,
      },
      knowledge: pulse.knowledge,
      security,
      infra: pulse.infra,
    });
  } catch {
    return NextResponse.json(offlineResponse, { status: 200 });
  }
}
