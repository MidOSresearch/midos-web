"use client";

import Component from "../../_archive/v1/colony_v1";

export default function Page() {
  return (
    <>
      <Component />
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="/sandbox/colony"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          &larr; all colony versions
        </a>
      </div>
    </>
  );
}
