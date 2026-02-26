"use client";

import SectionIndex from "../_components/SectionIndex";

export default function ColonyIndex() {
  return (
    <SectionIndex
      section="colony"
      title="Colony"
      subtitle="12 penguins, each with a role."
      versions={[
        {
          slug: "v1",
          title: "v1",
          path: "/sandbox/colony/v1",
          desc: "Static grid, hover shows name",
        },
        {
          slug: "v3",
          title: "v3",
          path: "/sandbox/colony/v3",
          current: true,
          desc: "Unique idle animations per penguin",
        },
      ]}
    />
  );
}
