const CRIOU_USUARIO = 1;
const MENSAGEM = 2;

let escondido = false, user = null;
let webSocket = null;

function toggleChat() {
    if (escondido) {
        $(".chat").show();
        $("#menu").css("margin-left", "50%");
    }
    else {
        $(".chat").hide();
        $("#menu").css("margin-left", "80%");
    }

    escondido = !escondido;
}

function mensagem(quemEnviou, conteudo) {
    elemento = $(`<div class="mensagem"><p>${quemEnviou}</p><p>${conteudo}</p></div>`);
    $(".lista-mensagens").append(elemento);
}

function enviarMensagem() {
    if (!webSocket)
        return;
    webSocket.send(JSON.stringify({tipo: MENSAGEM, id: user.id, quemEnviou: user.nome, conteudo: $("textarea").val()}));
    $("textarea").val("");
}

$(document).ready(function() {
    toggleChat();

    $("#menu").click(toggleChat);

    $("textarea").keyup(function(e) {
        if (e.which == 13 && !e.shiftKey)
            enviarMensagem();
    });
    $("#submit").click(enviarMensagem);

    const mediaSource = new MediaSource();
    webSocket = new WebSocket("ws://localhost:1337");

    const video = $("video")[0];
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener("sourceopen", (x) => { 
        console.log("sourceopen");

        // const mimec = 'video/mp4; codecs="avc1.640028,mp4a.40.2"';
        const mimec = 'video/mp4; codecs="avc1.64001f,mp4a.40.2"';

        if (!MediaSource in window) {
            console.error("Não tem MediaSource");
            return;
        }

        console.log(`Fazendo testes com ${mimec}`);
        if (!MediaSource.isTypeSupported(mimec)) {
            console.error(`${mimec} é inválido`);
            return;
        }

        mediaSource.addSourceBuffer(mimec);
        mediaSource.sourceBuffers[0].addEventListener("updateend", (ev) => {
            // mediaSource.endOfStream();
            mediaSource.sourceBuffers[0].timestampOffset += 10;
        });        
    });

    // Ao abrir um websocket, pede pra criar usuario
    webSocket.onopen = () => webSocket.send(`{"tipo":1}`);

    webSocket.onmessage = async function(ev)  {
        console.log("Mensagem recebida do server:", ev.data);
        try {
            const objetoRecebido = JSON.parse(ev.data);

            switch (objetoRecebido.tipo) {
                case CRIOU_USUARIO:
                    user = {id: objetoRecebido.id, nome: prompt("Digite o seu nome na party")};
                    mensagem("", "Você se juntou ao watch party!");

                    webSocket.send(JSON.stringify({id: user.id, tipo: 3})); // Começa a streamar o vídeo
                    break;
                case MENSAGEM:
                    mensagem(objetoRecebido.quemEnviou, objetoRecebido.conteudo);
                    break;
                default:
                    console.error(`TIPO ${objetoRecebido.tipo} DESCONHECIDO, IGNORANDO`);
            }
        }
        catch(e) {
            var fileReader = new FileReader();
            fileReader.onload = function(event) {
                console.log(event.target.result);
                mediaSource.sourceBuffers[0].appendBuffer(event.target.result);
            };
            fileReader.readAsArrayBuffer(ev.data);
        }
    };
});