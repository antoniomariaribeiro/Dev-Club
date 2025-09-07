document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nome = document.getElementById('cadastroNome').value;
  const email = document.getElementById('cadastroEmail').value;
  const cpf = document.getElementById('cadastroCPF').value;
  const telefone = document.getElementById('cadastroTelefone').value;
  const senha = document.getElementById('cadastroSenha').value;
  const msg = document.getElementById('cadastroMsg');
  msg.textContent = '';
  try {
    const res = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome, email, cpf, telefone, senha })
    });
    const data = await res.json();
    if (res.ok) {
      msg.style.color = 'green';
      msg.textContent = 'Cadastro realizado com sucesso!';
      setTimeout(() => window.location.href = 'login.html', 1000);
    } else {
      msg.style.color = 'red';
      msg.textContent = data.error || 'Erro ao cadastrar.';
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Erro de conexão.';
  }
});
