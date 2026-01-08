// Configurações do Telegram
const TELEGRAM_TOKEN = '8332064581:AAHsM3tcSj27MdVHoRzF8Nb8EI697CcgIas';
const CHAT_ID = '1753839424';

const perguntas = [
    { q: "Onde foi o nosso primeiro beijo?", opts: ["Pátio", "Atrás do batista", "Sala"], ans: 1 },
    { q: "Qual foi o menu do dia com minha mãe?", opts: ["Macarrão", "Strogonoff", "Bife"], ans: 0 },
    { q: "Qual nossa especialidade?", opts: ["Pudim", "Escondidinho", "Strogonoff"], ans: 2 }
];

function tocarSom(tipo) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);

    if (tipo === 'acerto') {
        osc.frequency.setValueAtTime(440, context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1);
    } else {
        osc.frequency.setValueAtTime(200, context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.2);
    }
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    osc.start();
    osc.stop(context.currentTime + 0.2);
}

function proximaFase(f) {
    const conteudo = document.getElementById('conteudo');
    if (f <= perguntas.length) {
        let p = perguntas[f-1];
        let html = `<h2>FASE ${f}</h2><p>${p.q}</p>`;
        p.opts.forEach((opt, i) => {
            html += `<button onclick="verificar(${f}, ${i})">${opt}</button>`;
        });
        conteudo.innerHTML = html;
    } else {
        document.getElementById('titulo').innerText = "FINAL BOSS";
        conteudo.innerHTML = `
            <p>ACEITA CASAR COMIGO?</p>
            <button onclick="tocarSom('acerto'); aceitar()">SIM</button>
            <button onclick="tocarSom('erro'); recusar()">NÃO</button>
        `;
    }
}

function verificar(fase, escolha) {
    if (escolha === perguntas[fase-1].ans) {
        tocarSom('acerto');
        proximaFase(fase + 1);
    } else {
        tocarSom('erro');
        document.getElementById('feedback').innerText = "GAME OVER! Tente de novo.";
    }
}

function aceitar() {
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=ELA DISSE SIM! 💍`);
    window.open('https://www.youtube.com/watch?v=g8z-qP34-1Y', '_blank');
    document.getElementById('game-box').innerHTML = "<h1>VICTORY! ❤️</h1>";
}

function recusar() { alert("Opção bloqueada! 👍"); }