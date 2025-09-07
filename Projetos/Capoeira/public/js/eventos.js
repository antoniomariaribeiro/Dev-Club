// eventos.js
// Exemplo de lógica para exibir formulário de admin e carregar eventos futuramente

document.addEventListener('DOMContentLoaded', function() {
  // Simulação: controle de admin (troque para false para testar como usuário comum)
  const isAdmin = false; // Troque para true se for admin
  const formEvento = document.getElementById('form-evento');
  if (isAdmin) {
    formEvento.style.display = 'block';
  } else {
    formEvento.style.display = 'none';
  }

  // Aqui você pode adicionar lógica para buscar eventos do backend e exibir na lista
  // Exemplo: fetch('/api/eventos').then(...)
});
