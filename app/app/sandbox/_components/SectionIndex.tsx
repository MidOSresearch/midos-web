"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type Version = {
  slug: string;
  title: string;
  desc: string;
  path: string;
  current?: boolean;
};

type Feedback = Record<string, { rating: number; comment: string; updated: string }>;

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
  const [feedback, setFeedback] = useState<Feedback>({});
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sandbox-feedback")
      .then((r) => r.json())
      .then((data) => {
        setFeedback(data);
        const d: typeof drafts = {};
        for (const [slug, fb] of Object.entries(data) as [string, Feedback[string]][]) {
          d[slug] = { rating: fb.rating, comment: fb.comment };
        }
        setDrafts(d);
      })
      .catch(() => {});
  }, []);

  const getDraft = useCallback(
    (slug: string) => drafts[slug] || { rating: 0, comment: "" },
    [drafts]
  );

  const updateDraft = (slug: string, patch: Partial<{ rating: number; comment: string }>) => {
    setDrafts((prev) => ({
      ...prev,
      [slug]: { ...getDraft(slug), ...patch },
    }));
  };

  const save = async (slug: string) => {
    const draft = getDraft(slug);
    setSaving(slug);
    try {
      await fetch("/api/sandbox-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, rating: draft.rating, comment: draft.comment }),
      });
      setFeedback((prev) => ({
        ...prev,
        [slug]: { ...draft, updated: new Date().toISOString() },
      }));
    } catch {
      /* ignore */
    }
    setSaving(null);
  };

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
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">{subtitle}</p>
          <p className="text-midos-400/70 text-xs mt-3">
            {versions.length} version{versions.length > 1 ? "s" : ""} — click to view, then come back and leave your feedback.
          </p>
        </div>

        {/* Version cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {versions.map((v) => {
            const feedbackSlug = `${section}-${v.slug}`;
            const draft = getDraft(feedbackSlug);
            const saved = feedback[feedbackSlug];
            const isDirty =
              draft.rating !== (saved?.rating || 0) ||
              draft.comment !== (saved?.comment || "");

            return (
              <div
                key={v.slug}
                className={`bg-penguin-surface/50 border rounded-xl overflow-hidden transition-all duration-300 ${
                  v.current
                    ? "border-midos-500/30 shadow-[0_4px_20px_rgba(0,150,136,0.08)]"
                    : "border-penguin-border hover:border-penguin-border/80"
                }`}
              >
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
                    {/* Click overlay */}
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

                  {/* Comment box — always visible */}
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
                    {saved?.updated && (
                      <span className="text-[9px] text-gray-700">
                        {new Date(saved.updated).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      onClick={() => save(feedbackSlug)}
                      disabled={!isDirty || saving === feedbackSlug}
                      className={`ml-auto px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        isDirty
                          ? "bg-midos-600 text-white hover:bg-midos-500"
                          : "bg-penguin-border/30 text-gray-600 cursor-default"
                      }`}
                    >
                      {saving === feedbackSlug ? "..." : isDirty ? "Save" : "Saved"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
