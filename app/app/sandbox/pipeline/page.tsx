"use client";

import SectionIndex from "../_components/SectionIndex";

export default function PipelineSection() {
  return (
    <SectionIndex
      section="pipeline"
      title="Pipeline"
      subtitle="5 layers of knowledge maturation. From horizontal slides to vertical flow."
      versions={[
        { slug: "v2", title: "Pipeline v2", desc: "Horizontal SVG ice slides with skiing penguins + 4-column stage cards below. Path and cards felt disconnected.", path: "/sandbox/pipeline/v2" },
        { slug: "v5", title: "Pipeline v5", desc: "Vertical timeline with alternating left/right cards, central gradient line, 12 dripping particles, insight panels on both sides. Every pixel advances the story.", path: "/sandbox/pipeline/v5", current: true },
      ]}
    />
  );
}
