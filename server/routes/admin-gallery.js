const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Gallery } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Middleware para garantir que todas as rotas são protegidas e apenas para admins
router.use(authMiddleware);
router.use(adminMiddleware);

// Validações
const galleryValidation = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório'),
  body('description').optional().trim(),
  body('image_url').isURL().withMessage('URL da imagem inválida'),
  body('category').trim().notEmpty().withMessage('Categoria é obrigatória')
];

// @route   GET /api/admin/gallery
// @desc    Listar todas as imagens da galeria
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, date_from, date_to } = req.query;
    
    const whereClause = {};
    
    // Filtros
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (date_from && date_to) {
      whereClause.created_at = {
        [Op.between]: [new Date(date_from), new Date(date_to)]
      };
    } else if (date_from) {
      whereClause.created_at = { [Op.gte]: new Date(date_from) };
    } else if (date_to) {
      whereClause.created_at = { [Op.lte]: new Date(date_to) };
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: images } = await Gallery.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      images,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_images: count,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar galeria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/gallery
// @desc    Adicionar nova imagem à galeria
// @access  Admin
router.post('/', galleryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      image_url,
      category,
      event_date,
      photographer,
      tags
    } = req.body;

    const image = await Gallery.create({
      title,
      description,
      image_url,
      category,
      event_date,
      photographer,
      tags: tags ? JSON.stringify(tags) : null
    });

    res.status(201).json({
      message: 'Imagem adicionada com sucesso',
      image
    });
  } catch (error) {
    console.error('Erro ao adicionar imagem:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/gallery/:id
// @desc    Atualizar imagem da galeria
// @access  Admin
router.put('/:id', galleryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      category,
      event_date,
      photographer,
      tags
    } = req.body;

    const image = await Gallery.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    await image.update({
      title,
      description,
      image_url,
      category,
      event_date,
      photographer,
      tags: tags ? JSON.stringify(tags) : null
    });

    res.json({
      message: 'Imagem atualizada com sucesso',
      image
    });
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/admin/gallery/:id
// @desc    Deletar imagem da galeria
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    await image.destroy();

    res.json({ message: 'Imagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/gallery/categories
// @desc    Listar categorias da galeria
// @access  Admin
router.get('/categories', async (req, res) => {
  try {
    const categories = await Gallery.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });
    
    const categoryList = categories.map(c => c.category).filter(Boolean);
    
    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/gallery/stats
// @desc    Obter estatísticas da galeria
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    // Total de imagens
    const total = await Gallery.count();
    
    // Imagens ativas
    const active = await Gallery.count({
      where: { status: 'active' }
    });
    
    // Imagens inativas
    const inactive = await Gallery.count({
      where: { status: 'inactive' }
    });
    
    // Imagens destacadas
    const featured = await Gallery.count({
      where: { is_featured: true }
    });
    
    res.json({
      total,
      active,
      inactive,
      featured
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/gallery/batch-upload
// @desc    Upload em lote de imagens
// @access  Admin
router.post('/batch-upload', async (req, res) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Lista de imagens é obrigatória' });
    }
    
    // Validar cada imagem
    const validatedImages = [];
    for (const image of images) {
      if (!image.title || !image.image_url || !image.category) {
        return res.status(400).json({ 
          message: 'Título, URL da imagem e categoria são obrigatórios para cada imagem' 
        });
      }
      
      validatedImages.push({
        title: image.title,
        description: image.description || '',
        image_url: image.image_url,
        category: image.category,
        event_date: image.event_date || null,
        photographer: image.photographer || null,
        tags: image.tags ? JSON.stringify(image.tags) : null
      });
    }
    
    const createdImages = await Gallery.bulkCreate(validatedImages);
    
    res.status(201).json({
      message: `${createdImages.length} imagens adicionadas com sucesso`,
      images: createdImages
    });
  } catch (error) {
    console.error('Erro no upload em lote:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/gallery/batch-update-category
// @desc    Atualizar categoria de múltiplas imagens
// @access  Admin
router.put('/batch-update-category', async (req, res) => {
  try {
    const { image_ids, new_category } = req.body;
    
    if (!image_ids || !Array.isArray(image_ids) || !new_category) {
      return res.status(400).json({ 
        message: 'IDs das imagens e nova categoria são obrigatórios' 
      });
    }
    
    const [updatedCount] = await Gallery.update(
      { category: new_category },
      {
        where: {
          id: { [Op.in]: image_ids }
        }
      }
    );
    
    res.json({
      message: `${updatedCount} imagens atualizadas com sucesso`,
      updated_count: updatedCount
    });
  } catch (error) {
    console.error('Erro na atualização em lote:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;