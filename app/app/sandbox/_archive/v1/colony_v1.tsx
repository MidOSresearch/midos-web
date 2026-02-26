"use client";

import {
  PenguinSVG,
  SkiingPenguinSVG,
  BookPenguinSVG,
  WrenchPenguinSVG,
  SledPenguinSVG,
} from "@/lib/ui/characters";
import { useDataReveal } from "@/lib/ui/hooks";

const values = [
  { title: "Open", desc: "Knowledge shared freely" },
  { title: "Reliable", desc: "Validated, versioned, true" },
  { title: "Evolving", desc: "Better with every cycle" },
];

export default function ColonyPage() {
  useDataReveal();

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a1628 0%, #0d1f3a 50%, #0a1628 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#e2e8f0",
        }}
      >
        {/* Title block */}
        <div
          data-reveal
          style={{ textAlign: "center", marginBottom: "3rem", maxWidth: "600px" }}
        >
          <h1
            style={{
              fontSize: "clamp(1.875rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#e2e8f0",
              margin: "0 0 0.75rem 0",
              lineHeight: 1.15,
            }}
          >
            The Colony
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#94a3b8",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Built by many, for everyone. Each penguin finds its purpose.
          </p>
        </div>

        {/* Penguin parade */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "3rem",
            maxWidth: "700px",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              data-reveal
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {i % 5 === 0 ? (
                <SkiingPenguinSVG
                  className="w-10 h-10 sm:w-12 sm:h-12 opacity-60 hover:opacity-100 transition-opacity"
                />
              ) : i % 5 === 1 ? (
                <BookPenguinSVG
                  className="w-10 h-12 sm:w-12 sm:h-14 opacity-60 hover:opacity-100 transition-opacity"
                />
              ) : i % 5 === 2 ? (
                <WrenchPenguinSVG
                  className="w-10 h-12 sm:w-12 sm:h-14 opacity-60 hover:opacity-100 transition-opacity"
                />
              ) : i % 5 === 3 ? (
                <SledPenguinSVG
                  className="w-14 h-12 sm:w-16 sm:h-14 opacity-60 hover:opacity-100 transition-opacity"
                />
              ) : (
                <PenguinSVG
                  className="w-8 h-10 sm:w-10 sm:h-12 opacity-50 hover:opacity-100 transition-all duration-300 hover:-translate-y-1"
                />
              )}
            </div>
          ))}
        </div>

        {/* Value cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            width: "100%",
            maxWidth: "560px",
          }}
        >
          {values.map((val, i) => (
            <div
              key={val.title}
              data-reveal
              style={{ transitionDelay: `${600 + i * 80}ms` }}
            >
              <div
                style={{
                  background: "rgba(26, 41, 64, 0.6)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  transition: "border-color 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(99, 179, 237, 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
              >
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#63b3ed",
                    fontSize: "1rem",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {val.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Back link */}
      <a
        href="/sandbox"
        style={{
          position: "fixed",
          bottom: "1.25rem",
          left: "1.25rem",
          fontSize: "0.75rem",
          color: "#4b5563",
          textDecoration: "none",
          transition: "color 0.2s",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color = "#4b5563")
        }
      >
        &larr; sandbox
      </a>
    </>
  );
}
