const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Middleware para garantir que todas as rotas são protegidas e apenas para admins
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET /api/admin/users
// @desc    Listar todos os usuários com filtros
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    
    const whereClause = {};
    
    // Filtros
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role) {
      whereClause.role = role;
    }
    
    if (status) {
      if (status === 'active') {
        whereClause.status = 'active';
        whereClause.is_active = true;
      } else if (status === 'inactive') {
        whereClause.status = 'inactive';
        whereClause.is_active = false;
      } else if (status === 'pending') {
        whereClause.status = 'pending';
      } else if (status === 'suspended') {
        whereClause.status = 'suspended';
      }
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      users,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_users: count,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/users
// @desc    Criar novo usuário
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const { name, email, password, phone, role, status } = req.body;
    
    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }
    
    const user = await User.create({
      name,
      email,
      password, // Será hashada pelo hook do modelo
      phone,
      role: role || 'student',
      status: status || 'pending',
      is_active: status === 'active'
    });
    
    // Não retornar a senha na resposta
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userResponse
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Atualizar usuário
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, is_active, status, phone, address } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    await user.update({
      name,
      email,
      role,
      is_active: status === 'active' ? true : is_active,
      status: status || user.status,
      phone,
      address
    });
    
    res.json({
      message: 'Usuário atualizado com sucesso',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Deletar usuário
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Não permitir deletar o próprio usuário
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Não é possível deletar seu próprio usuário' });
    }
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    await user.destroy();
    
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PATCH /api/admin/users/:id/status
// @desc    Alterar status do usuário
// @access  Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    await user.update({
      status: status,
      is_active: status === 'active'
    });
    
    const statusMessages = {
      active: 'ativado',
      inactive: 'desativado',
      pending: 'marcado como pendente',
      suspended: 'suspenso'
    };
    
    res.json({
      message: `Usuário ${statusMessages[status]} com sucesso`,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PATCH /api/admin/users/:id/toggle-status
// @desc    Alternar status ativo/inativo do usuário (mantido para compatibilidade)
// @access  Admin
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    await user.update({
      status: newStatus,
      is_active: newStatus === 'active'
    });
    
    res.json({
      message: `Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/users/bulk-status
// @desc    Alterar status de múltiplos usuários
// @access  Admin
router.post('/bulk-status', async (req, res) => {
  try {
    const { userIds, status } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Lista de usuários inválida' });
    }
    
    if (!['active', 'inactive', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const updatedCount = await User.update({
      status: status,
      is_active: status === 'active'
    }, {
      where: {
        id: userIds
      }
    });
    
    const statusMessages = {
      active: 'ativados',
      inactive: 'desativados',
      pending: 'marcados como pendentes',
      suspended: 'suspensos'
    };
    
    res.json({ 
      message: `${updatedCount[0]} usuário(s) ${statusMessages[status]} com sucesso`,
      updatedCount: updatedCount[0]
    });
  } catch (error) {
    console.error('Erro ao alterar status dos usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/admin/users/bulk-delete
// @desc    Deletar múltiplos usuários
// @access  Admin
router.post('/bulk-delete', async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Lista de usuários inválida' });
    }
    
    // Não permitir deletar o próprio usuário
    if (userIds.includes(req.user.id)) {
      return res.status(400).json({ message: 'Não é possível deletar seu próprio usuário' });
    }
    
    const deletedCount = await User.destroy({
      where: {
        id: userIds
      }
    });
    
    res.json({ 
      message: `${deletedCount} usuário(s) deletado(s) com sucesso`,
      deletedCount
    });
  } catch (error) {
    console.error('Erro ao deletar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/users/stats
// @desc    Estatísticas específicas dos usuários
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: 'active' } });
    const pendingUsers = await User.count({ where: { status: 'pending' } });
    const inactiveUsers = await User.count({ where: { status: 'inactive' } });
    const suspendedUsers = await User.count({ where: { status: 'suspended' } });
    
    const newUsersToday = await User.count({
      where: {
        created_at: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0)
        }
      }
    });
    
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['role']
    });
    
    const usersByStatus = await User.findAll({
      attributes: [
        'status',
        [User.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['status']
    });
    
    res.json({
      total: totalUsers,
      active: activeUsers,
      pending: pendingUsers,
      inactive: inactiveUsers,
      suspended: suspendedUsers,
      newToday: newUsersToday,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      byStatus: usersByStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.dataValues.count);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/users/suggestions
// @desc    Obter sugestões de busca
// @access  Admin
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    
    const searchTerm = query.trim().toLowerCase();
    
    const suggestions = [];
    
    // Buscar usuários por nome
    const usersByName = await User.findAll({
      where: {
        name: { [Op.like]: `%${searchTerm}%` }
      },
      attributes: ['name'],
      limit: 5,
      group: ['name'],
      raw: true
    });
    
    usersByName.forEach(user => {
      suggestions.push({
        id: `user-${user.name}`,
        text: user.name,
        type: 'user',
        count: 1
      });
    });
    
    // Buscar por domínios de email mais comuns
    const emailDomains = await User.findAll({
      where: {
        email: { [Op.like]: `%${searchTerm}%` }
      },
      attributes: ['email'],
      limit: 10,
      raw: true
    });
    
    const domains = new Map();
    emailDomains.forEach(user => {
      const domain = user.email.split('@')[1];
      if (domain && domain.toLowerCase().includes(searchTerm)) {
        domains.set(domain, (domains.get(domain) || 0) + 1);
      }
      
      // Também adicionar emails específicos se forem poucos
      if (user.email.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          id: `email-${user.email}`,
          text: user.email,
          type: 'email',
          count: 1
        });
      }
    });
    
    // Adicionar domínios populares
    domains.forEach((count, domain) => {
      suggestions.push({
        id: `domain-${domain}`,
        text: `@${domain}`,
        type: 'email',
        count
      });
    });
    
    // Buscar por telefones parciais
    if (/\d/.test(searchTerm)) {
      const phoneUsers = await User.findAll({
        where: {
          phone: { [Op.like]: `%${searchTerm}%` }
        },
        attributes: ['phone'],
        limit: 3,
        raw: true
      });
      
      phoneUsers.forEach(user => {
        if (user.phone) {
          suggestions.push({
            id: `phone-${user.phone}`,
            text: user.phone,
            type: 'phone',
            count: 1
          });
        }
      });
    }
    
    // Buscar por localidades no campo de endereço
    const locationUsers = await User.findAll({
      where: {
        address: { [Op.like]: `%${searchTerm}%` }
      },
      attributes: ['address'],
      limit: 5,
      raw: true
    });
    
    const locations = new Set();
    locationUsers.forEach(user => {
      if (user.address) {
        // Extrair possíveis nomes de cidades/bairros
        const parts = user.address.split(/[,\-\s]+/);
        parts.forEach(part => {
          if (part.length > 2 && part.toLowerCase().includes(searchTerm)) {
            locations.add(part.trim());
          }
        });
      }
    });
    
    locations.forEach(location => {
      suggestions.push({
        id: `location-${location}`,
        text: location,
        type: 'location',
        count: 1
      });
    });
    
    // Remover duplicatas e limitar resultados
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text.toLowerCase() === suggestion.text.toLowerCase())
      )
      .slice(0, 10);
    
    res.json(uniqueSuggestions);
    
  } catch (error) {
    console.error('Erro ao obter sugestões de busca:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/users/export
// @desc    Exportar usuários para CSV ou Excel
// @access  Admin
router.get('/export', async (req, res) => {
  try {
    const { format = 'csv', status, role } = req.query;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (role) {
      whereClause.role = role;
    }
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'phone', 'role', 'status', 'is_active', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    
    if (format === 'csv') {
      // Configurar headers para CSV
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=usuarios.csv');
      
      // Cabeçalho CSV
      let csv = 'ID,Nome,Email,Telefone,Função,Status,Ativo,Data de Criação\n';
      
      // Dados CSV
      users.forEach(user => {
        const row = [
          user.id,
          `"${user.name}"`,
          user.email,
          user.phone || '',
          user.role,
          user.status,
          user.is_active ? 'Sim' : 'Não',
          new Date(user.created_at).toLocaleDateString('pt-BR')
        ].join(',');
        
        csv += row + '\n';
      });
      
      res.send(csv);
    } else {
      // Para outros formatos, retornar JSON por enquanto
      res.json({
        message: 'Formato não suportado. Use format=csv',
        users: users
      });
    }
    
  } catch (error) {
    console.error('Erro ao exportar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;