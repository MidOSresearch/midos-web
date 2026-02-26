import PipelineV2 from "../../_archive/v1/pipeline_v2";

export default function Page() {
  return (
    <>
      <PipelineV2 />
      <div className="fixed bottom-6 left-6 z-50">
        <a href="/sandbox/pipeline" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">&larr; all pipeline versions</a>
      </div>
    </>
  );
}
