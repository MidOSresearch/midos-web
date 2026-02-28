import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TierBadge from "@/components/tier-badge";
import ApiKeyCard from "@/components/api-key-card";
import UsageStats from "@/components/usage-stats";
import UpgradeCta from "@/components/upgrade-cta";
import type { TierName } from "@/lib/types";

interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  tier: string;
  api_key: string;
  subscription: Record<string, unknown>;
  created_at: string;
  atoms_contributed: number;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id: userId, email, tier: sessionTier, apiKey: sessionApiKey } = session.user;

  // Fetch live profile from backend
  let profile: UserProfile | null = null;
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8420";
    const res = await fetch(`${backendUrl}/api/user/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    if (res.ok) {
      profile = await res.json();
    }
  } catch {
    // Backend offline — use session data
  }

  const tier = (profile?.tier ?? sessionTier) as TierName;
  const apiKey = profile?.api_key || sessionApiKey;
  const usageThisMonth = profile?.atoms_contributed ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-gray-400">{email}</span>
          <TierBadge tier={tier} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <ApiKeyCard apiKey={apiKey} />
        <UsageStats tier={tier} usageThisMonth={usageThisMonth} />
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border border-penguin-border bg-penguin-surface p-6">
        <h3 className="text-sm font-medium text-gray-200">Quick Links</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <a
            href="https://midos.dev/quickstart/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-penguin-border p-3 text-sm hover:bg-penguin-bg transition"
          >
            <span className="font-medium text-white">Quickstart Guide</span>
            <p className="mt-0.5 text-xs text-gray-400">Get started with MidOS MCP</p>
          </a>
          <a
            href="https://midos.dev/tools/overview/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-penguin-border p-3 text-sm hover:bg-penguin-bg transition"
          >
            <span className="font-medium text-white">Available Tools</span>
            <p className="mt-0.5 text-xs text-gray-400">Browse tools for your tier</p>
          </a>
          <a
            href="https://midos.dev/guides/architecture/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-penguin-border p-3 text-sm hover:bg-penguin-bg transition"
          >
            <span className="font-medium text-white">Architecture</span>
            <p className="mt-0.5 text-xs text-gray-400">Understand MidOS internals</p>
          </a>
        </div>
      </div>

      {/* Tier Upgrade CTA — dev users can upgrade */}
      {tier === "dev" && (
        <UpgradeCta userId={userId} currentTier={tier} />
      )}
    </div>
  );
}
