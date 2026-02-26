"use client";

import SectionIndex from "../_components/SectionIndex";

export default function SlopeIndex() {
  return (
    <SectionIndex
      section="slope"
      title="Slope"
      subtitle="SVG path scroll follower."
      versions={[
        {
          slug: "v1",
          title: "v1",
          path: "/sandbox/slope/v1",
          current: true,
          desc: "Penguin rides SVG curve as you scroll",
        },
      ]}
    />
  );
}
