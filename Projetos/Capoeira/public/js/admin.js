// Carregar histórico de presenças dos alunos (admin)
async function carregarPresencasAdmin(mesFiltro = null) {
  const tbody = document.getElementById('tbody-presencas');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;opacity:0.7;">Carregando presenças...</td></tr>';
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/presencas', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao buscar presenças');
    let lista = await res.json();
    if (mesFiltro) {
      lista = lista.filter(p => p.mes === mesFiltro);
    }
    if (!Array.isArray(lista) || lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;opacity:0.7;">Nenhuma presença encontrada.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    lista.forEach(p => {
      tbody.innerHTML += `<tr><td>${p.nome}</td><td>${p.data}</td><td>${p.hora}</td><td>${p.mes}</td></tr>`;
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="color:#f44336;text-align:center;">Erro ao carregar presenças.</td></tr>';
  }
}
// Carregar estatísticas do dashboard
async function carregarDashboard() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/admin/dashboard', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao buscar estatísticas');
    const stats = await res.json();
    document.getElementById('dashboard-total-alunos').textContent = stats.totalUsuarios ?? '-';
    document.getElementById('dashboard-total-eventos').textContent = stats.totalEventos ?? '-';
    document.getElementById('dashboard-total-produtos').textContent = stats.totalProdutos ?? '-';
    document.getElementById('dashboard-total-inscricoes').textContent = stats.totalInscricoes ?? '-';
  } catch (err) {
    document.getElementById('dashboard-total-alunos').textContent = '-';
    document.getElementById('dashboard-total-eventos').textContent = '-';
    document.getElementById('dashboard-total-produtos').textContent = '-';
    document.getElementById('dashboard-total-inscricoes').textContent = '-';
  }
}
// Função para excluir usuário
async function excluirUsuario(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao excluir usuário');
    carregarUsuarios();
  } catch (err) {
    alert('Erro ao excluir usuário.');
  }
}

// Função para promover/demover admin
async function alternarAdmin(id, isAdminAtual) {
  const token = localStorage.getItem('token');
  const rota = isAdminAtual ? 'remove-admin' : 'admin';
  try {
    const res = await fetch(`http://localhost:5000/api/users/${id}/${rota}`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao atualizar admin');
    carregarUsuarios();
  } catch (err) {
    alert('Erro ao atualizar admin.');
  }
}

// Delegação de eventos para botões de ação
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('admin-excluir')) {
    const id = e.target.getAttribute('data-id');
    excluirUsuario(id);
  }
  if (e.target.classList.contains('admin-editar')) {
    alert('Função de edição em breve!');
  }
  if (e.target.classList.contains('admin-promover')) {
    const id = e.target.getAttribute('data-id');
    const isAdminAtual = e.target.getAttribute('data-admin') === 'true';
    alternarAdmin(id, isAdminAtual);
  }
});
// Listar usuários/alunos na tabela do admin
async function carregarUsuarios() {
  const tbody = document.getElementById('usuarios-tbody');
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao buscar usuários');
    const users = await res.json();
    if (!Array.isArray(users) || users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;opacity:0.7;">Nenhum usuário encontrado.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    users.forEach(user => {
      tbody.innerHTML += `
        <tr>
          <td>${user.nome}</td>
          <td class="email-col">${user.email}</td>
          <td>${user.cpf}</td>
          <td>${user.telefone}</td>
          <td>${user.isAdmin ? 'Sim' : 'Não'}</td>
          <td style="text-align:right;padding-right:32px;">
            <div class="admin-btns">
              <button class="admin-editar" data-id="${user._id}">Editar</button>
              <button class="admin-excluir" data-id="${user._id}">Excluir</button>
              <button class="admin-promover" data-id="${user._id}" data-admin="${user.isAdmin}">
                ${user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
              </button>
            </div>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#f44336;">Erro ao carregar usuários.</td></tr>';
  }
}

// Carregar usuários ao abrir a seção
document.addEventListener('DOMContentLoaded', function() {
  const usuariosLink = document.querySelector('.admin-link[data-section="usuarios"]');
  if (usuariosLink) {
    usuariosLink.addEventListener('click', carregarUsuarios);
  }
});
// Proteção de acesso ao painel admin e exibição do nome do usuário
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  const nome = localStorage.getItem('nome');
  if (!token || isAdmin !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  function exibirNomePainel() {
    const nomeSpan = document.getElementById('admin-nome-logado');
    if (nomeSpan && nome) nomeSpan.textContent = nome;
  }
  // Alterna as seções do painel admin conforme o menu
  const links = document.querySelectorAll('.admin-link');
  const sections = document.querySelectorAll('.admin-section');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      sections.forEach(sec => {
        if (sec.id === 'admin-' + section) {
          sec.style.display = '';
          if (section === 'dashboard') {
            carregarDashboard();
            exibirNomePainel();
          }
          if (section === 'usuarios') {
            carregarUsuarios();
            // Move painel para a direita se necessário
            const adminMain = document.querySelector('.admin-main');
            if (adminMain) {
              adminMain.scrollLeft = 200;
            }
          }
          if (section === 'presencas') {
            // Filtro mês
            const filtroMes = document.getElementById('filtroMes');
            let mesAtual = new Date();
            let mesStr = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth()+1).padStart(2,'0')}`;
            filtroMes.value = mesStr;
            carregarPresencasAdmin(mesStr);
            filtroMes.onchange = function() {
              carregarPresencasAdmin(this.value);
            };
          }
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });
  // Carregar dashboard ao abrir
  carregarDashboard();
  exibirNomePainel();
});
