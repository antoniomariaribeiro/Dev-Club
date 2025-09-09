document.addEventListener('DOMContentLoaded', () => {
  // Exibir nome do admin logado ao lado da foto
  const nomeAdmin = localStorage.getItem('nome');
  const nomeSpan = document.getElementById('admin-nome-logado');
  if (nomeSpan && nomeAdmin) {
    nomeSpan.textContent = nomeAdmin;
  }
  // -------------------------
  // Produtos (Loja)
  // -------------------------
  const produtoForm = document.getElementById('produtoForm');
  const adminProdutos = document.getElementById('admin-produtos');

  async function carregarProdutos() {
    if (!adminProdutos) return;
    adminProdutos.innerHTML = '<div style="color:#fff;opacity:0.7;text-align:center;margin:32px 0;">Carregando produtos...</div>';
    try {
      const res = await fetch('http://localhost:5000/api/produtos');
      const produtos = await res.json();
      adminProdutos.innerHTML = produtos.length ? '' : '<div style="color:#fff;opacity:0.7;text-align:center;margin:32px 0;">Nenhum produto cadastrado ainda.</div>';
      produtos.forEach((prod) => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
          <img src="${prod.imagem}" alt="${prod.nome}">
          <div class="produto-conteudo">
            <h3>${prod.nome}</h3>
            <p>${prod.descricao}</p>
            <span class="preco">R$ ${Number(prod.preco).toFixed(2).replace('.', ',')}</span>
            <button class="remover-produto-btn" data-id="${prod._id}">Remover</button>
          </div>
        `;
        adminProdutos.appendChild(card);
      });
      // Remover produto
      adminProdutos.querySelectorAll('.remover-produto-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          const token = localStorage.getItem('token');
          if(!confirm('Tem certeza que deseja remover este produto?')) return;
          await fetch(`http://localhost:5000/api/produtos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
          });
          carregarProdutos();
        });
      });
    } catch {
      adminProdutos.innerHTML = '<div style="color:#f44336;">Erro ao carregar produtos.</div>';
    }
  }

  if(produtoForm){
    produtoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = produtoForm.produtoNome.value;
      const descricao = produtoForm.produtoDescricao.value;
      const preco = produtoForm.produtoPreco.value.replace('R$', '').replace(',', '.').trim();
      const imagemInput = produtoForm.produtoImagem;
      if(!imagemInput.files[0]){
        alert('Selecione uma imagem para o produto.');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const novoProduto = { nome, descricao, preco: Number(preco), imagem: reader.result };
        const token = localStorage.getItem('token');
        try {
          await fetch('http://localhost:5000/api/produtos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(novoProduto)
          });
          carregarProdutos();
          produtoForm.reset();
        } catch {
          alert('Erro ao cadastrar produto.');
        }
      };
      reader.readAsDataURL(imagemInput.files[0]);
    });
  }

  carregarProdutos();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAdminLogged = localStorage.getItem('isAdminLogged') === 'true';
  if(!isAdmin && !isAdminLogged) return window.location.href = 'login.html';

  // -------------------------
  // Alternar seções do painel
  // -------------------------
  const links = document.querySelectorAll('.admin-link');
  const sections = document.querySelectorAll('.admin-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.section;
      sections.forEach(sec => sec.style.display = sec.id === `admin-${target}` ? 'block' : 'none');
    });
  });

  // -------------------------
  // Eventos
  // -------------------------
  const eventoForm = document.getElementById('eventoForm');
  const eventosLista = document.getElementById('eventos-lista');

  function carregarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    if(!eventosLista) return;

    eventosLista.innerHTML = eventos.length ? '' : '<div style="color:#fff;opacity:0.7;text-align:center;margin:32px 0;">Nenhum evento cadastrado ainda.</div>';
    eventos.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'evento-card';
      card.innerHTML = `
        <img src="${ev.imagem}" alt="${ev.nome}">
        <div class="evento-conteudo">
          <h3>${ev.nome}</h3>
          <p class="evento-data-local">Data: ${ev.data} | Local: ${ev.local}</p>
          <p>${ev.descricao}</p>
        </div>
      `;
      eventosLista.appendChild(card);
    });
  }

  if(eventoForm){
    eventoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = eventoForm.nome.value;
      const data = eventoForm.data.value;
      const local = eventoForm.local.value;
      const descricao = eventoForm.descricao.value;
      const imagemInput = eventoForm.imagem;

      if(!imagemInput.files[0]){
        alert('Selecione uma imagem para o evento.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const novoEvento = { nome, data, local, descricao, imagem: reader.result };
        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos.push(novoEvento);
        localStorage.setItem('eventos', JSON.stringify(eventos));
        carregarEventos();
        eventoForm.reset();
      };
      reader.readAsDataURL(imagemInput.files[0]);
    });
  }

  carregarEventos();

  // -------------------------
  // Usuários/Alunos
  // -------------------------
  const usuariosTbody = document.getElementById('usuarios-tbody');
  const dashboardTotalAlunos = document.getElementById('dashboard-total-alunos');

  async function carregarUsuarios() {
    if (!usuariosTbody) return;
    usuariosTbody.innerHTML = '<tr><td colspan="6" style="text-align:center;opacity:0.7;">Carregando usuários...</td></tr>';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const usuarios = await res.json();
      if (Array.isArray(usuarios) && usuarios.length > 0) {
        usuariosTbody.innerHTML = '';
        usuarios.forEach(user => {
          usuariosTbody.innerHTML += `
            <tr>
              <td>${user.nome}</td>
              <td>${user.email}</td>
              <td>${user.cpf || '-'}</td>
              <td>${user.telefone || '-'}</td>
              <td>
                <select class="select-admin-status" data-id="${user._id}">
                  <option value="false" ${!user.isAdmin ? 'selected' : ''}>Aluno</option>
                  <option value="true" ${user.isAdmin ? 'selected' : ''}>Admin</option>
                </select>
              </td>
              <td><button class="btn-remover-usuario" data-id="${user._id}">Remover</button></td>
            </tr>
          `;
        });
        // Listener para alterar status admin/aluno
        usuariosTbody.querySelectorAll('.select-admin-status').forEach(select => {
          select.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const isAdmin = e.target.value === 'true';
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/users/${id}/admin`, {
              method: 'PATCH',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ isAdmin })
            });
            carregarUsuarios();
          });
        });
        // Listeners para remover usuário
        usuariosTbody.querySelectorAll('.btn-remover-usuario').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const token = localStorage.getItem('token');
            if(!confirm('Tem certeza que deseja remover este usuário?')) return;
            await fetch(`http://localhost:5000/api/users/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + token }
            });
            carregarUsuarios();
          });
        });
      } else {
        usuariosTbody.innerHTML = '<tr><td colspan="6" style="text-align:center;opacity:0.7;">Nenhum usuário cadastrado.</td></tr>';
      }
      if (dashboardTotalAlunos) dashboardTotalAlunos.textContent = usuarios.length;
    } catch {
      usuariosTbody.innerHTML = '<tr><td colspan="6" style="color:#f44336;text-align:center;">Erro ao carregar usuários.</td></tr>';
      if (dashboardTotalAlunos) dashboardTotalAlunos.textContent = '-';
    }
  }

  // Chamar ao abrir painel e ao alternar para seção de usuários
  carregarUsuarios();
  // Atualizar ao clicar na aba de usuários
  const linkUsuarios = document.querySelector('.admin-link[data-section="usuarios"]');
  if(linkUsuarios){
    linkUsuarios.addEventListener('click', carregarUsuarios);
  }

  // -------------------------
  // Perfil do admin
  // -------------------------
  const perfilSection = document.getElementById('admin-perfil');
  const perfilForm = document.getElementById('admin-perfil-form');
  const perfilFoto = document.getElementById('admin-perfil-foto');
  const perfilFotoInput = document.getElementById('admin-perfil-foto-input');
  if(perfilSection && perfilForm){
    // Carregar dados do localStorage
    perfilForm.nome.value = localStorage.getItem('nome') || '';
    perfilForm.email.value = localStorage.getItem('email') || '';
    perfilForm.cpf.value = localStorage.getItem('cpf') || '';
    perfilForm.telefone.value = localStorage.getItem('telefone') || '';
    if(localStorage.getItem('foto')){
      perfilFoto.src = localStorage.getItem('foto');
    }
    // Trocar foto
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
    // Salvar alterações
    perfilForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Atualiza localStorage
      localStorage.setItem('nome', perfilForm.nome.value);
      localStorage.setItem('email', perfilForm.email.value);
      localStorage.setItem('cpf', perfilForm.cpf.value);
      localStorage.setItem('telefone', perfilForm.telefone.value);
      if(perfilFoto.src){
        localStorage.setItem('foto', perfilFoto.src);
      }
      // Atualiza nome no topo
      const nomeSpan = document.getElementById('admin-nome-logado');
      if(nomeSpan) nomeSpan.textContent = perfilForm.nome.value;
      // Salva no backend
      try {
        const token = localStorage.getItem('token');
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
    });
  }

  // -------------------------
  // Logout Admin
  // -------------------------
  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isAdminLogged');
      localStorage.removeItem('nome');
      localStorage.removeItem('foto');
      window.location.href = 'login.html';
    });
  }
});