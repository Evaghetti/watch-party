from flask import Flask, render_template
from scripts.utils import getListaArquivos, transformaArquivosJSON

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/watch/<filme>")
def watchParty(filme: str):
    return render_template("watch_party.html", filme = filme)

@app.route("/videos/")
@app.route("/videos/<search>")
def videos(search: str = None):
    return transformaArquivosJSON(getListaArquivos("videos", search))

if __name__ == "__main__":
    app.run(debug=True)
    