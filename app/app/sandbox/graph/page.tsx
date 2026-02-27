"use client";

import SectionIndex from "../_components/SectionIndex";

export default function GraphSection() {
  return (
    <SectionIndex
      section="graph"
      title="Graph Viewer"
      subtitle="Interactive architecture exploration. Pan, zoom, click, search. Pure Canvas 2D."
      versions={[
        {
          slug: "v1",
          title: "Graph v1",
          desc: "Architecture graph viewer ported from tools/graph_viewer.html. Demo MidOS topology data with pipeline tier colors, node inspector, filter chips, search, idle breathing. Camera: scroll zoom, drag pan, double-click reset.",
          path: "/sandbox/graph/v1",
          current: true,
        },
      ]}
    />
  );
}
