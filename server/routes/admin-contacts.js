const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Contact } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Middleware para garantir que todas as rotas são protegidas e apenas para admins
router.use(authMiddleware);
router.use(adminMiddleware);

// Validações
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('phone').optional().trim(),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Idade inválida'),
  body('interest_type').isIn(['classes', 'events', 'workshops', 'performances', 'general']).withMessage('Tipo de interesse inválido'),
  body('experience_level').isIn(['none', 'beginner', 'intermediate', 'advanced']).withMessage('Nível de experiência inválido'),
  body('preferred_schedule').optional().trim(),
  body('status').isIn(['new', 'contacted', 'converted', 'not_interested']).withMessage('Status inválido'),
  body('source').optional().trim()
];

// @route   GET /api/admin/contacts
// @desc    Listar todos os contatos com filtros
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status, 
      interest_type, 
      experience_level,
      source,
      date_from, 
      date_to 
    } = req.query;
    
    const whereClause = {};
    
    // Filtros
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (interest_type) {
      whereClause.interest_type = interest_type;
    }
    
    if (experience_level) {
      whereClause.experience_level = experience_level;
    }
    
    if (source) {
      whereClause.source = { [Op.like]: `%${source}%` };
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
    
    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: []
      }
    });
    
    res.json({
      contacts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_contacts: count,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/contacts/stats
// @desc    Obter estatísticas dos contatos
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalContacts = await Contact.count();
    
    const statusStats = await Contact.findAll({
      attributes: [
        'status',
        [Contact.sequelize.fn('COUNT', Contact.sequelize.col('status')), 'count']
      ],
      group: ['status']
    });
    
    const interestStats = await Contact.findAll({
      attributes: [
        'interest_type',
        [Contact.sequelize.fn('COUNT', Contact.sequelize.col('interest_type')), 'count']
      ],
      group: ['interest_type']
    });
    
    const experienceStats = await Contact.findAll({
      attributes: [
        'experience_level',
        [Contact.sequelize.fn('COUNT', Contact.sequelize.col('experience_level')), 'count']
      ],
      group: ['experience_level']
    });
    
    const sourceStats = await Contact.findAll({
      attributes: [
        'source',
        [Contact.sequelize.fn('COUNT', Contact.sequelize.col('source')), 'count']
      ],
      group: ['source']
    });
    
    // Contatos dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentContacts = await Contact.count({
      where: {
        created_at: { [Op.gte]: thirtyDaysAgo }
      }
    });
    
    // Contatos por mês (últimos 12 meses)
    const monthlyContacts = await Contact.findAll({
      attributes: [
        [Contact.sequelize.fn('STRFTIME', '%Y-%m', Contact.sequelize.col('created_at')), 'month'],
        [Contact.sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      group: [Contact.sequelize.fn('STRFTIME', '%Y-%m', Contact.sequelize.col('created_at'))],
      order: [[Contact.sequelize.fn('STRFTIME', '%Y-%m', Contact.sequelize.col('created_at')), 'ASC']]
    });
    
    // Taxa de conversão
    const convertedContacts = await Contact.count({
      where: { status: 'converted' }
    });
    
    const conversionRate = totalContacts > 0 ? ((convertedContacts / totalContacts) * 100).toFixed(2) : 0;
    
    res.json({
      total_contacts: totalContacts,
      recent_contacts: recentContacts,
      conversion_rate: parseFloat(conversionRate),
      converted_contacts: convertedContacts,
      status_distribution: statusStats.reduce((acc, item) => {
        acc[item.status] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      interest_distribution: interestStats.reduce((acc, item) => {
        acc[item.interest_type] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      experience_distribution: experienceStats.reduce((acc, item) => {
        acc[item.experience_level] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      source_distribution: sourceStats.reduce((acc, item) => {
        acc[item.source || 'unknown'] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      monthly_contacts: monthlyContacts.map(item => ({
        month: item.dataValues.month,
        count: parseInt(item.dataValues.count)
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de contatos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/contacts/:id
// @desc    Obter detalhes de um contato específico
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/contacts
// @desc    Criar novo contato
// @access  Admin
router.post('/', contactValidation, async (req, res) => {
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
      email,
      phone,
      age,
      message,
      interest_type,
      experience_level,
      preferred_schedule,
      status = 'new',
      source
    } = req.body;

    // Verificar se já existe contato com o mesmo email
    const existingContact = await Contact.findOne({ where: { email } });
    if (existingContact) {
      return res.status(400).json({ 
        message: 'Já existe um contato com este email' 
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      age,
      message,
      interest_type,
      experience_level,
      preferred_schedule,
      status,
      source
    });

    res.status(201).json({
      message: 'Contato criado com sucesso',
      contact
    });
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/contacts/:id
// @desc    Atualizar contato
// @access  Admin
router.put('/:id', contactValidation, async (req, res) => {
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
      email,
      phone,
      age,
      message,
      interest_type,
      experience_level,
      preferred_schedule,
      status,
      source
    } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    // Verificar se o email já existe em outro contato
    if (email !== contact.email) {
      const existingContact = await Contact.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        }
      });
      if (existingContact) {
        return res.status(400).json({ 
          message: 'Já existe outro contato com este email' 
        });
      }
    }

    await contact.update({
      name,
      email,
      phone,
      age,
      message,
      interest_type,
      experience_level,
      preferred_schedule,
      status,
      source
    });

    res.json({
      message: 'Contato atualizado com sucesso',
      contact
    });
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Excluir contato
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }
    
    await contact.destroy();
    
    res.json({ message: 'Contato excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PATCH /api/admin/contacts/:id/status
// @desc    Atualizar apenas o status do contato
// @access  Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'contacted', 'converted', 'not_interested'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }
    
    await contact.update({ status });
    
    res.json({
      message: 'Status atualizado com sucesso',
      contact
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/contacts/bulk-update
// @desc    Atualização em lote de contatos
// @access  Admin
router.post('/bulk-update', async (req, res) => {
  try {
    const { contact_ids, updates } = req.body;
    
    if (!Array.isArray(contact_ids) || contact_ids.length === 0) {
      return res.status(400).json({ message: 'IDs dos contatos são obrigatórios' });
    }
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Dados para atualização são obrigatórios' });
    }
    
    const [updatedCount] = await Contact.update(updates, {
      where: {
        id: { [Op.in]: contact_ids }
      }
    });
    
    res.json({
      message: `${updatedCount} contato(s) atualizado(s) com sucesso`,
      updated_count: updatedCount
    });
  } catch (error) {
    console.error('Erro na atualização em lote:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/contacts/bulk-delete
// @desc    Exclusão em lote de contatos
// @access  Admin
router.post('/bulk-delete', async (req, res) => {
  try {
    const { contact_ids } = req.body;
    
    if (!Array.isArray(contact_ids) || contact_ids.length === 0) {
      return res.status(400).json({ message: 'IDs dos contatos são obrigatórios' });
    }
    
    const deletedCount = await Contact.destroy({
      where: {
        id: { [Op.in]: contact_ids }
      }
    });
    
    res.json({
      message: `${deletedCount} contato(s) excluído(s) com sucesso`,
      deleted_count: deletedCount
    });
  } catch (error) {
    console.error('Erro na exclusão em lote:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;