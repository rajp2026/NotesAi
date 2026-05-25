import UploadBox from "../components/uploads/UploadBox";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white bg-grid-pattern relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/8 blur-[120px] animate-pulse-gradient pointer-events-none" />
      <div
        className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-purple-500/8 blur-[140px] animate-pulse-gradient pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Page header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            AI-Powered Pipeline
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Convert Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-glow">
              Notes
            </span>
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            Upload a photo of your handwritten notes and watch our pipeline
            transform them into a structured PDF in real time.
          </p>
        </div>

        {/* Upload workflow */}
        <UploadBox />

        {/* Footer hint */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600 font-mono">
            Upload → OCR → AI Format → PDF — powered by Tesseract & Groq
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
