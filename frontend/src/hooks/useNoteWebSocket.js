import { useEffect, useRef, useState, useCallback } from "react";
import { connectNoteWebSocket, getNoteStatus } from "../api/notesApi";
import { TERMINAL_STATUSES } from "../constants/pipeline";

/**
 * Custom hook — manages WebSocket connection for pipeline status updates.
 *
 * Handles:
 *  - WebSocket connect / disconnect lifecycle
 *  - Automatic fallback to HTTP polling if WebSocket drops
 *  - Cleanup on unmount or noteId change
 *
 * @param {number|null} noteId - The note to track (null = inactive)
 * @returns {{ status: string|null, error: string|null, isConnected: boolean }}
 */
const useNoteWebSocket = (noteId) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const cleanupRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // ─── Fallback polling ──────────────────────────────

  const startPolling = useCallback(
    (id) => {
      if (pollIntervalRef.current) return; // already polling

      pollIntervalRef.current = setInterval(async () => {
        try {
          const data = await getNoteStatus(id);
          if (!isMountedRef.current) return;

          setStatus(data.status);

          if (TERMINAL_STATUSES.has(data.status)) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        } catch (err) {
          console.error("[Poll] Failed:", err);
        }
      }, 3000);
    },
    []
  );

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // ─── WebSocket lifecycle ───────────────────────────

  useEffect(() => {
    isMountedRef.current = true;

    if (!noteId) return;

    // Reset state for new connection
    setStatus(null);
    setError(null);
    setIsConnected(false);

    const cleanup = connectNoteWebSocket(
      noteId,
      // onStatusUpdate
      (data) => {
        if (!isMountedRef.current) return;

        setStatus(data.status);
        setIsConnected(true);
        stopPolling(); // if we get a WS message, stop any active polling

        // Close connection on terminal status
        if (TERMINAL_STATUSES.has(data.status)) {
          cleanupRef.current?.();
        }
      },
      // onError
      () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
        startPolling(noteId); // fallback
      },
      // onClose
      (event) => {
        if (!isMountedRef.current) return;
        setIsConnected(false);

        // If not a clean close and not terminal, start polling
        if (event.code !== 1000) {
          startPolling(noteId);
        }
      }
    );

    cleanupRef.current = cleanup;

    return () => {
      isMountedRef.current = false;
      cleanup();
      stopPolling();
    };
  }, [noteId, startPolling, stopPolling]);

  return { status, error, isConnected };
};

export default useNoteWebSocket;
