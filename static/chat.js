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
});