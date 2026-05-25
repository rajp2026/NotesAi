import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";
const WS_BASE = "ws://127.0.0.1:8000";

const API = axios.create({
  baseURL: `${API_BASE}/api/v1`,
});

// ─── Upload ──────────────────────────────────────────────

/**
 * Upload a note image file.
 * @param {File} file
 * @returns {Promise<{ id: number, title: string, status: string, ... }>}
 */
export const uploadNote = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/notes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ─── Status ──────────────────────────────────────────────

/**
 * Fetch current note status (fallback for reconnect / initial load).
 * @param {number} noteId
 * @returns {Promise<{ id: number, status: string, generated_pdf_url: string|null, ... }>}
 */
export const getNoteStatus = async (noteId) => {
  const response = await API.get(`/notes/${noteId}`);
  return response.data;
};

// ─── WebSocket ───────────────────────────────────────────

/**
 * Open a WebSocket connection for real-time pipeline status updates.
 *
 * @param {number}   noteId         - The note to subscribe to
 * @param {Function} onStatusUpdate - Called with { note_id, status } on each push
 * @param {Function} [onError]      - Called on WebSocket error
 * @param {Function} [onClose]      - Called when connection closes
 * @returns {() => void} cleanup function to close the connection
 */
export const connectNoteWebSocket = (
  noteId,
  onStatusUpdate,
  onError,
  onClose
) => {
  const ws = new WebSocket(`${WS_BASE}/ws/${noteId}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onStatusUpdate(data);
    } catch {
      console.error("[WS] Failed to parse message:", event.data);
    }
  };

  ws.onerror = (err) => {
    console.error("[WS] Error:", err);
    onError?.(err);
  };

  ws.onclose = (event) => {
    console.log("[WS] Closed:", event.code, event.reason);
    onClose?.(event);
  };

  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
};

// ─── Download ────────────────────────────────────────────

/**
 * Trigger PDF download in the browser.
 * Opens the download endpoint in a new tab — the browser handles the file save.
 * @param {number} noteId
 */
export const downloadNotePdf = (noteId) => {
  window.open(`${API_BASE}/api/v1/notes/${noteId}/download`, "_blank");
};
