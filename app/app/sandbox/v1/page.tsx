import type { Metadata } from "next";
import SandboxClient from "./SandboxClient";

export const metadata: Metadata = {
  title: "MidOS Sandbox — The Full Journey",
  description: "All landing page sections composed as one scroll story. Hero, Pipeline, Orchestrator, Topology, Colony, Horizon.",
};

export default function SandboxV1Page() {
  return <SandboxClient />;
}
