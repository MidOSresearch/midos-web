import type { Metadata } from "next";
import SandboxClient from "./SandboxClient";

export const metadata: Metadata = {
  title: "MidOS Sandbox — V1: The Full Journey",
  description: "The complete descent: hero, pipeline caves, orchestrator, topology, colony.",
};

export default function SandboxV1Page() {
  return <SandboxClient />;
}
