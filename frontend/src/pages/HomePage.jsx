import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white bg-grid-pattern pb-20 relative overflow-hidden">
      {/* Decorative gradient blur blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-gradient" />
      <div
        className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px] animate-pulse-gradient"
        style={{ animationDelay: "2s" }}
      />



      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-fade-in">
          <span>✨</span> Supercharged with Tesseract & GPT-4o
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none max-w-5xl">
          Transform Handwritten Scribbles <br className="hidden md:inline" />
          Into{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-glow">
            Structured PDFs
          </span>
        </h1>

        <p className="mt-8 text-base md:text-xl text-slate-400 max-w-3xl leading-relaxed">
          Upload photo scribbles of your notebooks. Our multi-stage pipeline
          extracts, formats, and builds gorgeous summaries, flashcards, or
          textbook-style documents in seconds.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            to="/upload"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30 transition-all duration-200 group active:scale-98"
          >
            Convert Note
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 active:scale-98"
          >
            Open Dashboard
          </Link>
        </div>

        {/* Architecture Pipeline Visualizer */}
        <div className="mt-20 w-full max-w-4xl glass-premium rounded-2xl p-6 md:p-10 border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-xs font-mono text-slate-500">
            Pipeline Architecture
          </div>

          <h3 className="text-xl font-bold text-left mb-8 flex items-center gap-2 text-indigo-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            How NoteAI Translates Your Notes
          </h3>

          {/* Graphical Node Flow */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-semibold">1. React Client</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Upload note image file
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-semibold">2. FastAPI</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Saves raw asset to S3
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-semibold">3. Redis Queue</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Dispatches asynchronous task
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18a2.25 2.25 0 0 1-2.25 2.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-semibold">4. OCR Service</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Extracts raw handwriting text
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 21l8.982-11.795H14l1-6.136-8.982 11.795h5.795Z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-semibold">5. AI Formatter</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Cleans notes via LLM
              </p>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-semibold">6. PDF Generator</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Compiles styling and outputs PDF
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-900 pt-4 font-mono">
            Data is stored in PostgreSQL and structured PDFs reside in AWS S3
            buckets.
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 rounded-2xl glass border border-slate-800/60 text-left hover:scale-[1.01] transition-transform duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Handwriting OCR</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Extracts text from various handwriting styles—cursive, messy,
              print, or diagrams—using local OCR systems optimized for
              structured outputs.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass border border-slate-800/60 text-left hover:scale-[1.01] transition-transform duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 21l8.982-11.795H14l1-6.136-8.982 11.795h5.795Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">AI Styling & Formatting</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Organizes unstructured textual transcriptions. Turns typos and
              chaotic lines into summaries, study notes, outlines, or math
              equations automatically.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass border border-slate-800/60 text-left hover:scale-[1.01] transition-transform duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Academic PDF Compiler</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Downloads a beautifully-styled PDF using configured templates.
              Perfect for storing summaries or printing academic materials for
              tests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
