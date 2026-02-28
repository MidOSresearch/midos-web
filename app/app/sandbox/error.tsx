"use client";

import { useEffect } from "react";

export default function SandboxError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sandbox] Section error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-penguin-bg text-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-4xl mb-4">;</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {error.message || "A section failed to render."}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 text-sm font-semibold rounded-lg
                     bg-emerald-600 hover:bg-emerald-500 text-white
                     transition-all duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
