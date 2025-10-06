const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Event, EventRegistration, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const path = require('path');

// Middleware para garantir que todas as rotas são protegidas e apenas para admins
router.use(authMiddleware);
router.use(adminMiddleware);

// Validações
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório'),
  body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
  body('event_date').isISO8601().withMessage('Data inválida'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido (formato: HH:MM)'),
  body('location').trim().notEmpty().withMessage('Local é obrigatório'),
  body('max_participants').isInt({ min: 1 }).withMessage('Número máximo de participantes deve ser maior que 0'),
  body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Preço inválido')
];

// @route   GET /api/admin/events
// @desc    Listar todos os eventos
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, date_from, date_to } = req.query;
    
    const whereClause = {};
    
    // Filtros
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (date_from && date_to) {
      whereClause.event_date = {
        [Op.between]: [date_from, date_to]
      };
    } else if (date_from) {
      whereClause.event_date = { [Op.gte]: date_from };
    } else if (date_to) {
      whereClause.event_date = { [Op.lte]: date_to };
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['event_date', 'ASC']],
      include: [
        {
          model: EventRegistration,
          as: 'registrations',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });
    
    // Calcular estatísticas para cada evento
    const eventsWithStats = events.map(event => {
      const eventData = event.toJSON();
      eventData.registrations_count = eventData.registrations.length;
      eventData.confirmed_count = eventData.registrations.filter(r => r.status === 'confirmed').length;
      eventData.pending_count = eventData.registrations.filter(r => r.status === 'pending').length;
      eventData.available_spots = eventData.max_participants - eventData.confirmed_count;
      
      return eventData;
    });
    
    res.json({
      events: eventsWithStats,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_events: count,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/events
// @desc    Criar novo evento
// @access  Admin
router.post('/', upload.single('image'), handleMulterError, eventValidation, async (req, res) => {
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
      event_date,
      end_date,
      location,
      max_participants,
      price,
      requirements,
      what_to_bring,
      instructor,
      level
    } = req.body;

    // Processar imagem se foi enviada
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      event_date,
      end_date,
      location,
      max_participants: parseInt(max_participants),
      price: parseFloat(price),
      image: imageUrl,
      requirements,
      what_to_bring,
      instructor,
      level,
      status: 'published'
    });

    res.status(201).json({
      message: 'Evento criado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/events/:id
// @desc    Atualizar evento
// @access  Admin
router.put('/:id', upload.single('image'), handleMulterError, eventValidation, async (req, res) => {
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
      event_date,
      end_date,
      location,
      max_participants,
      price,
      requirements,
      what_to_bring,
      instructor,
      level,
      status
    } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Processar imagem se foi enviada
    let imageUrl = event.image; // manter imagem atual se nenhuma nova for enviada
    if (req.file) {
      imageUrl = `/uploads/events/${req.file.filename}`;
    }

    await event.update({
      title,
      description,
      event_date,
      end_date,
      location,
      max_participants: parseInt(max_participants),
      price: parseFloat(price),
      image: imageUrl,
      requirements,
      what_to_bring,
      instructor,
      level,
      status
    });

    res.json({
      message: 'Evento atualizado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/admin/events/:id
// @desc    Deletar evento
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id, {
      include: [{ model: EventRegistration, as: 'registrations' }]
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verificar se há inscrições confirmadas
    const confirmedRegistrations = event.registrations.filter(r => r.status === 'confirmed');
    if (confirmedRegistrations.length > 0) {
      return res.status(400).json({ 
        message: 'Não é possível deletar evento com inscrições confirmadas. Cancele o evento primeiro.' 
      });
    }

    await event.destroy();

    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/events/:id/registrations
// @desc    Listar inscrições de um evento
// @access  Admin
router.get('/:id/registrations', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    
    const whereClause = { event_id: id };
    if (status) {
      whereClause.status = status;
    }
    
    const registrations = await EventRegistration.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({ registrations });
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/events/:eventId/registrations/:registrationId
// @desc    Atualizar status de inscrição
// @access  Admin
router.put('/:eventId/registrations/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status, payment_status, notes } = req.body;
    
    const registration = await EventRegistration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
    
    await registration.update({
      status,
      payment_status,
      notes,
      confirmation_date: status === 'confirmed' ? new Date() : null
    });
    
    res.json({
      message: 'Inscrição atualizada com sucesso',
      registration
    });
  } catch (error) {
    console.error('Erro ao atualizar inscrição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/events/stats
// @desc    Obter estatísticas de eventos
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalEvents = await Event.count();
    const activeEvents = await Event.count({ where: { status: 'active' } });
    const cancelledEvents = await Event.count({ where: { status: 'cancelled' } });
    const completedEvents = await Event.count({ where: { status: 'completed' } });
    
    const totalRegistrations = await EventRegistration.count();
    const confirmedRegistrations = await EventRegistration.count({ where: { status: 'confirmed' } });
    const pendingRegistrations = await EventRegistration.count({ where: { status: 'pending' } });
    
    res.json({
      events: {
        total: totalEvents,
        active: activeEvents,
        cancelled: cancelledEvents,
        completed: completedEvents
      },
      registrations: {
        total: totalRegistrations,
        confirmed: confirmedRegistrations,
        pending: pendingRegistrations,
        cancelled: totalRegistrations - confirmedRegistrations - pendingRegistrations
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;