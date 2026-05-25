import { useState, useRef, useCallback } from "react";
import { uploadNote } from "../api/notesApi";
import { UPLOAD_PHASES } from "../constants/pipeline";

/**
 * Custom hook — manages the upload state machine.
 *
 * Phases: idle → processing → completed | error
 *
 * Handles:
 *  - File selection (drag/drop or browse)
 *  - Image preview URL lifecycle (create / revoke)
 *  - Upload HTTP call
 *  - Phase transitions
 *  - Full reset
 *
 * @returns {object} State + action handlers
 */
const useNoteUpload = () => {
  const [phase, setPhase] = useState(UPLOAD_PHASES.IDLE);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  // ─── File selection ────────────────────────────────

  const processFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadError(null);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      processFile(e.target.files[0]);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  }, [previewUrl]);

  // ─── Upload + phase transition ─────────────────────

  const startUpload = useCallback(async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await uploadNote(file);
      setNoteId(response.id);
      setPhase(UPLOAD_PHASES.PROCESSING);
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || "Upload failed";
      setUploadError(message);
      setPhase(UPLOAD_PHASES.ERROR);
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const markCompleted = useCallback(() => {
    setPhase(UPLOAD_PHASES.COMPLETED);
  }, []);

  // ─── Full reset ────────────────────────────────────

  const reset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhase(UPLOAD_PHASES.IDLE);
    setFile(null);
    setPreviewUrl(null);
    setNoteId(null);
    setUploadError(null);
    setIsUploading(false);
    setIsDragOver(false);
  }, [previewUrl]);

  return {
    // State
    phase,
    file,
    previewUrl,
    isDragOver,
    noteId,
    uploadError,
    isUploading,
    fileInputRef,

    // Actions
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    triggerFileInput,
    removeFile,
    startUpload,
    markCompleted,
    reset,
  };
};

export default useNoteUpload;
