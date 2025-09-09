async function play() {
    const menorValor = parseInt(document.querySelector('#min').value);
    const maiorValor = parseInt(document.querySelector('#max').value);
    const elementValue = document.querySelector('h2');
    elementValue.innerHTML = ''; // Limpar o conteúdo antes de começar

    // Número de sorteios antes de parar
    const totalSorteios = 20;
    
    // Cria um intervalo para atualizar o número
    let currentSorteio = 0;
    const interval = setInterval(() => {
        // Gerando um número aleatório
        const sorteioAtual = Math.floor(Math.random() * (maiorValor - menorValor + 1)) + menorValor;
        elementValue.innerText = sorteioAtual; // Atualiza o número exibido
        currentSorteio++;

        if (currentSorteio >= totalSorteios) {
            clearInterval(interval); // Para o sorteio
            const resultadoFinal = Math.floor(Math.random() * (maiorValor - menorValor + 1)) + menorValor;
            elementValue.innerText = resultadoFinal; // Exibe o resultado final
        }
    }, 20); // Atualiza a cada 100 milissegundos

    // Espera um tempo antes de parar o sorteio
    await wait(totalSorteios * 0); // Espera o tempo total do sorteio

    function wait(tempo) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), tempo);
        });
    }

    elementValue.classList.add('rotate');
setTimeout(() => {
    elementValue.classList.remove('rotate');
}, 1); // Remover após 100ms
}



/*
async function play() {

    const menorValor = Number(document.querySelector('#min')).value;
    const maiorValor = Number(document.querySelector('#max')).value;

    for (let j = 0; j < 20; j++) {

        const elementValue = document.querySelector('h2');
        elementValue.innerHTML = ''

        for (let i = 0; i < 10; i++) {

            const result = Math.floor(Math.random() * (maiorValor - menorValor + 1)) + menorValor;

            const resultElement = document.createElement('div');
            resultElement.classList.add('result-value')
            resultElement.innerText = result;

            result.append(resultElement);
        }

        await wait(20)
    }

    function wait(tempo) {
        return new Promise((rsolve) => {
            setTimeout(() => rsolve(), tempo)
        })
    }
}

*/