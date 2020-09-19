# Percorre todos arquivos em uma pasta e subpastas e gera um array com o path pros arquivos
# path é a pasta que será percorrida
# search é uma string que o nome do arquivo deve ter, ou None se não precisar de filtro
def getListaArquivos(path: str, search: str = None):
    # Não pretendo usar isso em outro lugar desse script...
    from os.path import isdir
    from os import listdir

    # Lógica principal.
    arquivos = []
    for arquivo in listdir(path):
        pathAtual = f"{path}/{arquivo}"

        # Se tiver passado um filtro, o arquivo atual não for uma pasta e o filtro não estiver no nome do arquivo, ignora.
        if search is not None and search not in path and isdir(pathAtual):
            continue

        # Se for uma pasta gera a lista de arquivos para essa subpasta
        if isdir(pathAtual):
            arquivos += getListaArquivos(pathAtual)
        # Se não, só acrescenta o arquivo na lista
        else:
            arquivos.append(pathAtual)

    return arquivos

# Recebe uma lista de arquivos, transforma num json com nome e mimetype destes arquivos.
def transformaArquivosJSON(arquivos: list):
    from json import dumps as JSON_Encode
    from magic import Magic
    mime = Magic(mime = True)

    json = []
    for arquivo in arquivos:
        json.append({"nome": arquivo, "mime": mime.from_file(arquivo), "path": arquivo})

    return JSON_Encode(json)

# Para testar...
if __name__ == "__main__":
    print(transformaArquivosJSON(getListaArquivos("videos")))