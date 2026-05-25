import { useEffect } from "react";
import useNoteUpload from "../../hooks/useNoteUpload";
import useNoteWebSocket from "../../hooks/useNoteWebSocket";
import PipelineTracker from "./PipelineTracker";
import DownloadSuccess from "./DownloadSuccess";
import { UPLOAD_PHASES } from "../../constants/pipeline";

/**
 * UploadBox — orchestrator component.
 *
 * Wires together:
 *  - useNoteUpload (file selection + upload state machine)
 *  - useNoteWebSocket (real-time pipeline status)
 *  - PipelineTracker (animated progress display)
 *  - DownloadSuccess (completion + download UI)
 *
 * No business logic lives here — all in hooks.
 */
const UploadBox = () => {
  const {
    phase,
    file,
    previewUrl,
    isDragOver,
    noteId,
    uploadError,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    triggerFileInput,
    removeFile,
    startUpload,
    markCompleted,
    reset,
  } = useNoteUpload();

  const { status: wsStatus } = useNoteWebSocket(
    phase === UPLOAD_PHASES.PROCESSING ? noteId : null
  );

  // Transition to COMPLETED when WebSocket reports it
  useEffect(() => {
    if (wsStatus === "COMPLETED") {
      markCompleted();
    }
  }, [wsStatus, markCompleted]);

  // ─── Phase: IDLE — File selection ──────────────────

  if (phase === UPLOAD_PHASES.IDLE || phase === UPLOAD_PHASES.ERROR) {
    return (
      <div className="glass-premium rounded-2xl p-6 md:p-8 border border-slate-800/80 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Notes</h3>
            <p className="text-xs text-slate-500">Drag & drop or browse your files</p>
          </div>
        </div>

        {/* Error banner */}
        {(phase === UPLOAD_PHASES.ERROR || uploadError) && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {uploadError || "Something went wrong. Please try again."}
          </div>
        )}

        {/* Drop zone / File preview */}
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            id="upload-drop-zone"
            className={`
              border-2 border-dashed rounded-xl p-10 md:p-14 text-center
              transition-all duration-300 cursor-pointer
              flex flex-col items-center justify-center min-h-[280px]
              ${isDragOver
                ? "border-indigo-400 bg-indigo-500/5 shadow-inner shadow-indigo-500/10 scale-[0.99]"
                : "border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/20 hover:bg-slate-900/40 animate-border-pulse"
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
              id="file-input"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
            </div>

            <p className="text-lg font-semibold text-slate-200">
              Drag & Drop Note Files Here
            </p>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              Supports PNG, JPG, JPEG, and PDF files
            </p>

            <button
              type="button"
              className="mt-6 px-6 py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-300 text-sm font-semibold transition-all duration-200"
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-900/30 space-y-4">
            {/* File metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center text-indigo-400 shrink-0">
                  {file.type.includes("pdf") ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 20.25H6a2.25 2.25 0 0 1-2.25-2.25V6c0-1.243 1.007-2.25 2.25-2.25h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25Z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate max-w-[280px]">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              {/* Type badge */}
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                {file.type.split("/")[1] || "file"}
              </span>
            </div>

            {/* Image preview */}
            {previewUrl && (
              <div className="border border-slate-800/80 rounded-lg overflow-hidden max-h-[300px] bg-slate-950 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain max-h-[300px]"
                />
              </div>
            )}
          </div>
        )}

        {/* Actions — only show when file is selected */}
        {file && (
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-800/60">
            <button
              type="button"
              onClick={removeFile}
              id="remove-file-btn"
              className="px-4 py-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-sm font-medium transition-all duration-200"
            >
              Remove
            </button>

            <button
              type="button"
              onClick={startUpload}
              disabled={isUploading}
              id="generate-pdf-btn"
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isUploading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                }
              `}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-500/30 border-t-slate-400 rounded-full animate-spin-slow" />
                  Uploading...
                </>
              ) : (
                <>
                  Generate PDF
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Phase: PROCESSING — Pipeline tracker ──────────

  if (phase === UPLOAD_PHASES.PROCESSING) {
    return (
      <div className="glass-premium rounded-2xl border border-slate-800/80 overflow-hidden animate-slide-up">
        {/* Header bar */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Processing Your Notes</h3>
              <p className="text-xs text-slate-500">Pipeline running — do not close this page</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-xs font-semibold text-indigo-300">LIVE</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Pipeline tracker */}
          <div className="flex-1 px-6 md:px-8 py-6">
            <PipelineTracker currentStatus={wsStatus || "UPLOADED"} />
          </div>

          {/* File sidebar */}
          {file && (
            <div className="md:w-64 px-6 md:px-5 pb-6 md:py-6 md:border-l border-t md:border-t-0 border-slate-800/60">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Source File
              </p>

              {previewUrl && (
                <div className="border border-slate-800/80 rounded-lg overflow-hidden mb-3 bg-slate-950">
                  <img src={previewUrl} alt="Source" className="w-full h-32 object-cover" />
                </div>
              )}

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-300 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Phase: COMPLETED — Download ───────────────────

  if (phase === UPLOAD_PHASES.COMPLETED) {
    return (
      <div className="glass-premium rounded-2xl p-6 md:p-8 border border-slate-800/80">
        <DownloadSuccess
          noteId={noteId}
          fileName={file?.name || "notes"}
          onReset={reset}
        />
      </div>
    );
  }

  return null;
};

export default UploadBox;
