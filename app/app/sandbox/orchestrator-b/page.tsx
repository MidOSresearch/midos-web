"use client";

import SectionIndex from "../_components/SectionIndex";
export default function OrchestratorBSection() {
  return (
    <SectionIndex
      section="orchestrator-b"
      title="Orchestrator B"
      subtitle="Alternative metaphor: network architecture instead of biological organism."
      versions={[
        { slug: "v2", title: "Orchestrator B v2", desc: "Hub-and-spoke mind map — 8 capabilities radiating from center. Mouse on hub expands nodes outward. Hover node shows info panel. Hub adopts hovered color.", path: "/sandbox/orchestrator-b/v2", current: true },
      ]}
    />
  );
}
