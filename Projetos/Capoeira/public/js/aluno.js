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
  // Presença: registrar presença ao clicar no botão
  const btnPresenca = document.getElementById('btnRegistrarPresenca');
  // Função para atualizar histórico na tela
  // Função para buscar histórico do backend
  async function atualizarHistorico() {
    const ul = document.getElementById('historicoPresenca');
    if (!ul) return;
    ul.innerHTML = '<li style="color:#ccc;">Carregando...</li>';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/presencas/minhas', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Erro ao buscar histórico');
      const lista = await res.json();
      // Filtra só do mês atual
      const agora = new Date();
      const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;
      const doMes = lista.filter(p => p.mes === mesAtual);
      ul.innerHTML = '';
      if (doMes.length === 0) {
        ul.innerHTML = '<li style="color:#ccc;">Nenhuma presença registrada neste mês.</li>';
      } else {
        doMes.reverse().forEach(item => {
          ul.innerHTML += `<li style=\"margin-bottom:6px;\">${item.data} às ${item.hora}</li>`;
        });
      }
    } catch (err) {
      ul.innerHTML = '<li style="color:#f44336;">Erro ao carregar histórico.</li>';
    }
  }
  atualizarHistorico();

  if (btnPresenca) {
    btnPresenca.addEventListener('click', async function() {
      const agora = new Date();
      const data = agora.toLocaleDateString('pt-BR');
      const hora = agora.toLocaleTimeString('pt-BR');
      const mes = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;
      const msg = `Presença registrada em <b>${data}</b> às <b>${hora}</b>.<br>Você esteve presente na aula!`;
      document.getElementById('listaPresenca').innerHTML = msg;
      btnPresenca.disabled = true;
      btnPresenca.textContent = 'Presença Registrada';
      // Salva no backend
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/presencas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ data, hora, mes })
        });
      } catch (err) {}
      atualizarHistorico();
    });
  }
});
