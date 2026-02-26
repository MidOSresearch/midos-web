"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface DashboardNavProps {
  email: string;
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/billing", label: "Billing" },
];

export default function DashboardNav({ email }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-penguin-border bg-penguin-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="https://midos.dev" className="text-lg font-bold text-white hover:text-midos-400 transition">MidOS</a>
            <span className="hidden sm:inline text-sm text-gray-400">Dashboard</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  pathname === link.href
                    ? "bg-midos-500/20 text-midos-300"
                    : "text-gray-400 hover:bg-penguin-bg hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: email + sign out (desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="max-w-[200px] truncate text-sm text-gray-400">{email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="shrink-0 rounded-md border border-penguin-border px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-penguin-bg transition"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden rounded-md p-1.5 text-gray-400 hover:bg-penguin-bg hover:text-gray-200 transition"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-penguin-border px-4 py-3 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-midos-500/20 text-midos-300"
                  : "text-gray-400 hover:bg-penguin-bg hover:text-gray-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-penguin-border pt-2 mt-2">
            <p className="truncate px-3 text-xs text-gray-500">{email}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-2 w-full rounded-md border border-penguin-border px-3 py-2 text-sm font-medium text-gray-300 hover:bg-penguin-bg transition text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
