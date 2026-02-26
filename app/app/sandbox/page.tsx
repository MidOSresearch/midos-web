"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const experiments = [
  {
    slug: "hero",
    title: "Hero",
    description: "Aurora, shimmer title, floating penguin.",
    status: "new",
  },
  {
    slug: "pipeline",
    title: "Pipeline",
    description: "Ice slides + 4 stage cards.",
    status: "new",
  },
  {
    slug: "orchestrator",
    title: "Orchestrator",
    description: "Mouse spotlight, octopus, capability cards.",
    status: "new",
  },
  {
    slug: "topology",
    title: "Topology",
    description: "Canvas nodes, stats, motion quote.",
    status: "new",
  },
  {
    slug: "colony",
    title: "Colony",
    description: "12 penguins + 3 value cards.",
    status: "new",
  },
  {
    slug: "horizon",
    title: "Horizon",
    description: "Aurora morph, CTA closing.",
    status: "new",
  },
  {
    slug: "slope",
    title: "Slope Penguin",
    description: "SVG path scroll follower.",
    status: "live",
  },
  {
    slug: "v1",
    title: "V1: Full Journey",
    description: "All sections combined.",
    status: "live",
  },
];

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

export default function SandboxIndex() {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const statusColor = (status: string) => {
    if (status === "live") return "bg-midos-900/50 text-midos-300";
    if (status === "new") return "bg-indigo-900/50 text-indigo-300";
    return "bg-penguin-border text-gray-500";
  };

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sandbox</h1>
            <p className="text-gray-600 text-xs mt-1">
              Click para abrir — stars + comentario se guardan en{" "}
              <code className="text-midos-400/60">sandbox-feedback.json</code>
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiments.map((exp) => {
            const draft = getDraft(exp.slug);
            const saved = feedback[exp.slug];
            const isDirty =
              draft.rating !== (saved?.rating || 0) ||
              draft.comment !== (saved?.comment || "");
            const isExpanded = expanded === exp.slug;

            return (
              <div
                key={exp.slug}
                className="bg-penguin-surface/50 border border-penguin-border rounded-xl overflow-hidden
                           transition-all duration-300 hover:border-midos-500/20
                           hover:shadow-[0_4px_20px_rgba(0,150,136,0.08)]"
              >
                {/* Preview */}
                <Link href={`/sandbox/${exp.slug}`} className="block">
                  <div
                    className="relative overflow-hidden bg-penguin-bg"
                    style={{ height: 200 }}
                  >
                    <iframe
                      src={`/sandbox/${exp.slug}`}
                      title={exp.title}
                      className="absolute top-0 left-0 border-0 pointer-events-none"
                      style={{
                        width: 1440,
                        height: 900,
                        transform: "scale(0.26)",
                        transformOrigin: "top left",
                      }}
                      tabIndex={-1}
                      loading="lazy"
                    />
                  </div>
                </Link>

                {/* Info bar */}
                <div className="px-4 py-3 space-y-2">
                  {/* Title row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <h2 className="text-sm font-semibold text-white truncate">{exp.title}</h2>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${statusColor(exp.status)}`}>
                        {exp.status}
                      </span>
                    </div>
                    <Stars value={draft.rating} onChange={(v) => updateDraft(exp.slug, { rating: v })} />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-snug">{exp.description}</p>

                  {/* Comment toggle */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : exp.slug)}
                    className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {isExpanded ? "▾ hide comment" : saved?.comment ? "▸ edit comment" : "▸ add comment"}
                  </button>

                  {/* Expandable comment area */}
                  {isExpanded && (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={draft.comment}
                        onChange={(e) => updateDraft(exp.slug, { comment: e.target.value })}
                        placeholder="Que le falta, que cambiar..."
                        rows={3}
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
                          onClick={() => save(exp.slug)}
                          disabled={!isDirty || saving === exp.slug}
                          className={`ml-auto px-3 py-1 rounded-md text-xs font-medium transition-all
                            ${isDirty
                              ? "bg-midos-600 text-white hover:bg-midos-500"
                              : "bg-penguin-border/30 text-gray-600 cursor-default"
                            }`}
                        >
                          {saving === exp.slug ? "..." : isDirty ? "Save" : "Saved"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Saved comment preview (when collapsed) */}
                  {!isExpanded && saved?.comment && (
                    <p className="text-[10px] text-gray-600 truncate italic">
                      &ldquo;{saved.comment}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
