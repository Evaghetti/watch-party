import asyncio
import websockets

from room import WatchParty

def run():
    w = WatchParty("videos/frag_bunny.webm")

    start_server = websockets.serve(w, "localhost", 1337)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    run()