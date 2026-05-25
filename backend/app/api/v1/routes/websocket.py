from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
import asyncio

from app.websockets.connection_manager import (
    manager
)


router = APIRouter()


@router.websocket(
    "/ws/{note_id}"
)
async def websocket_endpoint(

    websocket: WebSocket,

    note_id: int
):

    await manager.connect(
        note_id,
        websocket
    )

    try:

        while True:

            await asyncio.sleep(1)

    except WebSocketDisconnect:

        manager.disconnect(
            note_id
        )