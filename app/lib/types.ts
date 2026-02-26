// MidOS tier system — aligned with modules/mcp_server/auth/constants.py
export type TierName = "community" | "dev" | "teams" | "ops" | "enterprise" | "admin";

export interface TierInfo {
  name: TierName;
  level: number;
  rateLimit: number;
  ips: number;
  label: string;
  color: string;
}

export const TIERS: Record<TierName, TierInfo> = {
  community: {
    name: "community",
    level: 0,
    rateLimit: 100,
    ips: 0,
    label: "Community",
    color: "bg-gray-700/50 text-gray-300",
  },
  dev: {
    name: "dev",
    level: 1,
    rateLimit: 25_000,
    ips: 1,
    label: "Developer",
    color: "bg-midos-900/50 text-midos-300",
  },
  teams: {
    name: "teams",
    level: 1,
    rateLimit: 300_000,
    ips: 12,
    label: "Teams",
    color: "bg-blue-900/50 text-blue-300",
  },
  ops: {
    name: "ops",
    level: 2,
    rateLimit: 100_000,
    ips: 1,
    label: "Ops",
    color: "bg-teal-900/50 text-teal-300",
  },
  enterprise: {
    name: "enterprise",
    level: 3,
    rateLimit: 5_000_000,
    ips: 100,
    label: "Enterprise",
    color: "bg-amber-900/50 text-amber-300",
  },
  admin: {
    name: "admin",
    level: 99,
    rateLimit: Infinity,
    ips: 0,
    label: "Admin",
    color: "bg-red-900/50 text-red-300",
  },
};

export interface UserProfile {
  id: string;
  email: string;
  tier: TierName;
  apiKey: string | null;
  usageThisMonth: number;
  createdAt: string;
}

// Billing types
export type BillingInterval = "monthly" | "annual";
export type BillingProcessor = "paddle" | "mercadopago" | "binance";

export interface BillingPlan {
  name: string;
  tier: TierName;
  monthlyPrice: number;
  annualPrice: number;
}

export interface Subscription {
  plan: string;
  processor: BillingProcessor;
  ref: string;
  interval: BillingInterval;
  upgraded_at: string;
}

export interface BillingStatus {
  user_id: string;
  tier: TierName;
  subscription: Subscription | Record<string, never>;
}
