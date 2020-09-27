from uuid import uuid1

from json import loads as JSON_Decode
from json import dumps as JSON_Encode

from sys import stderr

from websockets import WebSocketServerProtocol
import asyncio

from subprocess import run, PIPE

def gerarUuid():
    return str(uuid1())

class User:
    def __init__(self, socket: WebSocketServerProtocol):
        self.id = gerarUuid()
        self.socket = socket
        self.offset = 0

class WatchParty:
    CRIAR_USUARIO = 1
    MENSAGEM = 2
    VIDEO = 3

    def __init__(self, videoPath: str):
        self.id = gerarUuid()
        self.videoPath = videoPath
        self.users = []

    async def __call__(self, websocket: WebSocketServerProtocol, url: str):
        async for mensagemCrua in websocket: # Toda mensagem enviada pro server é um JSON
            print(f"[WATCH PARTY {self.id}] Mensagem recebida {mensagemCrua}")
            request = JSON_Decode(mensagemCrua)

            # Se não tiver tipo no JSON, é impossível processar o que foi pedido.
            if request["tipo"] is None:
                print(f"[ERRO WATCH PARTY] JSON não possui tipo", file=stderr)
                continue
            
            if request["tipo"] == WatchParty.CRIAR_USUARIO:
                novoUser = self.gerarUsuario(websocket)
                await novoUser.socket.send(JSON_Encode({"tipo": WatchParty.CRIAR_USUARIO, "id": novoUser.id}))

                for userAtual in (user for user in self.users if user.id != novoUser.id):
                    await userAtual.socket.send(JSON_Encode({"tipo": WatchParty.MENSAGEM, "quemEnviou": "", "conteudo": "Um novo usuário se juntou à watch party!"}))
            elif request["tipo"] == WatchParty.MENSAGEM:
                for user in self.users:
                    await user.socket.send(JSON_Encode({"tipo": WatchParty.MENSAGEM, "quemEnviou": request["quemEnviou"], "conteudo": request["conteudo"]}))
            elif request["tipo"] == WatchParty.VIDEO:
                print(f"[WATCH PARTY] Enviando chunk {self.videoPath}")

                user = None
                for userAtual in self.users:
                    if request["id"] == userAtual.id:
                        user = userAtual
                        break
                else:
                    await websocket.send(JSON_Encode({"tipo": 55, "conteudo": f"ID {request['id']} inválido"}))
                    continue

                chunk = run(["ffmpeg", "-i", self.videoPath, "-c:v", "h264", "-c:a", "aac", "-movflags", "frag_keyframe+empty_moov+default_base_moof", "-t", "10", '-ss', str(user.offset), "-f", "mp4", "pipe:1"], check=True, stdout=PIPE)
                user.offset += 10
                await user.socket.send(chunk.stdout)

                    

    def gerarUsuario(self, websocket: WebSocketServerProtocol):
        idGerado = gerarUuid()
        
        # Improvavel um UUID se repetir, mas caso ocorra...
        idJaGerados = [user.id for user in self.users]
        while idGerado in idJaGerados:
            idGerado = gerarUuid()

        novoUser = User(websocket)
        self.users.append(novoUser)
        
        return novoUser
        