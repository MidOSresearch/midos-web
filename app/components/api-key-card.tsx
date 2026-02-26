"use client";

import { useState } from "react";

interface ApiKeyCardProps {
  apiKey: string | null;
}

export default function ApiKeyCard({ apiKey: initialKey }: ApiKeyCardProps) {
  const [apiKey, setApiKey] = useState(initialKey);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const masked = apiKey
    ? `${apiKey.slice(0, 12)}${"*".repeat(20)}${apiKey.slice(-4)}`
    : null;

  async function handleCopy() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleAction(action: "generate" | "rotate") {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process request");
        return;
      }

      setApiKey(data.api_key);
      setVisible(true); // Show the new key immediately
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-penguin-border bg-penguin-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-200">API Key</h3>
        {apiKey && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVisible(!visible)}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              {visible ? "Hide" : "Reveal"}
            </button>
            <button
              onClick={() => handleAction("rotate")}
              disabled={loading}
              className="text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50"
            >
              {loading ? "..." : "Rotate Key"}
            </button>
          </div>
        )}
      </div>

      {apiKey ? (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-penguin-bg px-3 py-2 text-xs font-mono text-midos-300">
              {visible ? apiKey : masked}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-md border border-penguin-border px-3 py-2 text-xs font-medium text-gray-300 hover:bg-penguin-bg"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Use this key in the <code className="text-midos-400">Authorization</code> header when calling the MidOS API.
          </p>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-gray-400">
            No API key generated yet. Click below to create one.
          </p>
          <button
            onClick={() => handleAction("generate")}
            disabled={loading}
            className="mt-2 rounded-md bg-midos-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-midos-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Key"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
