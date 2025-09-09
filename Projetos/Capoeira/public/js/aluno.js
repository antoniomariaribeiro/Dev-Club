document.addEventListener('DOMContentLoaded', async () => {
  // Logout
  const btnSair = document.getElementById('btnSair');
  if(btnSair){
    btnSair.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('nome');
      localStorage.removeItem('foto');
      window.location.href = 'login.html';
    });
  }
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';

  // Nome do aluno
  document.getElementById('alunoNome').textContent = localStorage.getItem('nome') || 'Aluno';

  // -------------------------
  // Alternar seções
  // -------------------------
  const links = document.querySelectorAll('.aluno-link');
  const sections = document.querySelectorAll('.aluno-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      sections.forEach(sec => sec.style.display = sec.id === 'aluno-' + section ? '' : 'none');
    });
  });

  // -------------------------
  // Presença
  // -------------------------
  const btnPresenca = document.getElementById('btnRegistrarPresenca');
  const listaPresenca = document.getElementById('historicoPresenca');

  async function atualizarHistorico() {
    if (!listaPresenca) return;
    listaPresenca.innerHTML = '<li style="color:#ccc;">Carregando...</li>';
    try {
      const res = await fetch('http://localhost:5000/api/presencas/minhas', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error();
      const lista = await res.json();

      const agora = new Date();
      const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;
      const doMes = lista.filter(p => p.mes === mesAtual);

      listaPresenca.innerHTML = doMes.length ? '' : '<li style="color:#ccc;">Nenhuma presença registrada neste mês.</li>';
      doMes.reverse().forEach(item => {
        listaPresenca.innerHTML += `<li style="margin-bottom:6px;">${item.data} às ${item.hora}</li>`;
      });
    } catch {
      listaPresenca.innerHTML = '<li style="color:#f44336;">Erro ao carregar histórico.</li>';
    }
  }

  atualizarHistorico();

  if(btnPresenca){
    btnPresenca.addEventListener('click', async () => {
      const agora = new Date();
      const data = agora.toLocaleDateString('pt-BR');
      const hora = agora.toLocaleTimeString('pt-BR');
      const mes = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;

      document.getElementById('listaPresenca').innerHTML = 
        `Presença registrada em <b>${data}</b> às <b>${hora}</b>.<br>Você esteve presente na aula!`;

      btnPresenca.disabled = true;
      btnPresenca.textContent = 'Presença Registrada';

      try {
        await fetch('http://localhost:5000/api/presencas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ data, hora, mes })
        });
      } catch {}

      atualizarHistorico();
    });
  }

  // -------------------------
  // Eventos para alunos
  // -------------------------
  const eventosListaPublico = document.getElementById('eventos-lista-publico');
  const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

  if(eventosListaPublico){
    eventosListaPublico.innerHTML = eventos.length ? '' : '<p style="color:#aaa;">Nenhum evento cadastrado ainda.</p>';
    eventos.forEach(ev => {
      const div = document.createElement('div');
      div.className = 'evento-card';
      div.innerHTML = `
        <img src="${ev.imagem}" alt="${ev.nome}">
        <h4>${ev.nome}</h4>
        <p>${ev.data} | ${ev.local}</p>
        <p>${ev.descricao}</p>
      `;
      eventosListaPublico.appendChild(div);
    });
  }

  // -------------------------
  // Perfil do aluno - edição
  // -------------------------
  const btnAlterarDados = document.getElementById('btnAlterarDados');
  const perfilForm = document.getElementById('aluno-perfil-form');
  const perfilFoto = document.getElementById('aluno-perfil-foto');
  const perfilFotoInput = document.getElementById('aluno-perfil-foto-input');
  const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
  if(btnAlterarDados && perfilForm){
    btnAlterarDados.addEventListener('click', () => {
      perfilForm.style.display = '';
      // Preencher dados atuais
      perfilForm.nome.value = localStorage.getItem('nome') || '';
      perfilForm.email.value = localStorage.getItem('email') || '';
      perfilForm.cpf.value = localStorage.getItem('cpf') || '';
      perfilForm.telefone.value = localStorage.getItem('telefone') || '';
      if(localStorage.getItem('foto')){
        perfilFoto.src = localStorage.getItem('foto');
      }
    });
    perfilFotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = () => {
          perfilFoto.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });
    perfilForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Salva localmente
      localStorage.setItem('nome', perfilForm.nome.value);
      localStorage.setItem('email', perfilForm.email.value);
      localStorage.setItem('cpf', perfilForm.cpf.value);
      localStorage.setItem('telefone', perfilForm.telefone.value);
      if(perfilFoto.src){
        localStorage.setItem('foto', perfilFoto.src);
        document.getElementById('alunoFoto').src = perfilFoto.src;
      }
      document.getElementById('alunoNome').textContent = perfilForm.nome.value;
      // Salva no backend
      try {
        const token = localStorage.getItem('token');
        // Recupera o id do usuário do token JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        await fetch(`http://localhost:5000/api/users/${userId}/perfil`, {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: perfilForm.nome.value,
            email: perfilForm.email.value,
            cpf: perfilForm.cpf.value,
            telefone: perfilForm.telefone.value,
            foto: perfilFoto.src
          })
        });
        alert('Perfil atualizado!');
      } catch {
        alert('Erro ao salvar no servidor. Tente novamente.');
      }
      perfilForm.style.display = 'none';
    });
    if(btnCancelarEdicao){
      btnCancelarEdicao.addEventListener('click', () => {
        perfilForm.style.display = 'none';
      });
    }
  }
});