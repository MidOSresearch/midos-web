import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MidOS — MCP Community Library",
  description:
    "Curated knowledge library for AI agents — 19K+ chunks, 121 skills, semantic search. MCP-compatible, source-verified patterns for any AI workflow.",
  metadataBase: new URL("https://midos.dev"),
  openGraph: {
    title: "MidOS — MCP Community Library",
    description:
      "The knowledge library your AI agents were missing. 19K+ validated chunks, 121 skills, 68 MCP tools.",
    siteName: "MidOS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MidOS — MCP Community Library",
    description:
      "The knowledge library your AI agents were missing. 19K+ validated chunks, 121 skills, 68 MCP tools.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-penguin-bg text-gray-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
