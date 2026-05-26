import { useEffect, useRef, useState, useCallback } from "react";
import { connectNoteWebSocket } from "../api/notesApi";
import { TERMINAL_STATUSES } from "../constants/pipeline";

/**
 * Custom hook — manages WebSocket connection for pipeline status updates.
 *
 * The flow:
 *   Kafka Consumer → HTTP POST → FastAPI /internal/ws/notify → WebSocket push → this hook
 *
 * No DB polling. Pure WebSocket push.
 *
 * @param {number|null} noteId - The note to track (null = inactive)
 * @returns {{ status: string|null, isConnected: boolean }}
 */
const useNoteWebSocket = (noteId) => {
  const [status, setStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const cleanupRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!noteId) return;

    // Reset state for new connection
    setStatus(null);
    setIsConnected(false);

    const cleanup = connectNoteWebSocket(
      noteId,
      // onStatusUpdate — pushed from FastAPI via internal notify endpoint
      (data) => {
        if (!isMountedRef.current) return;

        setStatus(data.status);
        setIsConnected(true);

        // Close connection on terminal status
        if (TERMINAL_STATUSES.has(data.status)) {
          cleanupRef.current?.();
        }
      },
      // onError
      () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
      },
      // onClose
      () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
      }
    );

    cleanupRef.current = cleanup;

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [noteId]);

  return { status, isConnected };
};

export default useNoteWebSocket;
