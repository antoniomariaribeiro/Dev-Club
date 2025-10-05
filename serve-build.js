const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'client/build')));

// Para todas as rotas, servir o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Frontend rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});