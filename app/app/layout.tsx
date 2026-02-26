import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MidOS Dashboard",
  description: "MCP Community Library — Knowledge, Research & Tools",
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
