import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandbox — Visual Design Lab",
  description:
    "Live visual experiments for MidOS — interactive animations, canvas topology, pipeline visualizations. Built with the same knowledge patterns we serve.",
  openGraph: {
    title: "MidOS Sandbox — Visual Design Lab",
    description:
      "Live visual experiments — interactive animations, canvas topology, pipeline visualizations.",
    url: "https://midos.dev/sandbox",
  },
};

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
