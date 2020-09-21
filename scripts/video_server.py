import asyncio
import websockets

import asyncio
import websockets

video = open("videos/teste.mp4", "rb")

async def echo(websocket, path):
    async for mensagem in websocket:
        with open("videos/frag_bunny.mp4", "rb") as teste:
            await websocket.send(teste.read())
            print("Enviou")

def run():
    start_server = websockets.serve(echo, "localhost", 1337)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    run()