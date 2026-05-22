import { useState, useRef } from "react";
import { uploadNote } from "../../api/NotesApi";

const UploadBox = () => {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl(null);
  };

  const triggerUploadInput = () => {
    fileInputRef.current.click();
  };

  const handleGeneratePdf = async () => {
    if (!file) return;

    try {
      const response = await uploadNote(file);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  // Simulate PDF generation delay
  return (
    <div className="glass-premium rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-bold mb-4 text-indigo-300 flex items-center gap-2">
        Upload Notes
      </h3>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerUploadInput}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[260px] ${
            isDragOver
              ? "border-indigo-400 bg-indigo-500/5 shadow-inner shadow-indigo-500/5 scale-[0.99]"
              : "border-slate-700 hover:border-indigo-500 bg-slate-900/20 hover:bg-slate-900/40"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
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
            className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold tracking-wide shadow-md shadow-indigo-600/10 transition-all"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/30 flex flex-col gap-4">
          {/* File Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                {file.type.includes("pdf") ? (
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
                ) : (
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
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159"
                    />
                  </svg>
                )}
              </div>

              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate max-w-[240px]">
                  {file.name}
                </p>

                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl ? (
            <div className="border border-slate-800 rounded-lg overflow-hidden max-h-[300px] bg-slate-950 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain max-h-[300px]"
              />
            </div>
          ) : (
            <div className="border border-slate-800 rounded-lg p-10 text-center text-slate-500 bg-slate-950">
              PDF Preview Coming Soon
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRemoveFile}
          className="px-4 py-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition"
        >
          Remove
        </button>

        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={isGenerating}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            isGenerating
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
