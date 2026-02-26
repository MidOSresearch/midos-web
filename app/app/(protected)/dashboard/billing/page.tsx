import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TierBadge from "@/components/tier-badge";
import UpgradeCta from "@/components/upgrade-cta";
import type { BillingStatus } from "@/lib/types";

interface SearchParams {
  success?: string;
  cancelled?: string;
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const { id: userId, tier } = session.user;

  // Fetch live billing status (no-cache) to reflect webhook upgrades
  let billingStatus: BillingStatus | null = null;
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8420";
    const res = await fetch(`${backendUrl}/api/billing/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session.user.apiKey
          ? { Authorization: `Bearer ${session.user.apiKey}` }
          : {}),
      },
      body: JSON.stringify({ user_id: userId }),
      cache: "no-store",
    });
    if (res.ok) {
      billingStatus = await res.json();
    }
  } catch {
    // Backend offline — fall back to session tier
  }

  const currentTier = billingStatus?.tier ?? tier;
  const subscription = billingStatus?.subscription;
  const hasSubscription = subscription && "plan" in subscription;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Billing</h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-gray-400">Current plan:</span>
          <TierBadge tier={currentTier} />
        </div>
      </div>

      {/* Success banner */}
      {params.success && (
        <div className="rounded-lg border border-green-800 bg-green-900/30 p-4">
          <p className="text-sm font-medium text-green-300">
            Payment successful! Your account has been upgraded.
          </p>
          <p className="mt-1 text-xs text-green-400">
            Sign out and back in to refresh your session with the new tier.
          </p>
        </div>
      )}

      {/* Cancelled banner */}
      {params.cancelled && (
        <div className="rounded-lg border border-amber-800 bg-amber-900/30 p-4">
          <p className="text-sm font-medium text-amber-300">
            Checkout was cancelled. No charges were made.
          </p>
        </div>
      )}

      {/* Subscription info (paid users) */}
      {hasSubscription && (
        <div className="rounded-lg border border-penguin-border bg-penguin-surface p-6">
          <h3 className="text-sm font-medium text-gray-200">
            Subscription Details
          </h3>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-400">Plan</dt>
              <dd className="font-medium text-white capitalize">
                {subscription.plan}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Billing</dt>
              <dd className="font-medium text-white capitalize">
                {subscription.interval}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Processor</dt>
              <dd className="font-medium text-white capitalize">
                {subscription.processor}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Since</dt>
              <dd className="font-medium text-white">
                {new Date(subscription.upgraded_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-gray-500">
            To cancel or change your plan, contact support@midos.dev
          </p>
        </div>
      )}

      {/* Upgrade CTA (community and dev users) */}
      {(currentTier === "community" || currentTier === "dev") && (
        <UpgradeCta userId={userId} currentTier={currentTier} />
      )}

      {/* Plan comparison */}
      <div className="rounded-lg border border-penguin-border bg-penguin-surface p-6">
        <h3 className="text-sm font-medium text-gray-200">Plan Comparison</h3>
        <div className="mt-4 -mx-6 px-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-penguin-border text-gray-400">
                <th className="pb-2 font-medium">Feature</th>
                <th className="pb-2 font-medium">Community</th>
                <th className="pb-2 font-medium">Dev</th>
                <th className="pb-2 font-medium">Ops</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-penguin-border">
                <td className="py-2">Price</td>
                <td className="font-medium text-white">Free</td>
                <td className="font-medium text-midos-300">$29/mo</td>
                <td className="font-medium text-midos-300">$79/mo</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">Annual</td>
                <td>-</td>
                <td className="text-midos-400">$299/yr</td>
                <td className="text-midos-400">$790/yr</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">Daily cap</td>
                <td>50/day</td>
                <td>500/day</td>
                <td>2,000/day</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">Rate limit</td>
                <td>5/min</td>
                <td>30/min</td>
                <td>60/min</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">Research/mo</td>
                <td className="text-gray-500">-</td>
                <td>3 briefs</td>
                <td>30 agent-driven</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">Knowledge</td>
                <td>Truncated</td>
                <td>Full 21K+</td>
                <td>Full 21K+</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">EUREKA + SOTA</td>
                <td className="text-gray-500">-</td>
                <td className="text-midos-400">168 + 32</td>
                <td className="text-midos-400">168 + 32</td>
              </tr>
              <tr className="border-b border-penguin-border">
                <td className="py-2">AOTC + Packs</td>
                <td className="text-gray-500">-</td>
                <td className="text-gray-500">-</td>
                <td className="text-midos-400">AOTC + Security + Infra</td>
              </tr>
              <tr>
                <td className="py-2">Orchestration</td>
                <td className="text-gray-500">-</td>
                <td>Agent status</td>
                <td className="text-midos-400">Pool signals + coordination</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-1 text-xs text-gray-500">
          <p>
            <span className="text-gray-400">Global</span>{" "}
            Cards, PayPal, Apple/Google Pay via Paddle
          </p>
          <p>
            <span className="text-gray-400">LatAm</span>{" "}
            Abitab, RedPagos, OCA, cuotas via MercadoPago
          </p>
          <p>
            <span className="text-gray-400">Crypto</span>{" "}
            BTC, ETH, USDT via Binance Pay or direct transfer
          </p>
          <p className="mt-2">
            Need Teams or Enterprise? <a href="mailto:support@midos.dev" className="text-midos-400 hover:underline">Contact us</a>.
            See <a href="https://midos.dev/docs/tiers" className="text-midos-400 hover:underline">full tier details</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
