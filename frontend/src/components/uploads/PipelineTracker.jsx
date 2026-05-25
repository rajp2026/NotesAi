import {
  PIPELINE_STAGES,
  STATUS_TO_STAGE_INDEX,
  PROCESSING_STATUSES,
} from "../../constants/pipeline";

/**
 * Stage icon components — inline SVGs, one per pipeline stage.
 */
const StageIcons = {
  upload: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
    </svg>
  ),
  scan: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18a2.25 2.25 0 0 1-2.25 2.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  sparkle: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l8.982-11.795H14l1-6.136-8.982 11.795h5.795Z" />
    </svg>
  ),
  document: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  check: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
};

/**
 * Spinner for active stages.
 */
const Spinner = () => (
  <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin-slow" />
);

/**
 * Checkmark for completed stages.
 */
const Checkmark = () => (
  <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-draw-check" />
  </svg>
);

/**
 * Determines the visual state of a stage relative to the current pipeline status.
 * @param {number} stageIndex
 * @param {number} activeIndex - index of the currently active stage
 * @param {string} status      - raw backend status string
 * @returns {"done" | "active" | "waiting"}
 */
const getStageState = (stageIndex, activeIndex, status) => {
  if (status === "COMPLETED") {
    return "done";
  }
  if (stageIndex < activeIndex) return "done";
  if (stageIndex === activeIndex) return "active";
  return "waiting";
};

/**
 * PipelineTracker — animated vertical stepper showing real-time pipeline progress.
 *
 * Pure presentational component. Receives `currentStatus` from parent
 * (driven by WebSocket hook). All stage definitions come from constants/pipeline.js.
 *
 * @param {{ currentStatus: string | null }} props
 */
const PipelineTracker = ({ currentStatus }) => {
  const activeIndex = STATUS_TO_STAGE_INDEX[currentStatus] ?? 0;
  const isProcessing = PROCESSING_STATUSES.has(currentStatus);

  return (
    <div className="w-full stagger-children" role="progressbar" aria-label="Pipeline progress">
      {PIPELINE_STAGES.map((stage, index) => {
        const state = getStageState(index, activeIndex, currentStatus);
        const isLast = index === PIPELINE_STAGES.length - 1;
        const IconComponent = StageIcons[stage.icon];

        return (
          <div key={stage.id} className="flex items-stretch gap-4">
            {/* ─── Left column: icon + connector ─── */}
            <div className="flex flex-col items-center">
              {/* Icon circle */}
              <div
                className={`
                  relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                  transition-all duration-500 ease-out
                  ${state === "done"
                    ? "bg-emerald-500/15 border border-emerald-500/30"
                    : state === "active"
                      ? "bg-indigo-500/15 border border-indigo-500/40 animate-pulse-ring"
                      : "bg-slate-800/60 border border-slate-700/50"
                  }
                `}
              >
                {state === "done" ? (
                  <Checkmark />
                ) : state === "active" && isProcessing ? (
                  <Spinner />
                ) : (
                  <IconComponent
                    className={`w-5 h-5 transition-colors duration-500 ${
                      state === "active" ? "text-indigo-400" : "text-slate-500"
                    }`}
                  />
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="w-px flex-1 min-h-[28px] relative my-1">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-slate-800 rounded-full" />
                  {/* Fill line */}
                  {state === "done" && (
                    <div
                      className="absolute inset-0 rounded-full animate-line-fill"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(16,185,129,0.6), rgba(99,102,241,0.3))",
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* ─── Right column: label + description ─── */}
            <div className={`pb-6 pt-2 min-w-0 transition-opacity duration-500 ${state === "waiting" ? "opacity-40" : "opacity-100"}`}>
              <p
                className={`
                  text-sm font-semibold leading-none
                  ${state === "done"
                    ? "text-emerald-300"
                    : state === "active"
                      ? "text-indigo-300"
                      : "text-slate-400"
                  }
                `}
              >
                {stage.label}
                {state === "active" && isProcessing && (
                  <span className="ml-2 text-xs font-normal animate-shimmer">
                    Processing...
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {stage.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineTracker;
