// Alterna campos do formulário entre imagem e vídeo
document.addEventListener('DOMContentLoaded', function() {
  const tipoRadios = document.getElementsByName('tipo');
  const inputImagem = document.getElementById('input-imagem');
  const inputVideo = document.getElementById('input-video');
  if (tipoRadios && inputImagem && inputVideo) {
    tipoRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'imagem') {
          inputImagem.style.display = '';
          inputVideo.style.display = 'none';
        } else {
          inputImagem.style.display = 'none';
          inputVideo.style.display = '';
        }
      });
    });
  }
});
// galeria.js
// Exibe o formulário de upload só para admin e carrega imagens da galeria

document.addEventListener('DOMContentLoaded', function() {
  // Simulação: controle de admin (troque para true para testar como admin)
  const isAdmin = false;
  const formGaleria = document.getElementById('form-galeria');
  if (isAdmin) {
    formGaleria.style.display = 'block';
  } else {
    formGaleria.style.display = 'none';
  }

  // Galeria inicial: apenas blocos de legenda, sem imagens

  const imagens = [
    { src: '', legenda: 'Fotos do treino' },
    { src: '', legenda: 'Fotos de eventos' },
    { src: '', legenda: 'Grupo Nacional' },
    { src: '', legenda: 'Vídeos' }
  ];

  const galeriaGrid = document.getElementById('galeria-grid');
  imagens.forEach(img => {
    const div = document.createElement('div');
    div.className = 'galeria-item';
    if (img.legenda === 'Vídeos') {
      // Espaço para vídeos do YouTube (exemplo de embed)
      div.innerHTML = `
        <p class="galeria-legenda">${img.legenda}</p>
        <div class="galeria-videos">
          <!-- Admin pode adicionar iframes de vídeos aqui futuramente -->
          <p style="color:#fff;opacity:0.7;font-size:0.98em;">Nenhum vídeo adicionado ainda.</p>
        </div>
      `;
    } else {
      div.innerHTML = `
        <p class="galeria-legenda">${img.legenda}</p>
      `;
    }
    galeriaGrid.appendChild(div);
  });
});
