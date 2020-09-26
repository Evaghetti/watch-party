let escondido = false;

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

$(document).ready(function() {
    toggleChat();

    $("#menu").click(toggleChat);

    const mediaSource = new MediaSource();
    const webSocket = new WebSocket("ws://localhost:1337");

    const video = $("video")[0];
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener("sourceopen", (x) => { 
        console.log("sourceopen");
        mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
        mediaSource.sourceBuffers[0].addEventListener("updateend", (ev) => {
            // webSocket.send("aa");
            console.log("Fechou");
            mediaSource.endOfStream();
            video.play();
        });        
    });

    webSocket.onopen = () => webSocket.send("aa");
    webSocket.onmessage = async function(ev)  {
        console.log("oi", ev.data);

        var fileReader = new FileReader();
        fileReader.onload = function(event) {
            console.log(event.target.result);
            mediaSource.sourceBuffers[0].appendBuffer(event.target.result);
        };
        fileReader.readAsArrayBuffer(ev.data);
    };
});