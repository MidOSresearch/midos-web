"use client";

import Component from "../../_archive/v1/topology_v1";

export default function Page() {
  return (
    <>
      <Component />
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="/sandbox/topology"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          &larr; all topology versions
        </a>
      </div>
    </>
  );
}
