let itens = JSON.parse(localStorage.getItem('itensDate')) || [];
const cores = ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#E3BAFF', '#FF96C5'];
let anguloAtual = 0;
let historico = localStorage.getItem('historico') || '';
const MAX_CARACTERES = 14;
const MAX_OPCOES = 8;

window.onload = function() {
    atualizarRoda(); 
};

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

    const musicaInicio = document.getElementById('musicaInicio');
    musicaInicio.play();

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

        const musicaComemoracao = document.getElementById('musicaComemoracao');
        musicaComemoracao.play(); 

        setTimeout(() => {
            const musica = document.getElementById('resultadoMusica');
            musica.play(); 
        }, 3000);

        historico = resultado;
        localStorage.setItem('historico', historico);
        document.getElementById('historico').textContent = `Ultimo sorteio: ${historico}`;

        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 },
            shapes: ['circle', 'square', 'heart'],
            colors: ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#E3BAFF']
        });
    }, 5000); 
}

document.getElementById('itemInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        adicionarItem();
    }
});

function adicionarItem() {
    const input = document.getElementById('itemInput');
    const valor = input.value.trim();

    if (!valor || itens.includes(valor)) {
        exibirPopup('Por favor, insira um valor válido e único.');
        return;
    }

    if (valor.length > MAX_CARACTERES) {
        exibirPopup(`O item não pode ter mais de ${MAX_CARACTERES} caracteres.`);
        return;
    }

    if (itens.length >= MAX_OPCOES) {
        exibirPopup('Você já tem o número máximo de opções na roleta.');
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
    const popupRemover = document.getElementById('popupRemover');
    const overlayRemover = document.getElementById('overlayRemover');
    popup.style.display = 'none';
    overlay.style.display = 'none';
    popupRemover.style.display = 'none';
    overlayRemover.style.display = 'none';
}

function exibirPopupRemover() {
    const overlayRemover = document.getElementById('overlayRemover');
    const popupRemover = document.getElementById('popupRemover');
    const listaOpcoes = document.getElementById('listaOpcoes');

    listaOpcoes.innerHTML = '';

    itens.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('opcao-lista');
        div.textContent = item;
        div.onclick = () => removerItem(index);
        listaOpcoes.appendChild(div);
    });

    overlayRemover.style.display = 'block';
    popupRemover.style.display = 'block';
}

function removerItem(index) {
    itens.splice(index, 1);
    
    localStorage.setItem('itensDate', JSON.stringify(itens));
    
    atualizarRoda();
    
    exibirPopupSucesso("Item removido com sucesso!");
    
    fecharPopup(); 
}

function exibirPopupSucesso(mensagem) {
    const popupSucesso = document.getElementById('popupSucesso');
    const overlaySucesso = document.getElementById('overlaySucesso');
    const popupMensagemSucesso = document.getElementById('popupMensagemSucesso');
    
    popupMensagemSucesso.textContent = mensagem;
    
    popupSucesso.style.display = 'flex';
    overlaySucesso.style.display = 'block';
}

function fecharPopupSucesso() {
    const popupSucesso = document.getElementById('popupSucesso');
    const overlaySucesso = document.getElementById('overlaySucesso');
    
    popupSucesso.style.display = 'none';
    overlaySucesso.style.display = 'none';
}

document.getElementById('wheel').addEventListener('click', girar);
