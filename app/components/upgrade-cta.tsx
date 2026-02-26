"use client";

import { useState } from "react";
import type { BillingProcessor } from "@/lib/types";

interface UpgradeCtaProps {
  userId: string;
  currentTier?: string;
}

type PlanId = "dev" | "ops";

// Explicit ordering for plan selector buttons
const PLAN_ORDER: PlanId[] = ["dev", "ops"];

// Crypto wallet addresses for direct payment
const CRYPTO_WALLETS = {
  btc: process.env.NEXT_PUBLIC_BTC_ADDRESS || "",
  eth: process.env.NEXT_PUBLIC_ETH_ADDRESS || "",
};

const PLANS: Record<PlanId, {
  label: string;
  price: number;
  annual: number;
  annualTotal: number;
  ips: number;
  dailyCap: string;
  rateLimit: string;
  research: string;
  features: string;
  value: string[];
}> = {
  dev: {
    label: "Developer",
    price: 29,
    annual: 299,
    annualTotal: 299,
    ips: 1,
    dailyCap: "500/day",
    rateLimit: "30 req/min",
    research: "3 briefs/mo",
    features: "Full knowledge, EUREKA, SOTA, 49+ tools",
    value: [
      "500 queries/day — 12h intensive sessions covered",
      "21,000+ full knowledge chunks",
      "113 EUREKA + 15 SOTA + 45 Truth patches",
      "Semantic search (54K+ vectors)",
      "3 research briefs/month",
      "Agent status monitoring",
    ],
  },
  ops: {
    label: "Ops",
    price: 79,
    annual: 790,
    annualTotal: 790,
    ips: 1,
    dailyCap: "2,000/day",
    rateLimit: "60 req/min",
    research: "30 agent-driven/mo",
    features: "Premium + AOTC + agent orchestration",
    value: [
      "2,000 queries/day — automated agents 24/7",
      "Everything in Dev",
      "30 agent-driven research/month",
      "AOTC exclusive inventions",
      "Security + Infrastructure packs",
      "Pool signals + agent coordination",
    ],
  },
};

export default function UpgradeCta({ userId, currentTier = "community" }: UpgradeCtaProps) {
  const [plan, setPlan] = useState<PlanId>(currentTier === "dev" ? "ops" : "dev");
  const [useCrypto, setUseCrypto] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletCopied, setWalletCopied] = useState<string | null>(null);

  const isLatam = typeof navigator !== "undefined" &&
    /^(es|pt)/i.test(navigator.language);

  const info = PLANS[plan];

  function detectProcessor(): BillingProcessor {
    if (useCrypto) return "binance";
    if (isLatam) return "mercadopago";
    return "paddle";
  }

  async function copyWallet(address: string, label: string) {
    await navigator.clipboard.writeText(address);
    setWalletCopied(label);
    setTimeout(() => setWalletCopied(null), 2000);
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    const processor = detectProcessor();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processor, plan, user_id: userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed. Try again or use direct crypto.");
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const availablePlans = PLAN_ORDER.filter((p) => p !== currentTier);

  return (
    <div className="rounded-lg border border-midos-700 bg-midos-900/30 p-4 sm:p-6">
      {/* Plan selector — wraps on mobile */}
      {availablePlans.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {availablePlans.map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                plan === p
                  ? "bg-midos-600 text-white"
                  : "border border-penguin-border text-gray-300 hover:bg-penguin-bg"
              }`}
            >
              {PLANS[p].label}
            </button>
          ))}
        </div>
      )}

      <h3 className="text-sm font-medium text-midos-300">
        Upgrade to {info.label}
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        {info.dailyCap} ({info.rateLimit}) + {info.research}. {info.features}.
      </p>

      {/* Value evidence */}
      <ul className="mt-3 space-y-1">
        {info.value.map((v) => (
          <li key={v} className="flex items-start gap-2 text-xs text-gray-300">
            <span className="text-midos-400 shrink-0 mt-0.5">&#10003;</span>
            <span>{v}</span>
          </li>
        ))}
      </ul>

      {/* Price + IPs */}
      <div className="mt-4 flex items-end gap-3">
        <span className="text-2xl font-bold text-white">
          ${info.price % 1 === 0 ? info.price : info.price.toFixed(2)}
        </span>
        <span className="mb-0.5 text-sm text-midos-400">
          /mo &middot; {info.ips} {info.ips === 1 ? "IP" : "IPs"}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Annual: ${info.annualTotal}/yr
        <span className="text-midos-400 ml-1">
          (save {Math.round((1 - info.annualTotal / (info.price * 12)) * 100)}%)
        </span>
      </p>

      {/* Payment options */}
      <div className="mt-4 space-y-2">
        {/* Crypto toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCrypto}
            onChange={(e) => {
              setUseCrypto(e.target.checked);
              setShowWallets(false);
            }}
            className="rounded border-penguin-border"
          />
          <span className="text-xs text-gray-400">Pay with crypto (BTC/ETH/USDT)</span>
        </label>

        {/* Direct wallet option when crypto selected */}
        {useCrypto && (CRYPTO_WALLETS.btc || CRYPTO_WALLETS.eth) && (
          <button
            type="button"
            onClick={() => setShowWallets(!showWallets)}
            className="text-xs text-midos-400 hover:text-midos-300 underline transition"
          >
            {showWallets ? "Hide wallet addresses" : "Pay directly to wallet address"}
          </button>
        )}

        {/* Wallet addresses panel */}
        {showWallets && (
          <div className="rounded-md border border-penguin-border bg-penguin-bg p-3 space-y-3">
            <p className="text-xs text-gray-400">
              Send the exact amount for your plan, then email <span className="text-midos-400">support@midos.dev</span> with the transaction hash and your email to activate.
            </p>
            {CRYPTO_WALLETS.btc && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-amber-400">Bitcoin (BTC)</span>
                  <button
                    onClick={() => copyWallet(CRYPTO_WALLETS.btc, "btc")}
                    className="text-xs text-gray-400 hover:text-gray-200 transition"
                  >
                    {walletCopied === "btc" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="block w-full truncate rounded bg-penguin-surface px-2 py-1.5 text-xs font-mono text-gray-300 select-all">
                  {CRYPTO_WALLETS.btc}
                </code>
              </div>
            )}
            {CRYPTO_WALLETS.eth && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-400">Ethereum (ETH/USDT)</span>
                  <button
                    onClick={() => copyWallet(CRYPTO_WALLETS.eth, "eth")}
                    className="text-xs text-gray-400 hover:text-gray-200 transition"
                  >
                    {walletCopied === "eth" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="block w-full truncate rounded bg-penguin-surface px-2 py-1.5 text-xs font-mono text-gray-300 select-all">
                  {CRYPTO_WALLETS.eth}
                </code>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-3 w-full rounded-md bg-midos-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-midos-500 active:bg-midos-700 disabled:opacity-50 transition"
      >
        {loading ? "Redirecting..." : `Upgrade to ${info.label}`}
      </button>

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
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
