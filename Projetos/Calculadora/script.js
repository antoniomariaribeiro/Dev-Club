let resultado = document.getElementById('resultado');
let expressaoAtual = '';

function insert(valor) {
    expressaoAtual += valor;
    resultado.innerHTML = formatarExpressao(expressaoAtual);
}

function clean() {
    expressaoAtual = '';
    resultado.innerHTML = '0';
}

function backspace() {
    expressaoAtual = expressaoAtual.slice(0, -1);
    resultado.innerHTML = expressaoAtual ? formatarExpressao(expressaoAtual) : '0';
}

function calcular() {
    try {
        // 1. Preparar expressão para cálculo
        let expressao = expressaoAtual
            .replace(/\./g, '')         // remove separadores de milhar
            .replace(/,/g, '.')         // troca vírgula por ponto decimal
            .replace(/X/g, '*')         // substitui multiplicação
            .replace(/÷/g, '/')         // substitui divisão
            .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)"); // trata porcentagem

        // 2. Avaliar
        let resultadoFinal = eval(expressao);

        // 3. Atualizar expressão e mostrar resultado
        expressaoAtual = resultadoFinal.toString().replace('.', ',');
        resultado.innerHTML = formatarExpressao(expressaoAtual);
    } catch (e) {
        resultado.innerHTML = 'Erro';
    }
}

function formatarExpressao(expr) {
    return expr.replace(/\d+(,\d+)?/g, (numero) => {
        let partes = numero.replace(/\./g, '').split(',');
        let inteiro = partes[0];
        let decimal = partes[1] || '';
        let comPonto = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return decimal ? `${comPonto},${decimal}` : comPonto;
    });
}

// Destacar botão quando a tecla for pressionada
function destacarBotao(tecla) {
    const mapaTeclas = {
        '*': 'X',
        '/': '÷',
        '.': ','
    };

    const valor = mapaTeclas[tecla] || tecla;

    const botoes = document.querySelectorAll('.botao');
    botoes.forEach(botao => {
        if (botao.textContent === valor) {
            botao.classList.add('ativo');
            setTimeout(() => botao.classList.remove('ativo'), 150);
        }
    });
}

// Captura teclas pressionadas
document.addEventListener('keydown', function(event) {
    const tecla = event.key;

    if (!isNaN(tecla)) {
        insert(tecla);
        destacarBotao(tecla);
    }

    if (['+', '-', '*', '/', '%', ',', '.'].includes(tecla)) {
        const op = (tecla === '*') ? 'X' :
                   (tecla === '/') ? '÷' :
                   (tecla === '.' || tecla === ',') ? ',' : tecla;
        insert(op);
        destacarBotao(tecla);
    }

    if (tecla === 'Enter') {
        calcular();
        destacarBotao('=');
    }

    if (tecla === 'Backspace') {
        backspace();
        destacarBotao('⌫');
    }

    if (tecla === 'Escape') {
        clean();
        destacarBotao('AC');
    }

    // Copiar resultado com Ctrl + C
    if (event.ctrlKey && tecla.toLowerCase() === 'c') {
        navigator.clipboard.writeText(resultado.textContent)
            .then(() => {
                resultado.innerHTML = 'Copiado!';
                setTimeout(() => {
                    resultado.innerHTML = formatarExpressao(expressaoAtual || '0');
                }, 1000);
            })
            .catch(() => {
                resultado.innerHTML = 'Erro ao copiar';
            });
    }
});