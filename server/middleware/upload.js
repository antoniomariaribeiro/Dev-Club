const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar diretórios de upload se não existirem
const uploadDir = 'uploads';
const subdirs = ['users', 'events', 'products', 'gallery'];

subdirs.forEach(subdir => {
  const dirPath = path.join(uploadDir, subdir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDir;
    
    // Determinar subdiretório baseado na rota
    if (req.route.path.includes('users') || req.route.path.includes('profile')) {
      uploadPath = path.join(uploadDir, 'users');
    } else if (req.route.path.includes('events')) {
      uploadPath = path.join(uploadDir, 'events');
    } else if (req.route.path.includes('products')) {
      uploadPath = path.join(uploadDir, 'products');
    } else if (req.route.path.includes('gallery')) {
      uploadPath = path.join(uploadDir, 'gallery');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// Filtro para tipos de arquivo
const fileFilter = (req, file, cb) => {
  // Tipos permitidos
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use apenas: JPEG, PNG, WebP ou GIF'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB padrão
    files: 10 // máximo 10 arquivos
  },
  fileFilter: fileFilter
});

// Middleware para tratar erros do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          message: 'Arquivo muito grande. Tamanho máximo: 5MB'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          message: 'Muitos arquivos. Máximo: 10 arquivos'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          message: 'Campo de arquivo inesperado'
        });
      default:
        return res.status(400).json({
          message: 'Erro no upload: ' + err.message
        });
    }
  } else if (err) {
    return res.status(400).json({
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError
};