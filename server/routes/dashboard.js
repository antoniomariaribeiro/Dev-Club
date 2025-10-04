const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { User, Event, EventRegistration, Contact, Product } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Obter estatísticas do dashboard (Admin only)
// @access  Private (Admin)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Contar usuários ativos
    const totalUsers = await User.count({
      where: { is_active: true }
    });

    const totalStudents = await User.count({
      where: { 
        is_active: true,
        role: 'student'
      }
    });

    const totalAdmins = await User.count({
      where: { 
        is_active: true,
        role: 'admin'
      }
    });

    // Contar eventos
    const totalEvents = await Event.count();
    const publishedEvents = await Event.count({
      where: { status: 'published' }
    });
    const upcomingEvents = await Event.count({
      where: {
        status: 'published',
        event_date: {
          [Op.gte]: new Date()
        }
      }
    });

    // Contar produtos
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({
      where: { status: 'active' }
    });

    // Contar inscrições em eventos
    const totalRegistrations = await EventRegistration.count();
    const confirmedRegistrations = await EventRegistration.count({
      where: { status: 'confirmed' }
    });

    // Contar contatos/leads
    const totalContacts = await Contact.count();
    const newContacts = await Contact.count({
      where: { status: 'new' }
    });

    // Contatos dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentContacts = await Contact.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Inscrições por mês (últimos 12 meses)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const registrationsByMonth = await EventRegistration.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: twelveMonthsAgo
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'ASC']],
      raw: true
    });

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        admins: totalAdmins
      },
      events: {
        total: totalEvents,
        published: publishedEvents,
        upcoming: upcomingEvents
      },
      products: {
        total: totalProducts,
        active: activeProducts
      },
      registrations: {
        total: totalRegistrations,
        confirmed: confirmedRegistrations
      },
      contacts: {
        total: totalContacts,
        new: newContacts,
        recent: recentContacts
      },
      charts: {
        registrationsByMonth
      }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Obter atividades recentes (Admin only)
// @access  Private (Admin)
router.get('/recent-activity', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Últimos usuários cadastrados
    const recentUsers = await User.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'created_at']
    });

    // Últimas inscrições em eventos
    const recentRegistrations = await EventRegistration.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: Event,
          as: 'event',
          attributes: ['title', 'event_date']
        }
      ]
    });

    // Últimos contatos
    const recentContacts = await Contact.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'interest_type', 'status', 'created_at']
    });

    res.json({
      recentUsers,
      recentRegistrations,
      recentContacts
    });

  } catch (error) {
    console.error('Erro ao obter atividades recentes:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/dashboard/contacts
// @desc    Listar contatos com filtros (Admin only)
// @access  Private (Admin)
router.get('/contacts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      interest_type,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (interest_type) {
      where.interest_type = interest_type;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'contactedByUser',
          attributes: ['name'],
          required: false
        }
      ]
    });

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   PUT /api/dashboard/contacts/:id
// @desc    Atualizar status do contato (Admin only)
// @access  Private (Admin)
router.put('/contacts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Contato não encontrado'
      });
    }

    const updateData = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (status === 'contacted' && !contact.contacted_at) {
      updateData.contacted_at = new Date();
      updateData.contacted_by = req.user.id;
    }

    await contact.update(updateData);

    res.json({
      message: 'Contato atualizado com sucesso',
      contact
    });

  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;