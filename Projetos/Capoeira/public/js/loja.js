// public/js/loja.js
// Script para exibir produtos na loja pública


async function renderizarProdutosLoja() {
  const container = document.getElementById('produtos');
  if (!container) return;
  container.innerHTML = '<div style="color:#888;">Carregando produtos...</div>';
  try {
    const res = await fetch('http://localhost:5000/api/produtos');
    const produtos = await res.json();
    container.innerHTML = produtos.length ? '' : '<div style="color:#888;">Nenhum produto disponível no momento.</div>';
    produtos.forEach(produto => {
      const div = document.createElement('div');
      div.className = 'produto';
      div.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <span class="preco">R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</span>
        <button class="comprar-btn">Comprar</button>
      `;
      container.appendChild(div);
    });
  } catch {
    container.innerHTML = '<div style="color:#f44336;">Erro ao carregar produtos.</div>';
  }
}

document.addEventListener('DOMContentLoaded', renderizarProdutosLoja);
