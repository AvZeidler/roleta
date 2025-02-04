let itens = JSON.parse(localStorage.getItem('itensDate')) || [];
const cores = ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#E3BAFF', '#FF96C5'];
let anguloAtual = 0;
let historico = localStorage.getItem('historico') || '';

function atualizarRoda() {
    const svg = document.getElementById('wheel');
    svg.innerHTML = '';
    
    const raio = 150;
    const centro = 150;
    const totalItens = Math.max(itens.length, 1);

    if (totalItens === 1) {
        const circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circulo.setAttribute("cx", centro);
        circulo.setAttribute("cy", centro);
        circulo.setAttribute("r", raio);
        circulo.setAttribute("fill", cores[0]);
        svg.appendChild(circulo);

        const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
        texto.setAttribute("x", centro);
        texto.setAttribute("y", centro);
        texto.setAttribute("text-anchor", "middle");
        texto.setAttribute("dominant-baseline", "middle");
        texto.style.fontSize = "18px";
        texto.style.fill = "#000";
        texto.textContent = itens[0];
        svg.appendChild(texto);
    } else {
        itens.forEach((item, index) => {
            let anguloInicio = (index * 360 / totalItens);
            let anguloFim = ((index + 1) * 360 / totalItens);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = `M ${centro},${centro} L ${centro + raio * Math.cos(Math.PI * anguloInicio / 180)},${centro + raio * Math.sin(Math.PI * anguloInicio / 180)} A ${raio},${raio} 0 ${(anguloFim - anguloInicio) > 180 ? 1 : 0},1 ${centro + raio * Math.cos(Math.PI * anguloFim / 180)},${centro + raio * Math.sin(Math.PI * anguloFim / 180)} Z`;
            path.setAttribute("d", d);
            path.setAttribute("fill", cores[index % cores.length]);
            svg.appendChild(path);

            const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const anguloTexto = (anguloInicio + anguloFim) / 2;
            const posX = centro + (raio * 0.6) * Math.cos(Math.PI * anguloTexto / 180);
            const posY = centro + (raio * 0.6) * Math.sin(Math.PI * anguloTexto / 180);
            texto.setAttribute("x", posX);
            texto.setAttribute("y", posY);
            texto.setAttribute("text-anchor", "middle");
            texto.setAttribute("dominant-baseline", "middle");
            texto.style.fontSize = "12px";
            texto.style.fill = "#000";
            texto.textContent = item;
            svg.appendChild(texto);
        });
    }

    document.getElementById('historico').textContent = historico ? `Historico: ${historico}` : '';
}

function girar() {
    if (itens.length < 1) {
        exibirPopup('Por favor, adicione pelo menos 1 opção!');
        return;
    }
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    document.getElementById('resultado').textContent = '';

    const svg = document.getElementById('wheel');
    const girosCompletos = 5;
    const anguloAleatorio = Math.random() * 360;
    const anguloTotal = girosCompletos * 360 + anguloAleatorio;
    svg.style.transform = `rotate(${anguloAtual + anguloTotal}deg)`;
    anguloAtual += anguloTotal;

    setTimeout(() => {
        loading.style.display = 'none';
        const anguloFinal = anguloAtual % 360;
        const anguloEfetivo = (360 - anguloFinal) % 360;
        const anguloPorItem = 360 / itens.length;
        const indexVencedor = Math.floor(anguloEfetivo / anguloPorItem);
        const resultado = itens[indexVencedor];
        document.getElementById('resultado').textContent = `Resultado: ${resultado} 🎉`;

        const musica = document.getElementById('resultadoMusica');
        musica.play(); // Toca a música

        historico = resultado;
        localStorage.setItem('historico', historico);
        document.getElementById('historico').textContent = `Último date: ${historico}`;

        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 },
            shapes: ['circle', 'square', 'heart'],
            colors: ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#E3BAFF']
        });
    }, 5000);
}

function adicionarItem() {
    const input = document.getElementById('itemInput');
    const valor = input.value.trim();
    if (!valor || itens.includes(valor)) {
        exibirPopup('Por favor, insira um valor válido e único.');
        return;
    }
    itens.push(valor);
    input.value = '';
    localStorage.setItem('itensDate', JSON.stringify(itens));
    atualizarRoda();
    document.getElementById('resultado').textContent = '';
}

function limparCache() {
    localStorage.removeItem('itensDate');
    localStorage.removeItem('historico');
    itens = [];
    historico = '';
    atualizarRoda();
    document.getElementById('resultado').textContent = '';
}

function exibirPopup(mensagem) {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = mensagem;
    popup.style.display = 'flex';
    overlay.style.display = 'block';
}

function fecharPopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

if (itens.length > 0) atualizarRoda();

const container = document.querySelector('.container');
container.addEventListener('click', girar);
