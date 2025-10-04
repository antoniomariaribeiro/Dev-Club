const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User, Event, EventRegistration, Product, Gallery, Contact } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Middleware para garantir que todas as rotas são protegidas e apenas para admins
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET /api/admin/dashboard/stats
// @desc    Obter estatísticas gerais do dashboard
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    // Calcular estatísticas em paralelo
    const [
      totalUsers,
      totalEvents,
      totalProducts,
      totalContacts,
      newUsersThisMonth,
      activeEvents,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      User.count({ where: { role: { [Op.ne]: 'admin' } } }),
      Event.count(),
      Product.count(),
      Contact.count(),
      User.count({
        where: {
          role: { [Op.ne]: 'admin' },
          created_at: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      Event.count({ where: { status: 'active' } }),
      EventRegistration.sum('amount_paid') || 0,
      EventRegistration.sum('amount_paid', {
        where: {
          created_at: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }) || 0
    ]);

    const stats = {
      totalUsers,
      totalEvents,
      totalProducts,
      totalContacts,
      totalRevenue,
      monthlyRevenue,
      newUsersThisMonth,
      activeEvents
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/dashboard/charts/:type
// @desc    Obter dados para gráficos específicos
// @access  Admin
router.get('/charts/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { period = '30d' } = req.query;

    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    let chartData = {};

    switch (type) {
      case 'users':
        // Crescimento de usuários por mês
        const userGrowth = await User.findAll({
          attributes: [
            [User.sequelize.fn('DATE_TRUNC', 'month', User.sequelize.col('created_at')), 'month'],
            [User.sequelize.fn('COUNT', '*'), 'count']
          ],
          where: {
            created_at: { [Op.gte]: startDate },
            role: { [Op.ne]: 'admin' }
          },
          group: [User.sequelize.fn('DATE_TRUNC', 'month', User.sequelize.col('created_at'))],
          order: [[User.sequelize.fn('DATE_TRUNC', 'month', User.sequelize.col('created_at')), 'ASC']]
        });

        chartData = {
          labels: userGrowth.map(item => new Date(item.dataValues.month).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })),
          datasets: [{
            label: 'Novos Usuários',
            data: userGrowth.map(item => item.dataValues.count),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            fill: true
          }]
        };
        break;

      case 'events':
        // Performance de eventos
        const eventStats = await Event.findAll({
          include: [{
            model: EventRegistration,
            attributes: ['payment_status', 'amount_paid'],
            required: false
          }],
          where: {
            created_at: { [Op.gte]: startDate }
          }
        });

        const eventsByMonth = {};
        eventStats.forEach(event => {
          const month = new Date(event.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
          if (!eventsByMonth[month]) {
            eventsByMonth[month] = {
              total: 0,
              revenue: 0,
              registrations: 0
            };
          }
          eventsByMonth[month].total += 1;
          if (event.EventRegistrations) {
            event.EventRegistrations.forEach(reg => {
              if (reg.payment_status === 'paid') {
                eventsByMonth[month].revenue += parseFloat(reg.amount_paid || 0);
              }
              eventsByMonth[month].registrations += 1;
            });
          }
        });

        chartData = {
          labels: Object.keys(eventsByMonth),
          datasets: [
            {
              label: 'Eventos Criados',
              data: Object.values(eventsByMonth).map(item => item.total),
              backgroundColor: '#28a745',
              borderColor: '#28a745'
            },
            {
              label: 'Inscrições',
              data: Object.values(eventsByMonth).map(item => item.registrations),
              backgroundColor: '#ffc107',
              borderColor: '#ffc107'
            }
          ]
        };
        break;

      case 'revenue':
        // Receita por mês
        const revenueData = await EventRegistration.findAll({
          attributes: [
            [EventRegistration.sequelize.fn('DATE_TRUNC', 'month', EventRegistration.sequelize.col('created_at')), 'month'],
            [EventRegistration.sequelize.fn('SUM', EventRegistration.sequelize.col('amount_paid')), 'total']
          ],
          where: {
            created_at: { [Op.gte]: startDate },
            payment_status: 'paid'
          },
          group: [EventRegistration.sequelize.fn('DATE_TRUNC', 'month', EventRegistration.sequelize.col('created_at'))],
          order: [[EventRegistration.sequelize.fn('DATE_TRUNC', 'month', EventRegistration.sequelize.col('created_at')), 'ASC']]
        });

        chartData = {
          labels: revenueData.map(item => new Date(item.dataValues.month).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })),
          datasets: [{
            label: 'Receita (R$)',
            data: revenueData.map(item => parseFloat(item.dataValues.total || 0)),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: true
          }]
        };
        break;

      default:
        return res.status(400).json({ message: 'Tipo de gráfico inválido' });
    }

    res.json({ data: chartData });
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/dashboard/recent-activities
// @desc    Obter atividades recentes do sistema
// @access  Admin
router.get('/recent-activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Buscar atividades recentes de diferentes tipos
    const [recentUsers, recentEvents, recentRegistrations, recentContacts] = await Promise.all([
      User.findAll({
        where: { role: { [Op.ne]: 'admin' } },
        order: [['created_at', 'DESC']],
        limit: Math.ceil(limit / 4),
        attributes: ['id', 'name', 'email', 'created_at']
      }),
      Event.findAll({
        order: [['created_at', 'DESC']],
        limit: Math.ceil(limit / 4),
        attributes: ['id', 'title', 'date', 'created_at']
      }),
      EventRegistration.findAll({
        include: [
          { model: User, attributes: ['name'] },
          { model: Event, attributes: ['title'] }
        ],
        order: [['created_at', 'DESC']],
        limit: Math.ceil(limit / 4),
        attributes: ['id', 'status', 'created_at']
      }),
      Contact.findAll({
        order: [['created_at', 'DESC']],
        limit: Math.ceil(limit / 4),
        attributes: ['id', 'name', 'email', 'status', 'created_at']
      })
    ]);

    // Combinar e formatar as atividades
    const activities = [
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user',
        title: 'Novo usuário cadastrado',
        description: `${user.name} se cadastrou na plataforma`,
        timestamp: user.created_at,
        icon: '👤'
      })),
      ...recentEvents.map(event => ({
        id: `event-${event.id}`,
        type: 'event',
        title: 'Novo evento criado',
        description: `Evento "${event.title}" foi criado`,
        timestamp: event.created_at,
        icon: '📅'
      })),
      ...recentRegistrations.map(reg => ({
        id: `registration-${reg.id}`,
        type: 'registration',
        title: 'Nova inscrição',
        description: `${reg.User?.name} se inscreveu em "${reg.Event?.title}"`,
        timestamp: reg.created_at,
        icon: '✅'
      })),
      ...recentContacts.map(contact => ({
        id: `contact-${contact.id}`,
        type: 'contact',
        title: 'Novo contato',
        description: `${contact.name} enviou uma mensagem`,
        timestamp: contact.created_at,
        icon: '💬'
      }))
    ];

    // Ordenar por timestamp e limitar
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, limit);

    res.json({ activities: limitedActivities });
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;