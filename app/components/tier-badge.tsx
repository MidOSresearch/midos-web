import { TIERS, type TierName } from "@/lib/types";

interface TierBadgeProps {
  tier: TierName;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const info = TIERS[tier] ?? TIERS.dev;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${info.color}`}
    >
      {info.label}
    </span>
  );
}
