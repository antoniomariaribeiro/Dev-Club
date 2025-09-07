// aluno.js
// Alterna as seções da área do aluno conforme o menu

document.addEventListener('DOMContentLoaded', function() {
  // Proteção: só acessa se estiver logado
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Exemplo: preencher nome do aluno (ajuste para buscar do backend depois)
  document.getElementById('alunoNome').textContent = localStorage.getItem('nome') || 'Aluno';

  const links = document.querySelectorAll('.aluno-link');
  const sections = document.querySelectorAll('.aluno-section');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      sections.forEach(sec => {
        if (sec.id === 'aluno-' + section) {
          sec.style.display = '';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });
});
