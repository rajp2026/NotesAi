/**
 * Pipeline stage definitions — single source of truth.
 *
 * Maps backend NoteStatus enum values to UI display properties.
 * To add a new stage, add an entry here and the UI auto-adapts.
 */

export const PIPELINE_STAGES = [
  {
    id: "upload",
    label: "File Uploaded",
    description: "Your file has been received",
    icon: "upload",
  },
  {
    id: "ocr",
    label: "Extracting Text",
    description: "Reading handwriting with OCR",
    icon: "scan",
  },
  {
    id: "ai",
    label: "AI Formatting",
    description: "Structuring content with AI",
    icon: "sparkle",
  },
  {
    id: "pdf",
    label: "Generating PDF",
    description: "Compiling your document",
    icon: "document",
  },
  {
    id: "complete",
    label: "Complete",
    description: "Your PDF is ready to download",
    icon: "check",
  },
];

/**
 * Maps a backend status string to the index of the ACTIVE stage.
 * Stages before this index are "done", stages after are "waiting".
 */
export const STATUS_TO_STAGE_INDEX = {
  UPLOADED: 0,
  OCR_PROCESSING: 1,
  OCR_COMPLETED: 1,
  AI_PROCESSING: 2,
  AI_COMPLETED: 2,
  PDF_GENERATING: 3,
  COMPLETED: 4,
  FAILED: -1,
};

/**
 * Statuses where the stage is "in progress" (show spinner).
 * vs. "sub-completed" (e.g. OCR_COMPLETED still on stage 1 but done).
 */
export const PROCESSING_STATUSES = new Set([
  "OCR_PROCESSING",
  "AI_PROCESSING",
  "PDF_GENERATING",
]);

/**
 * Terminal statuses — pipeline is finished (success or failure).
 */
export const TERMINAL_STATUSES = new Set(["COMPLETED", "FAILED"]);

/**
 * Upload flow phases for the UploadBox state machine.
 */
export const UPLOAD_PHASES = {
  IDLE: "idle",
  PROCESSING: "processing",
  COMPLETED: "completed",
  ERROR: "error",
};
