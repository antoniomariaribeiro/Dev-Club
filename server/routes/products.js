const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../models');
const { authMiddleware: auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/products - Listar produtos
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status = 'active',
      featured,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    if (category) where.category = category;
    if (featured !== undefined) where.is_featured = featured === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['is_featured', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      products: products.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.count,
        pages: Math.ceil(products.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/products/:id - Obter produto específico
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /api/products - Criar produto (apenas admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: error.errors.map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /api/products/:id - Atualizar produto (apenas admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /api/products/:id - Remover produto (apenas admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /api/products/:id/images - Upload de imagens do produto
router.post('/:id/images', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    const currentImages = product.images || [];
    const updatedImages = [...currentImages, ...imageUrls];

    await product.update({ images: updatedImages });
    res.json({ 
      message: 'Imagens adicionadas com sucesso',
      images: updatedImages
    });
  } catch (error) {
    console.error('Erro ao fazer upload das imagens:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;