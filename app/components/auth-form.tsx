"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Step = "email" | "code";

const hasGithub = !!process.env.NEXT_PUBLIC_HAS_GITHUB_AUTH;
const hasGoogle = !!process.env.NEXT_PUBLIC_HAS_GOOGLE_AUTH;
const hasOAuth = hasGithub || hasGoogle;

export default function AuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Auto-focus first code input on step change
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => codeRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  // Submit code when all 6 digits filled
  const submitCode = useCallback(
    async (digits: string[]) => {
      const fullCode = digits.join("");
      if (fullCode.length !== 6) return;

      setLoading(true);
      setError(null);

      try {
        const result = await signIn("credentials", {
          email,
          code: fullCode,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid or expired code. Try again.");
          setCode(["", "", "", "", "", ""]);
          setTimeout(() => codeRefs.current[0]?.focus(), 50);
        } else {
          router.push("/dashboard");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email],
  );

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      // Route through Next.js API to avoid CORS
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.dev_code) setDevCode(data.dev_code);
        setStep("code");
        setCooldown(60);
        setCode(["", "", "", "", "", ""]);
      } else {
        setError("Could not send code. Try again.");
      }
    } catch {
      setError("Could not reach server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(index: number, value: string) {
    // Handle paste of full code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIdx = Math.min(index + digits.length, 5);
      codeRefs.current[nextIdx]?.focus();
      if (newCode.every((d) => d !== "")) {
        submitCode(newCode);
      }
      return;
    }

    // Single digit
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "")) {
      submitCode(newCode);
    }
  }

  function handleCodeKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError(null);
    setCooldown(60);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dev_code) setDevCode(data.dev_code);
      }
    } catch {
      // Silently fail — user can try again
    }
  }

  return (
    <div className="space-y-4">
      {/* OAuth providers — only when configured */}
      {hasOAuth && (
        <>
          <div className="space-y-2">
            {hasGithub && (
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-penguin-border bg-penguin-bg px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-gray-800 active:bg-gray-700 transition"
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            )}
            {hasGoogle && (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-penguin-border bg-penguin-bg px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-gray-800 active:bg-gray-700 transition"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-penguin-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-penguin-surface px-2 text-gray-500">
                or continue with email
              </span>
            </div>
          </div>
        </>
      )}

      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-900/30 border border-red-800 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {step === "email" ? (
        /* Step 1: Email input */
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-penguin-border bg-penguin-bg px-3 py-2.5 text-sm text-gray-100 shadow-sm focus:border-midos-500 focus:outline-none focus:ring-1 focus:ring-midos-500 placeholder-gray-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-midos-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-midos-500 active:bg-midos-700 focus:outline-none focus:ring-2 focus:ring-midos-500 focus:ring-offset-2 focus:ring-offset-penguin-surface disabled:opacity-50 transition"
          >
            {loading ? "Sending..." : "Continue with email"}
          </button>
        </form>
      ) : (
        /* Step 2: Code input */
        <div className="space-y-4">
          <p className="text-sm text-gray-300 text-center">
            We sent a code to{" "}
            <span className="font-medium text-white break-all">{email}</span>
          </p>

          {devCode && (
            <div className="rounded-md bg-yellow-900/30 border border-yellow-700/50 p-2 text-center">
              <span className="text-xs text-yellow-400">DEV MODE</span>
              <span className="ml-2 font-mono text-sm text-yellow-200 tracking-widest">{devCode}</span>
            </div>
          )}

          {/* 6-digit code boxes */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { codeRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                pattern="[0-9]*"
                maxLength={6}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                disabled={loading}
                className="h-12 w-10 sm:h-14 sm:w-12 rounded-md border border-penguin-border bg-penguin-bg text-center text-lg sm:text-xl font-mono text-white shadow-sm focus:border-midos-500 focus:outline-none focus:ring-1 focus:ring-midos-500 disabled:opacity-50"
              />
            ))}
          </div>

          {loading && (
            <p className="text-sm text-gray-400 text-center">Verifying...</p>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError(null);
                setCode(["", "", "", "", "", ""]);
                setDevCode(null);
              }}
              className="text-gray-400 hover:text-gray-200 active:text-white transition"
            >
              &larr; Different email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-midos-400 hover:text-midos-300 disabled:text-gray-600 active:text-midos-200 transition"
            >
              {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
