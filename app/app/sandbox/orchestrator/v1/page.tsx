import OrchestratorV1 from "../../_archive/v1/orchestrator_v1";
export default function Page() {
  return (
    <>
      <OrchestratorV1 />
      <div className="fixed bottom-6 left-6 z-50">
        <a href="/sandbox/orchestrator" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">&larr; all orchestrator versions</a>
      </div>
    </>
  );
}
