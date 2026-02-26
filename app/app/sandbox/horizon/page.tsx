"use client";

import SectionIndex from "../_components/SectionIndex";

export default function HorizonIndex() {
  return (
    <SectionIndex
      section="horizon"
      title="Horizon"
      subtitle="The aurora at the edge."
      versions={[
        {
          slug: "v1",
          title: "v1",
          path: "/sandbox/horizon/v1",
          desc: "CSS aurora morph, static",
        },
        {
          slug: "v4",
          title: "v4",
          path: "/sandbox/horizon/v4",
          current: true,
          desc: "Hybrid CSS anchors + canvas wisps",
        },
      ]}
    />
  );
}
