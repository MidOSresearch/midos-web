"use client";

import SectionIndex from "../_components/SectionIndex";

export default function TopologyIndex() {
  return (
    <SectionIndex
      section="topology"
      title="Topology"
      subtitle="The constellation map. Real data rendered as visual art."
      versions={[
        {
          slug: "v1",
          title: "v1",
          path: "/sandbox/topology/v1",
          desc: "Early canvas node experiment",
        },
        {
          slug: "current",
          title: "current",
          path: "/sandbox/topology/current",
          current: true,
          desc: "Full constellation: 6 tier-colored clusters, knowledge transfer pulses, mouse proximity glow",
        },
      ]}
    />
  );
}
