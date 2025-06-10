const tabuleiro = document.getElementById("game-board");
const visorTempo = document.getElementById("timer");
const visorPontos = document.getElementById("score");
const mensagemFim = document.getElementById("end-message");
const botaoReiniciar = document.getElementById("restart-button");

const somAcerto = document.getElementById("acerto-som");
const somErro = document.getElementById("erro-som");

let icones = ["🍕", "🥗", "🍧", "🍣", "🍓", "🍟", "🍩", "🧃"];
let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let travarJogo = false;
let pontuacao = 0;
let paresEncontrados = 0;
let totalPares = icones.length;
let tempoRestante = 60;
let intervaloTempo = null;

function iniciarJogo() {
    cartas = duplicarIcones(icones);
    embaralharCartas(cartas);
    criarCartasNoTabuleiro(cartas);
    pontuacao = 0;
    paresEncontrados = 0;
    tempoRestante = 60;
    visorPontos.textContent = pontuacao;
    visorTempo.textContent = tempoRestante;
    mensagemFim.textContent = "";
    botaoReiniciar.style.display = "none";
    iniciarContadorRegressivo();
}

function duplicarIcones(lista) {
    return lista.concat(lista);
}

function embaralharCartas(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
}

function criarCartasNoTabuleiro(listaCartas) {
    tabuleiro.innerHTML = "";

    listaCartas.forEach(icone => {
        let carta = document.createElement("div");
        carta.classList.add("card");
        carta.dataset.icone = icone;
        carta.textContent = "🍴";

        carta.addEventListener("click", () => virarCarta(carta));

        tabuleiro.appendChild(carta);
    });
}

function iniciarContadorRegressivo() {
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        tempoRestante--;
        visorTempo.textContent = tempoRestante;

        if (tempoRestante <= 0) {
            clearInterval(intervaloTempo);
            fimDeJogo(false);
        }
    }, 1000);
}

function virarCarta(carta) {
    if (travarJogo || carta.classList.contains("card-revealed") || carta === primeiraCarta) return;

    carta.textContent = carta.dataset.icone;
    carta.classList.add("card-revealed");

    if (!primeiraCarta) {
        primeiraCarta = carta;
        return;
    }

    segundaCarta = carta;
    travarJogo = true;

    verificarSeEhPar();
}

function esconderCartas() {
    primeiraCarta.textContent = "🍴";
    segundaCarta.textContent = "🍴";
    primeiraCarta.classList.remove("card-revealed");
    segundaCarta.classList.remove("card-revealed");
    limparCartasSelecionadas();
}

function limparCartasSelecionadas() {
    primeiraCarta = null;
    segundaCarta = null;
    travarJogo = false;
}

function verificarSeEhPar() {
    if (primeiraCarta.dataset.icone === segundaCarta.dataset.icone) {
        pontuacao++;
        paresEncontrados++;
        visorPontos.textContent = pontuacao;
        somAcerto.play();
        limparCartasSelecionadas();

        if (paresEncontrados === totalPares) {
            clearInterval(intervaloTempo);
            fimDeJogo(true);
        }

    } else {
        somErro.play();
        setTimeout(esconderCartas, 1000);
    }
}

function fimDeJogo(ganhou) {
    mensagemFim.textContent = ganhou ? "🎉 Você ganhou!" : "⏰ Tempo esgotado! Você perdeu!";
    botaoReiniciar.style.display = "block";
    travarJogo = true;
}

botaoReiniciar.addEventListener("click", iniciarJogo);

// Iniciar o jogo ao carregar
iniciarJogo();



