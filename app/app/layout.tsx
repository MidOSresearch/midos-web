import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MidOS — MCP Community Library",
    template: "%s | MidOS",
  },
  description:
    "Curated knowledge library for AI agents — 19K+ chunks, 121 skills, semantic search. MCP-compatible, source-verified patterns for any AI workflow.",
  metadataBase: new URL("https://midos.dev"),
  openGraph: {
    type: "website",
    siteName: "MidOS",
    title: "MidOS — MCP Community Library",
    description:
      "Curated knowledge library for AI agents — 19K+ chunks, 121 skills, semantic search.",
    url: "https://midos.dev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MidOS — MCP Community Library",
    description:
      "Curated knowledge library for AI agents — 19K+ chunks, 121 skills, semantic search.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://midos.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MidOS",
    description:
      "MCP Community Library — Curated knowledge, skills, and semantic search for AI agents.",
    url: "https://midos.dev",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free community tier with 28 tools",
    },
    author: {
      "@type": "Organization",
      name: "MidOS",
      url: "https://midos.dev",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-penguin-bg text-gray-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
