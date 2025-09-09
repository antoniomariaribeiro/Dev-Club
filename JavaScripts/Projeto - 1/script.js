const convertButton = document.querySelector('.convert-on-click');
const currencySelectToConverted = document.querySelector('.currency-select-to-converted')
const currencySelect = document.querySelector('.currency-select');
const exchangeRates = {
    BRL: { USD: 0.18, EUR: 0.16, GBP: 0.13, JPY: 25.62, BTC: 0.000018 },
    USD: { BRL: 5.66, EUR: 0.88, GBP: 0.75, JPY: 143.97, BTC: 0.000010 },
    EUR: { BRL: 6.40, USD: 1.13, GBP: 0.85, JPY: 163.77, BTC: 0.000012 },
    GBP: { BRL: 7.51, USD: 1.33, EUR: 1.17, JPY: 192.27, BTC: 0.000014 },
    JPY: { BRL: 0.039, USD: 0.0069, EUR: 0.0061, GBP: 0.0052, BTC: 0.00000007 },
    BTC: { BRL: 547223.74, USD: 96757.30, EUR: 85591.84, GBP: 72892.35, JPY: 14078109.91 }
};

function convertValues() {
    const inputCurrencyValue = parseFloat(document.querySelector('.input-currency').value)
    const daMoeda = document.getElementById('converter').value;
    const paraMoeda = document.getElementById('convertida').value;
    const conversionRates = exchangeRates[daMoeda][paraMoeda];
    const convertedValue = inputCurrencyValue * conversionRates;

    if (daMoeda === paraMoeda) {
        document.querySelector('.currency-daMoeda').innerHTML = inputCurrencyValue.toFixed(2);
        document.querySelector('.currency-daMoeda').innerHTML = inputCurrencyValue.toFixed(2);
        return;
    }
    // Moeda de Origem

    if (currencySelectToConverted.value == 'BRL') {
        document.querySelector('.currency-daMoeda').innerHTML = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(inputCurrencyValue);
    }
    if (currencySelectToConverted.value == 'USD') {
        document.querySelector('.currency-daMoeda').innerHTML = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(inputCurrencyValue);
    }
    if (currencySelectToConverted.value == 'GBP') {
        document.querySelector('.currency-daMoeda').innerHTML = new Intl.NumberFormat('en-UK', {
            style: 'currency',
            currency: 'GBP'
        }).format(inputCurrencyValue);
    }
    if (currencySelectToConverted.value == 'EUR') {
        document.querySelector('.currency-daMoeda').innerHTML = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(inputCurrencyValue);
    }
    if (currencySelectToConverted.value == 'JPY') {
        document.querySelector('.currency-daMoeda').innerHTML = new Intl.NumberFormat('jp-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(inputCurrencyValue);
    }
    if (currencySelectToConverted.value == 'BTC') {
        document.querySelector('.currency-daMoeda').innerHTML = new Intl.NumberFormat('BTC', {
            style: 'currency',
            currency: 'BTC'
        }).format(inputCurrencyValue);
    }

    // Moedas convertidas formatadas

    if (currencySelect.value == 'USD') {
        document.querySelector('.currency-paraMoeda').innerHTML = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: "USD"
        }).format(convertedValue);
    }
    if (currencySelect.value == 'EUR') {
        document.querySelector('.currency-paraMoeda').innerHTML = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: "EUR"
        }).format(convertedValue);
    }
    if (currencySelect.value == 'BRL') {
        document.querySelector('.currency-paraMoeda').innerHTML = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: "BRL"
        }).format(convertedValue);
    }
    if (currencySelect.value == 'JPY') {
        document.querySelector('.currency-paraMoeda').innerHTML = new Intl.NumberFormat('jp-JP', {
            style: 'currency',
            currency: "JPY"
        }).format(convertedValue);
    }
    if (currencySelect.value == 'GBP') {
        document.querySelector('.currency-paraMoeda').innerHTML = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: "GBP"
        }).format(convertedValue);
    }
    if (currencySelect.value == 'BTC') {
        document.querySelector('.currency-paraMoeda').innerHTML = new Intl.NumberFormat('BTC', {
            style: 'currency',
            currency: "BTC"
        }).format(convertedValue);
    }
}

function changeOrigem() {
    const currencyOrigem = document.querySelector('.logo-a-converter');
    const currencyText= document.getElementById('currency-origem');

    if(currencySelectToConverted.value == 'USD') {
        currencyText.innerHTML ='Dólar Americano'
        currencyOrigem.src = './assets/dolar.png'
    }
    if(currencySelectToConverted.value == 'EUR') {
        currencyText.innerHTML = 'Euro'
        currencyOrigem.src ='./assets/euro.png'
    }
    if(currencySelectToConverted.value == 'BRL') {
        currencyText.innerHTML ='Real Brasileiro'
        currencyOrigem.src ='./assets/brasil.png'
    }
    if(currencySelectToConverted.value == 'GBP') {
        currencyText.innerHTML = 'Libra Esterlina'
        currencyOrigem.src = './assets/libra.png'
        currencyOrigem.style.height = '70px'
    }
    if(currencySelectToConverted.value == 'JPY') {
        currencyText.innerHTML = 'Iene Japones'
        currencyOrigem.src ='./assets/iene.png'
           currencyOrigem.style.height = '45px'
    }
    if(currencySelectToConverted.value == 'BTC') {
        currencyText.innerHTML = 'Bitcoin'
        currencyOrigem.src ='./assets/bitcoin.png'
    }
}

//trocar texto e bandeira da moeda de destino

function changeCurrency() {
    const currencyName = document.getElementById('currency-name');
    const currencyImage = document.querySelector('.logo-convertida');

if(currencySelect.value == 'USD') {
    currencyName.innerHTML = 'Dolar Americano'
    currencyImage.src = './assets/dolar.png'
}
if(currencySelect.value == 'EUR') {
    currencyName.innerHTML = 'Euro'
    currencyImage.src = './assets/euro.png'
}
if(currencySelect.value == 'BRL') {
    currencyName.innerHTML = 'Real Brasileiro'
    currencyImage.src = './assets/brasil.png'
}
if(currencySelect.value == 'GBP') {
    currencyName.innerHTML = 'Libra Esterlina'
    currencyImage.src = './assets/libra.png'
    currencyImage.style.height = '70px'
}
if(currencySelect.value == 'JPY') {
    currencyName.innerHTML = 'Iene Japones'
    currencyImage.src = './assets/iene.png'
    currencyImage.style.height = '45px'
}
if(currencySelect.value == 'BTC') {
    currencyName.innerHTML = 'Bitcoin'
    currencyImage.src = './assets/bitcoin.png'
}
}

currencySelectToConverted.addEventListener('change', changeOrigem)
currencySelect.addEventListener('change', changeCurrency)
convertButton.addEventListener('click', convertValues);