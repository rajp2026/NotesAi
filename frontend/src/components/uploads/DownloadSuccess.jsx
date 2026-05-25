import { downloadNotePdf } from "../../api/notesApi";

/**
 * DownloadSuccess — shown when the pipeline reaches COMPLETED.
 *
 * Pure presentational. Displays success animation, filename, and
 * action buttons (download + reset).
 *
 * @param {{ noteId: number, fileName: string, onReset: () => void }} props
 */
const DownloadSuccess = ({ noteId, fileName, onReset }) => {
  const handleDownload = () => {
    downloadNotePdf(noteId);
  };

  return (
    <div className="flex flex-col items-center text-center py-6 animate-slide-up">
      {/* ─── Success icon ─── */}
      <div className="relative mb-6 animate-scale-in">
        {/* Glow backdrop */}
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-500/20 blur-xl" />

        <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              className="animate-draw-check"
            />
          </svg>
        </div>
      </div>

      {/* ─── Heading ─── */}
      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent mb-2">
        Your PDF is Ready!
      </h3>

      <p className="text-sm text-slate-400 mb-1">
        Successfully converted
      </p>

      {/* Filename badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <span className="text-xs font-mono text-slate-300 truncate max-w-[240px]">
          {fileName}
        </span>
      </div>

      {/* ─── Action buttons ─── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={handleDownload}
          id="download-pdf-btn"
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 px-6 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </button>

        <button
          type="button"
          onClick={onReset}
          id="convert-another-btn"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 text-slate-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Convert Another
        </button>
      </div>
    </div>
  );
};

export default DownloadSuccess;
