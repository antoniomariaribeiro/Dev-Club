console.log('login.js carregado');


document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = '';
  try {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
  const data = await res.json();
  console.log('Resposta do backend:', data);
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
      // Salva o nome do usuário diretamente da resposta do backend
      if (data.nome) {
        localStorage.setItem('nome', data.nome);
      } else {
        localStorage.removeItem('nome');
      }
      msg.style.color = 'green';
      msg.textContent = 'Login realizado com sucesso!';
      setTimeout(() => {
        if (data.isAdmin) {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'area-aluno.html';
        }
      }, 1000);
    } else {
      msg.style.color = 'red';
      msg.textContent = data.error || 'Erro ao fazer login.';
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Erro de conexão.';
  }
});
