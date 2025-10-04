const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Middleware para garantir que todas as rotas são protegidas e apenas para admins
router.use(authMiddleware);
router.use(adminMiddleware);

// Validações
const productValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
  body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Preço inválido'),
  body('category').trim().notEmpty().withMessage('Categoria é obrigatória'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Quantidade em estoque deve ser um número positivo')
];

// @route   GET /api/admin/products
// @desc    Listar todos os produtos
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, stock_status } = req.query;
    
    const whereClause = {};
    
    // Filtros
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (status) {
      whereClause.is_active = status === 'active';
    }
    
    if (stock_status) {
      if (stock_status === 'out_of_stock') {
        whereClause.stock_quantity = 0;
      } else if (stock_status === 'low_stock') {
        whereClause.stock_quantity = { [Op.between]: [1, 10] };
      } else if (stock_status === 'in_stock') {
        whereClause.stock_quantity = { [Op.gt]: 10 };
      }
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      products,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_products: count,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/products
// @desc    Criar novo produto
// @access  Admin
router.post('/', productValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock_quantity,
      sku,
      images,
      specifications,
      weight,
      dimensions,
      is_active = true
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock_quantity,
      sku,
      images: JSON.stringify(images || []),
      specifications,
      weight,
      dimensions,
      is_active
    });

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Atualizar produto
// @access  Admin
router.put('/:id', productValidation, async (req, res) => {
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
      name,
      description,
      price,
      category,
      stock_quantity,
      sku,
      images,
      specifications,
      weight,
      dimensions,
      is_active
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.update({
      name,
      description,
      price,
      category,
      stock_quantity,
      sku,
      images: JSON.stringify(images || []),
      specifications,
      weight,
      dimensions,
      is_active
    });

    res.json({
      message: 'Produto atualizado com sucesso',
      product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Deletar produto
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/products/categories
// @desc    Listar categorias de produtos
// @access  Admin
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
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

// @route   GET /api/admin/products/stats
// @desc    Obter estatísticas de produtos
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { is_active: true } });
    const inactiveProducts = await Product.count({ where: { is_active: false } });
    const outOfStock = await Product.count({ where: { stock_quantity: 0 } });
    const lowStock = await Product.count({ 
      where: { 
        stock_quantity: { [Op.between]: [1, 10] } 
      } 
    });
    
    // Produtos por categoria
    const productsByCategory = await Product.findAll({
      attributes: [
        'category',
        [Product.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['category'],
      raw: true
    });
    
    // Valor total do estoque
    const totalStockValue = await Product.findAll({
      attributes: [
        [Product.sequelize.fn('SUM', 
          Product.sequelize.literal('price * stock_quantity')
        ), 'total_value']
      ],
      raw: true
    });
    
    res.json({
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        out_of_stock: outOfStock,
        low_stock: lowStock
      },
      categories: productsByCategory,
      stock_value: totalStockValue[0].total_value || 0
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/products/:id/stock
// @desc    Atualizar estoque do produto
// @access  Admin
router.put('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'add' | 'subtract' | 'set'
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    let newQuantity;
    
    switch (operation) {
      case 'add':
        newQuantity = product.stock_quantity + parseInt(quantity);
        break;
      case 'subtract':
        newQuantity = product.stock_quantity - parseInt(quantity);
        if (newQuantity < 0) newQuantity = 0;
        break;
      case 'set':
        newQuantity = parseInt(quantity);
        break;
      default:
        return res.status(400).json({ message: 'Operação inválida' });
    }
    
    await product.update({ stock_quantity: newQuantity });
    
    res.json({
      message: 'Estoque atualizado com sucesso',
      product,
      previous_quantity: product.stock_quantity,
      new_quantity: newQuantity
    });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;