const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Gallery } = require('../models');
const { authMiddleware: auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/gallery - Listar fotos da galeria
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category,
      status = 'active'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    if (category) where.category = category;

    const photos = await Gallery.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      photos: photos.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: photos.count,
        pages: Math.ceil(photos.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar fotos da galeria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/gallery/:id - Obter foto específica
router.get('/:id', async (req, res) => {
  try {
    const photo = await Gallery.findByPk(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Foto não encontrada' });
    }

    res.json(photo);
  } catch (error) {
    console.error('Erro ao obter foto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /api/gallery - Upload de nova foto (apenas admin)
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma foto foi enviada' });
    }

    const photoData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'geral',
      image_url: `/uploads/gallery/${req.file.filename}`,
      photographer: req.body.photographer,
      created_by: req.user.id
    };

    const photo = await Gallery.create(photoData);
    res.status(201).json(photo);
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: error.errors.map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /api/gallery/:id - Atualizar foto (apenas admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const photo = await Gallery.findByPk(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Foto não encontrada' });
    }

    await photo.update(req.body);
    res.json(photo);
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /api/gallery/:id - Remover foto (apenas admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const photo = await Gallery.findByPk(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Foto não encontrada' });
    }

    await photo.destroy();
    res.json({ message: 'Foto removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover foto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;