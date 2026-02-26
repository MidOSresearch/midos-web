"use client";

import SectionIndex from "../_components/SectionIndex";
export default function OrchestratorSection() {
  return (
    <SectionIndex
      section="orchestrator"
      title="Orchestrator"
      subtitle="The octopus mind. Two visual metaphors: organism (A) vs. architecture (B)."
      versions={[
        { slug: "v1", title: "Orchestrator v1", desc: "Static SVG octopus with mouse spotlight and 4 capability cards in a grid. The octopus was an illustration, not alive.", path: "/sandbox/orchestrator/v1" },
        { slug: "v4", title: "Orchestrator A v4", desc: "Chameleon canvas octopus — 8 dendrite tentacles fanned left-to-right, hub adopts hovered tentacle color, chromatophore spots, info panels at tips.", path: "/sandbox/orchestrator/v4", current: true },
        { slug: "b-v2", title: "Orchestrator B v2", desc: "Hub-and-spoke mind map — center expands nodes outward on proximity, hover node enlarges with info panel, hub changes color. Alternative network metaphor.", path: "/sandbox/orchestrator-b/v2" },
      ]}
    />
  );
}
