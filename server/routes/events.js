const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Event, EventRegistration, User } = require('../models');
const { authMiddleware, adminMiddleware, optionalAuth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// @route   GET /api/events
// @desc    Listar eventos
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit deve estar entre 1 e 50'),
  query('status').optional().isIn(['draft', 'published', 'cancelled', 'finished']),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all']),
  query('featured').optional().isBoolean()
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Parâmetros inválidos',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      status = 'published',
      level,
      featured,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (!req.user || req.user.role !== 'admin') {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    }

    if (level && level !== 'all') {
      where.level = level;
    }

    if (featured === 'true') {
      where.is_featured = true;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: events } = await Event.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['is_featured', 'DESC'],
        ['event_date', 'ASC']
      ],
      include: req.user ? [{
        model: EventRegistration,
        as: 'registrations',
        attributes: ['id', 'status', 'user_id'],
        required: false
      }] : []
    });

    // Adicionar informações de inscrição para usuário logado
    const eventsWithRegistration = events.map(event => {
      const eventData = event.toJSON();
      
      if (req.user) {
        eventData.userRegistration = eventData.registrations?.find(
          reg => reg.user_id === req.user.id
        ) || null;
        eventData.totalRegistrations = eventData.registrations?.length || 0;
      }
      
      delete eventData.registrations;
      return eventData;
    });

    res.json({
      events: eventsWithRegistration,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Obter evento por ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [{
        model: EventRegistration,
        as: 'registrations',
        attributes: ['id', 'status', 'user_id', 'created_at'],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      }]
    });

    if (!event) {
      return res.status(404).json({
        message: 'Evento não encontrado'
      });
    }

    // Verificar se pode visualizar (admins podem ver todos)
    if (event.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        message: 'Evento não encontrado'
      });
    }

    const eventData = event.toJSON();

    // Informações de inscrição para usuário logado
    if (req.user) {
      eventData.userRegistration = eventData.registrations?.find(
        reg => reg.user_id === req.user.id
      ) || null;
    }

    // Para não-admins, não mostrar detalhes dos inscritos
    if (!req.user || req.user.role !== 'admin') {
      eventData.totalRegistrations = eventData.registrations?.length || 0;
      delete eventData.registrations;
    }

    res.json({ event: eventData });

  } catch (error) {
    console.error('Erro ao obter evento:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/events
// @desc    Criar novo evento (Admin only)
// @access  Private (Admin)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), handleMulterError, [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Título deve ter entre 3 e 200 caracteres'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Descrição é obrigatória'),
  
  body('event_date')
    .isISO8601()
    .withMessage('Data do evento inválida'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Local é obrigatório'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      image: req.file ? `/uploads/events/${req.file.filename}` : null
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      message: 'Evento criado com sucesso',
      event
    });

  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/events/:id/register
// @desc    Inscrever-se em evento
// @access  Private
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, emergency_contact, emergency_phone } = req.body;

    const event = await Event.findByPk(id);
    if (!event || event.status !== 'published') {
      return res.status(404).json({
        message: 'Evento não encontrado ou não disponível'
      });
    }

    // Verificar prazo de inscrição
    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return res.status(400).json({
        message: 'Prazo de inscrição expirado'
      });
    }

    // Verificar se já está inscrito
    const existingRegistration = await EventRegistration.findOne({
      where: {
        user_id: req.user.id,
        event_id: id
      }
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: 'Você já está inscrito neste evento'
      });
    }

    // Verificar limite de participantes
    if (event.max_participants) {
      const registrationCount = await EventRegistration.count({
        where: {
          event_id: id,
          status: { [Op.in]: ['pending', 'confirmed'] }
        }
      });

      if (registrationCount >= event.max_participants) {
        return res.status(400).json({
          message: 'Evento lotado'
        });
      }
    }

    const registration = await EventRegistration.create({
      user_id: req.user.id,
      event_id: id,
      notes,
      emergency_contact,
      emergency_phone,
      payment_status: event.price > 0 ? 'pending' : 'free'
    });

    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      registration
    });

  } catch (error) {
    console.error('Erro ao inscrever em evento:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Cancelar inscrição em evento
// @access  Private
router.delete('/:id/register', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await EventRegistration.findOne({
      where: {
        user_id: req.user.id,
        event_id: id
      }
    });

    if (!registration) {
      return res.status(404).json({
        message: 'Inscrição não encontrada'
      });
    }

    await registration.update({ status: 'cancelled' });

    res.json({
      message: 'Inscrição cancelada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;