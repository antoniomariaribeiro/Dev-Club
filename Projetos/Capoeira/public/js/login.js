console.log('login.js carregado');

const loginForm = document.getElementById('loginForm');
const forgotPass = document.getElementById("forgotPass");
const recoverForm = document.getElementById("recoverForm");
const msg = document.getElementById("loginMsg");
const adminLoginBtn = document.getElementById('adminLoginBtn');

// -------------------------
// Login Aluno via Backend
// -------------------------
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;
  msg.textContent = '';

  try {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    console.log('Resposta backend:', data);

    if(res.ok){
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
      localStorage.setItem('nome', data.nome || '');
      localStorage.setItem('foto', data.foto || '');

      msg.style.color = 'green';
      msg.textContent = 'Login realizado com sucesso!';

      setTimeout(() => {
        if(data.isAdmin) window.location.href = 'admin.html';
        else window.location.href = 'area-aluno.html';
      }, 1000);
    } else {
      msg.style.color = 'red';
      msg.textContent = data.error || 'Erro ao fazer login.';
    }
  } catch(err){
    msg.style.color = 'red';
    msg.textContent = 'Erro de conexão com o backend.';
  }
});

// -------------------------
// Login Admin (simulado)
// -------------------------
adminLoginBtn?.addEventListener('click', () => {
  const senha = prompt('Digite a senha de admin:');
  if(senha === 'admin123'){
    localStorage.setItem('isAdminLogged', 'true');
    window.location.href = 'admin.html';
  } else {
    alert('Senha incorreta!');
  }
});

// -------------------------
// Recuperação de senha
// -------------------------
if(forgotPass && recoverForm){
  forgotPass.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    recoverForm.classList.remove("hidden");
    msg.textContent = '';
  });

  recoverForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("recoverEmail").value;

    try {
      const res = await fetch('http://localhost:5000/api/users/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      msg.style.color = 'yellow';
      msg.textContent = data.message || 'Se o e-mail existir, enviaremos instruções para redefinir a senha.';

      setTimeout(() => {
        recoverForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        msg.textContent = '';
      }, 4000);
    } catch (err) {
      msg.style.color = 'red';
      msg.textContent = 'Erro de conexão ao tentar recuperar a senha.';
    }
  });
}