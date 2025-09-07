// contato.js
// Exemplo de envio de formulário de contato (frontend)

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formContato');
  const contatoMsg = document.getElementById('contatoMsg');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    contatoMsg.textContent = 'Enviando...';
    contatoMsg.style.color = '#fff';

    // Coleta os dados do formulário
    const data = {
      nome: form.nome.value,
      email: form.email.value,
      mensagem: form.mensagem.value
    };

    // Envio para o backend (ajuste a rota depois)
    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        contatoMsg.textContent = 'Mensagem enviada com sucesso!';
        contatoMsg.style.color = '#4caf50';
        form.reset();
      } else {
        contatoMsg.textContent = 'Erro ao enviar mensagem. Tente novamente.';
        contatoMsg.style.color = '#f44336';
      }
    } catch (err) {
      contatoMsg.textContent = 'Erro de conexão. Tente novamente.';
      contatoMsg.style.color = '#f44336';
    }
  });
});
