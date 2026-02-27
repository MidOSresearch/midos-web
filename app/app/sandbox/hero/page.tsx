"use client";

import SectionIndex from "../_components/SectionIndex";

export default function HeroSection() {
  return (
    <SectionIndex
      section="hero"
      title="Hero"
      subtitle="The first thing visitors see. From static auroras to a living network."
      versions={[
        { slug: "v2", title: "Hero v2", desc: "Static aurora radial-gradient blobs, shimmer text, floating penguin SVG. Pure CSS decoration.", path: "/sandbox/hero/v2" },
        { slug: "v4", title: "Hero v4", desc: "Live Canvas 2D topology network as background. 35 tier-colored nodes, mouse proximity glow, scroll parallax. The product IS the hero.", path: "/sandbox/hero/v4" },
        { slug: "v5", title: "Hero v5", desc: "Visibility floor raised (no ghost nodes) + subtle downward drift (network flows like maturing knowledge). Connections brightened to match.", path: "/sandbox/hero/v5", current: true },
      ]}
    />
  );
}
