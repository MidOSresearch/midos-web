import { TIERS, type TierName } from "@/lib/types";

interface UsageStatsProps {
  tier: TierName;
  usageThisMonth: number;
}

export default function UsageStats({ tier, usageThisMonth }: UsageStatsProps) {
  const info = TIERS[tier] ?? TIERS.dev;
  const limit = info.rateLimit;
  const percentage = limit === Infinity ? 0 : Math.min((usageThisMonth / limit) * 100, 100);
  const isNearLimit = percentage > 80;

  return (
    <div className="rounded-lg border border-penguin-border bg-penguin-surface p-6">
      <h3 className="text-sm font-medium text-gray-200">Usage This Month</h3>

      <div className="mt-4">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-white">
            {usageThisMonth.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">
            / {limit === Infinity ? "Unlimited" : limit.toLocaleString()} queries
          </span>
        </div>

        {limit !== Infinity && (
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-penguin-bg">
              <div
                className={`h-2 rounded-full transition-all ${
                  isNearLimit ? "bg-amber-500" : "bg-midos-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {(100 - percentage).toFixed(0)}% remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
