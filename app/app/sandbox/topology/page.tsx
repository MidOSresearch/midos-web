"use client";
import { useRef } from "react";
import { useCanvasTopology } from "@/lib/ui/hooks";

export default function TopologyExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTopology(canvasRef);

  const stats = [
    { num: "21K+", label: "Knowledge nodes" },
    { num: "168", label: "Discoveries" },
    { num: "∞", label: "Connections" },
  ];

  return (
    <main className="min-h-screen bg-penguin-bg text-gray-100 flex items-center py-24">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-4">
          Everything Connects
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
          Patterns emerge. Bridges form between ideas that never met before.
        </p>

        <div className="relative" style={{ minHeight: 400 }}>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-50"
          />
          <div className="relative z-10 text-center py-12">
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-midos-400">
                    {stat.num}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <p className="text-gray-600 text-sm italic max-w-md mx-auto">
              &ldquo;The world might not be ready for the technical truth. But they can feel it through motion.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6">
        <a
          href="/sandbox"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          &larr; sandbox
        </a>
      </div>
    </main>
  );
}
