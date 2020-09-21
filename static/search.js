function criarLista(lista) {
    $("main").html("");

    for (item of lista) {
        const section = $("<section></section>");
        
        // Cria o elemento com a capa do filme
        const divImagem = $("<div class='grid col-12'></div>");
        const img = $("<img class='col-12' src='/static/images/lotr.jpeg' alt='Capa Senhor dos Aneis'>");
        divImagem.append(img);

        // Agora o titulo cone e botão
        const divInfo = $("<div class='grid col-12'></div>");
        divInfo.append('<i class="col-1 fa fa-video-camera"></i>');
        divInfo.append(`<h2 class="col-7">${item.nome}</h2>`);
        divInfo.append('<h2 class="col-4 button">Assistir</h2>')

        section.append(divImagem);
        section.append(divInfo);
        $("main").append(section);

        // Evento rpa trocar pra pagina se clicar nos cards, por hora só um alert pra ver que funciona.
        $(section).click(() => alert('hello'));
    }
}

function atualizarPesquisas(search) {
    const currentSearch = search ? search.currentTarget.value : "";

    fetch(`videos/${currentSearch}`).then(response => response.text())
                                    .then(response => criarLista(JSON.parse(response)));
}

$(document).ready(function() {
    atualizarPesquisas(null);

    $("#search").keyup(atualizarPesquisas);
});