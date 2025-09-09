async function sortear() {
    // pegar o total de resultados
    const totalResultado = Number(document.querySelector('#totalResultadosInput').value);
    // Pegar o menor valor
    const menorValor = Number(document.querySelector('#menorValorInput').value);
    // Pegar o Maior valor
    const maiorValor = Number(document.querySelector('#maiorValorInput').value);

    // Verificar se o menor valor é maior que o maior valor

    for (let j = 0; j < 20; j++) {

        const elementsResultValue = document.querySelector('.results-values');
        elementsResultValue.innerHTML = ''

        for (let i = 0; i < totalResultado; i++) {
            const result = Math.floor(Math.random() * (maiorValor - menorValor + 1)) + menorValor;
            // Criar um elemento HTML para o resultado
            const resultElement = document.createElement('div');
            resultElement.classList.add('result-value')
            resultElement.innerText = result;

            elementsResultValue.append(resultElement);
        }

        await wait(20)

    }

    function wait(tempo) {
        return new Promise((rsolve) => {
            setTimeout(() => rsolve(), tempo)
        })
    }
}
