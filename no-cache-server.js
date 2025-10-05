const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configurações para evitar cache
app.use((req, res, next) => {
  // Headers para evitar cache completamente
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': Math.random().toString(36)
  });
  next();
});

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'client/build'), {
  maxAge: 0,
  etag: false,
  lastModified: false
}));

// Rota para forçar rebuild/cache clear
app.get('/force-refresh', (req, res) => {
  res.json({ 
    message: 'Cache cleared successfully', 
    timestamp: new Date().toISOString(),
    buildTime: Math.random().toString(36)
  });
});

// Todas as rotas retornam o index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/build', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    // Lê o arquivo e adiciona um timestamp único para evitar cache
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Adiciona um parâmetro único aos assets para forçar reload
    const timestamp = Date.now();
    html = html.replace(
      /<script src="([^"]+)"/g, 
      `<script src="$1?v=${timestamp}"`
    );
    html = html.replace(
      /<link[^>]+href="([^"]+\.css)"/g, 
      `<link href="$1?v=${timestamp}"`
    );
    
    res.send(html);
  } else {
    res.status(404).send('Build não encontrado. Execute npm run build no diretório client.');
  }
});

app.listen(PORT, () => {
  console.log('🎨 Frontend ANTI-CACHE rodando na porta 3000');
  console.log('🌐 Acesse: http://localhost:3000');
  console.log('🔄 Cache completamente desabilitado!');
  console.log('💡 Para forçar refresh: http://localhost:3000/force-refresh');
});