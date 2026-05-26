"""
Cross-process WebSocket notification helper.

Kafka consumers run in separate processes from FastAPI,
so they can't call ConnectionManager.send_status() directly
(different process = different manager instance = no clients).

Instead, consumers call this function which fires an HTTP POST
to the FastAPI server's internal endpoint, which then pushes
the status through the real WebSocket connection.
"""

import requests


NOTIFY_URL = "http://localhost:8000/internal/ws/notify"


def notify_status(note_id: int, status: str):
    """
    Fire-and-forget HTTP POST to the FastAPI server.
    If the server is down or the request fails, we silently
    ignore — WebSocket is best-effort, the DB is the source
    of truth.
    """
    try:
        requests.post(
            NOTIFY_URL,
            json={
                "note_id": note_id,
                "status": status
            },
            timeout=2
        )
    except Exception as e:
        print(f"[WS Notify] Failed: {e}")
