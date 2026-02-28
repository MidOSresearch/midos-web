import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MidOS — MCP Community Library";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0d1a2d 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "120px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "100px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "200px",
            right: "300px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "24px",
            border: "1px solid rgba(52,211,153,0.25)",
            background: "rgba(52,211,153,0.06)",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
          <span style={{ color: "#6ee7b7", fontSize: "16px", letterSpacing: "0.1em" }}>
            Community MCP Library
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "96px",
            fontWeight: 800,
            letterSpacing: "-2px",
            background: "linear-gradient(90deg, #9ca3af, #34d399, #38bdf8, #fbbf24, #a78bfa)",
            backgroundClip: "text",
            color: "transparent",
            margin: 0,
            lineHeight: 1,
          }}
        >
          MidOS
        </h1>

        {/* Tagline */}
        <p
          style={{
            color: "#d1d5db",
            fontSize: "28px",
            fontWeight: 300,
            marginTop: "20px",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          The knowledge library your AI agents were missing.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          <span>
            <strong style={{ color: "rgba(52,211,153,0.85)" }}>19K+</strong> chunks
          </span>
          <span style={{ color: "#1f2937" }}>|</span>
          <span>
            <strong style={{ color: "rgba(56,189,248,0.85)" }}>68</strong> MCP tools
          </span>
          <span style={{ color: "#1f2937" }}>|</span>
          <span>
            <strong style={{ color: "rgba(251,191,36,0.85)" }}>121</strong> skills
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
