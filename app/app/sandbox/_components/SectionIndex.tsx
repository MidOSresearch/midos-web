"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

/* ─── Types ─── */

type Version = {
  slug: string;
  title: string;
  desc: string;
  path: string;
  current?: boolean;
};

interface FeedbackRow {
  id: number;
  section: string;
  version: string | null;
  user_email: string;
  user_name: string | null;
  rating: number | null;
  comment: string;
  status: string;
  resolution_note: string | null;
  created_at: string;
}

interface FeedbackStats {
  [section: string]: { total: number; open: number };
}

/* ─── Stars ─── */

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={(e) => { e.stopPropagation(); onChange(n); }}
          className={`text-sm transition-colors ${
            n <= value ? "text-amber-400" : "text-gray-700 hover:text-gray-500"
          }`}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/* ─── ReadOnly Stars ─── */

function StarsDisplay({ value }: { value: number }) {
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`text-[10px] ${n <= value ? "text-amber-400" : "text-gray-700"}`}>★</span>
      ))}
    </span>
  );
}

/* ─── Status badge ─── */

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    acknowledged: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    done: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${colors[status] ?? colors.open}`}>
      {status}
    </span>
  );
}

/* ─── Comment thread (floating label style inspired by dashboard NotesLayer) ─── */

function CommentThread({
  comments,
  isOpen,
  onToggle,
}: {
  comments: FeedbackRow[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  if (comments.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
      >
        {/* Penguin icon — mini version from dashboard */}
        <svg viewBox="0 0 24 28" className="w-4 h-5 shrink-0 opacity-60" aria-hidden="true">
          <ellipse cx="12" cy="17" rx="8" ry="9" fill="#1a2940" />
          <ellipse cx="12" cy="18" rx="5" ry="6.5" fill="#e0f2f1" />
          <circle cx="12" cy="9" r="5.5" fill="#1a2940" />
          <circle cx="10" cy="8" r="1" fill="white" />
          <circle cx="14" cy="8" r="1" fill="white" />
          <polygon points="11,11 13,11 12,13" fill="#f59e0b" />
        </svg>
        <span>{comments.length} comment{comments.length > 1 ? "s" : ""}</span>
        <span className="text-gray-700">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 pl-2 border-l border-teal-500/20">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-penguin-bg/60 backdrop-blur-sm border border-white/[0.06] rounded-lg px-3 py-2
                         transition-all duration-200 hover:border-teal-500/20"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  {c.rating && <StarsDisplay value={c.rating} />}
                  <StatusBadge status={c.status} />
                </div>
                <span className="text-[9px] text-gray-600 font-mono">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{c.comment}</p>
              {c.user_name && (
                <span className="text-[9px] text-gray-600 mt-1 block">— {c.user_name}</span>
              )}
              {c.resolution_note && (
                <div className="mt-1.5 pt-1.5 border-t border-white/[0.05]">
                  <span className="text-[9px] text-emerald-400/70">Resolution: </span>
                  <span className="text-[10px] text-gray-400">{c.resolution_note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Open feedback badge (floating) ─── */

function OpenBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-2 -right-2 z-10 min-w-[18px] h-[18px] flex items-center justify-center
                     rounded-full bg-amber-500/90 text-[9px] font-bold text-black px-1
                     shadow-lg shadow-amber-900/30 animate-pulse">
      {count}
    </span>
  );
}

/* ─── Main Component ─── */

export default function SectionIndex({
  section,
  title,
  subtitle,
  versions,
}: {
  section: string;
  title: string;
  subtitle: string;
  versions: Version[];
}) {
  const [allComments, setAllComments] = useState<FeedbackRow[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({});
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [openThreads, setOpenThreads] = useState<Record<string, boolean>>({});

  // Fetch feedback + stats
  const fetchFeedback = useCallback(async () => {
    try {
      const [commentsRes, statsRes] = await Promise.all([
        fetch(`/api/sandbox-feedback?section=${encodeURIComponent(section)}`),
        fetch("/api/sandbox-feedback?stats=true"),
      ]);
      const comments: FeedbackRow[] = await commentsRes.json();
      const st: FeedbackStats = await statsRes.json();
      setAllComments(comments);
      setStats(st);
    } catch {
      /* offline fallback */
    }
  }, [section]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const getDraft = useCallback(
    (slug: string) => drafts[slug] || { rating: 0, comment: "" },
    [drafts],
  );

  const updateDraft = (slug: string, patch: Partial<{ rating: number; comment: string }>) => {
    setDrafts((prev) => ({
      ...prev,
      [slug]: { ...getDraft(slug), ...patch },
    }));
  };

  const save = async (slug: string, version: string) => {
    const draft = getDraft(slug);
    if (!draft.comment.trim()) return;
    setSaving(slug);
    try {
      await fetch("/api/sandbox-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          version,
          user_email: "sandbox@midos.dev",
          rating: draft.rating || undefined,
          comment: draft.comment,
        }),
      });
      // Reset draft, refresh data
      setDrafts((prev) => ({ ...prev, [slug]: { rating: 0, comment: "" } }));
      await fetchFeedback();
    } catch {
      /* ignore */
    }
    setSaving(null);
  };

  const toggleThread = (slug: string) => {
    setOpenThreads((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Group comments by version slug
  const commentsByVersion = (version: string): FeedbackRow[] =>
    allComments.filter((c) => c.version === version);

  const sectionStats = stats[section];

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/sandbox"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors inline-block mb-4"
          >
            &larr; back to sandbox
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{title}</h1>
            {sectionStats && sectionStats.open > 0 && (
              <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {sectionStats.open} open
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">{subtitle}</p>
          <p className="text-midos-400/70 text-xs mt-3">
            {versions.length} version{versions.length > 1 ? "s" : ""} — click to view, leave feedback below. Every comment is saved.
          </p>
        </div>

        {/* Version cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {versions.map((v) => {
            const feedbackSlug = `${section}-${v.slug}`;
            const draft = getDraft(feedbackSlug);
            const versionComments = commentsByVersion(v.slug);
            const openCount = versionComments.filter((c) => c.status === "open").length;

            return (
              <div
                key={v.slug}
                className={`relative bg-penguin-surface/50 border rounded-xl overflow-hidden transition-all duration-300 ${
                  v.current
                    ? "border-midos-500/30 shadow-[0_4px_20px_rgba(0,150,136,0.08)]"
                    : "border-penguin-border hover:border-penguin-border/80"
                }`}
              >
                {/* Open feedback floating badge */}
                <OpenBadge count={openCount} />

                {/* Preview iframe */}
                <Link href={v.path} className="block">
                  <div className="relative overflow-hidden bg-penguin-bg" style={{ height: 260 }}>
                    <iframe
                      src={v.path}
                      title={v.title}
                      className="absolute top-0 left-0 border-0 pointer-events-none"
                      style={{
                        width: 1440,
                        height: 900,
                        transform: "scale(0.42)",
                        transformOrigin: "top left",
                      }}
                      tabIndex={-1}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                      <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg">
                        Open full screen &rarr;
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Info + feedback */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-white">{v.title}</h2>
                      {v.current && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-midos-900/50 text-midos-300">
                          current
                        </span>
                      )}
                    </div>
                    <Stars value={draft.rating} onChange={(val) => updateDraft(feedbackSlug, { rating: val })} />
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>

                  {/* New comment box */}
                  <textarea
                    value={draft.comment}
                    onChange={(e) => updateDraft(feedbackSlug, { comment: e.target.value })}
                    placeholder="What do you think? What would you change?"
                    rows={2}
                    className="w-full bg-penguin-bg border border-penguin-border rounded-lg px-3 py-2
                               text-xs text-gray-200 placeholder-gray-600 resize-none
                               focus:border-midos-500/50 focus:outline-none transition-colors"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-700">
                      {versionComments.length > 0
                        ? `${versionComments.length} comment${versionComments.length > 1 ? "s" : ""} total`
                        : "no comments yet"}
                    </span>
                    <button
                      onClick={() => save(feedbackSlug, v.slug)}
                      disabled={!draft.comment.trim() || saving === feedbackSlug}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        draft.comment.trim()
                          ? "bg-midos-600 text-white hover:bg-midos-500"
                          : "bg-penguin-border/30 text-gray-600 cursor-default"
                      }`}
                    >
                      {saving === feedbackSlug ? "..." : "Add comment"}
                    </button>
                  </div>

                  {/* Comment history thread */}
                  <CommentThread
                    comments={versionComments}
                    isOpen={openThreads[feedbackSlug] ?? false}
                    onToggle={() => toggleThread(feedbackSlug)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
