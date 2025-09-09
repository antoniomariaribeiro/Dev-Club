// ============================
// ELEMENTOS DO ADMIN
// ============================
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const formEventoSection = document.getElementById("form-evento");
const eventoForm = document.getElementById("eventoForm");
const eventosLista = document.getElementById("eventos-lista");

// ============================
// VERIFICA LOGIN ADMIN
// ============================
function checkAdmin() {
  const isAdminLogged = JSON.parse(localStorage.getItem("isAdminLogged")) || false;
  if (isAdminLogged) {
    if(formEventoSection) formEventoSection.style.display = "block";
    if(logoutBtn) logoutBtn.style.display = "block";
    if(loginBtn) loginBtn.style.display = "none";
  } else {
    if(formEventoSection) formEventoSection.style.display = "none";
    if(logoutBtn) logoutBtn.style.display = "none";
    if(loginBtn) loginBtn.style.display = "inline-block";
  }
}

// ============================
// LOGIN / LOGOUT ADMIN
// ============================
if(loginBtn){
  loginBtn.addEventListener("click", () => {
    const senha = prompt("Digite a senha de admin:");
    if (senha === "admin123") {
      localStorage.setItem("isAdminLogged", true);
      checkAdmin();
    } else {
      alert("Senha incorreta!");
    }
  });
}

if(logoutBtn){
  logoutBtn.addEventListener("click", () => {
    localStorage.setItem("isAdminLogged", false);
    checkAdmin();
  });
}

// ============================
// CARREGAR EVENTOS
// ============================
function carregarEventos() {
  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  // Se estiver na página do admin
  if(eventosLista){
    eventosLista.innerHTML = "";
    if(eventos.length === 0){
      eventosLista.innerHTML = `<div style="color:#fff;opacity:0.7;text-align:center;margin:32px 0;">
        Nenhum evento cadastrado ainda.
      </div>`;
    } else {
      eventos.forEach(evento => {
        const card = document.createElement("div");
        card.classList.add("evento-card");
        card.innerHTML = `
          <img src="${evento.imagem}" alt="${evento.nome}">
          <div class="evento-conteudo">
            <h3>${evento.nome}</h3>
            <p class="evento-data-local">Data: ${evento.data} | Local: ${evento.local}</p>
            <p>${evento.descricao}</p>
          </div>
        `;
        eventosLista.appendChild(card);
      });
    }
  }

  // Se estiver na página pública
  const eventosListaPublico = document.getElementById("eventos-lista-publico");
  if(eventosListaPublico){
    eventosListaPublico.innerHTML = "";
    if(eventos.length === 0){
      eventosListaPublico.innerHTML = `<div style="opacity:0.7;text-align:center;margin:32px 0;">Nenhum evento cadastrado ainda.</div>`;
    } else {
      eventos.forEach(evento => {
        const card = document.createElement("div");
        card.classList.add("evento-card");
        card.innerHTML = `
          <img src="${evento.imagem}" alt="${evento.nome}">
          <div class="evento-conteudo">
            <h3>${evento.nome}</h3>
            <p class="evento-data-local">Data: ${evento.data} | Local: ${evento.local}</p>
            <p>${evento.descricao}</p>
          </div>
        `;
        eventosListaPublico.appendChild(card);
      });
    }
  }
}

// ============================
// CADASTRO DE EVENTO (ADMIN)
// ============================
if(eventoForm){
  eventoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = eventoForm.nome.value;
    const data = eventoForm.data.value;
    const local = eventoForm.local.value;
    const descricao = eventoForm.descricao.value;
    const imagemInput = eventoForm.imagem;

    if (!imagemInput.files || !imagemInput.files[0]) {
      alert("Selecione uma imagem para o evento.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const imagemBase64 = reader.result;
      const novoEvento = { nome, data, local, descricao, imagem: imagemBase64 };

      const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
      eventos.push(novoEvento);
      localStorage.setItem("eventos", JSON.stringify(eventos));

      eventoForm.reset();
      carregarEventos(); // Atualiza tanto admin quanto público
    };
    reader.readAsDataURL(imagemInput.files[0]);
  });
}

// ============================
// INICIALIZAÇÃO
// ============================
checkAdmin();
carregarEventos();