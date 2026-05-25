from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        self.active_connections = {}


    async def connect(

        self,

        note_id: int,

        websocket: WebSocket
    ):

        await websocket.accept()

        self.active_connections[
            note_id
        ] = websocket


    def disconnect(
        self,
        note_id: int
    ):

        self.active_connections.pop(
            note_id,
            None
        )


    async def send_status(

        self,

        note_id: int,

        status: str
    ):
        print("sending websockets status")
        websocket = (
            self.active_connections.get(
                note_id
            )
        )

        if websocket:

            await websocket.send_json({

                "note_id": note_id,

                "status": status
            })


manager = ConnectionManager()