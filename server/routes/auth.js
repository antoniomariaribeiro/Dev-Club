const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// Validações
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  
  body('phone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Telefone inválido')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Gerar JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, role = 'student' } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email já está em uso'
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === 'admin' ? 'admin' : 'student' // Apenas admins podem criar outros admins
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login do usuário
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    console.log('🔑 Tentativa de login iniciada:', {
      email: req.body.email,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erro de validação no login:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuário no banco de dados
    console.log('🔍 Procurando usuário:', email);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    console.log('✅ Usuário encontrado:', {
      id: user.id,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    });

    // Verificar se usuário está ativo
    if (!user.is_active) {
      console.log('❌ Usuário inativo:', user.id);
      return res.status(403).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o administrador.'
      });
    }

    // Verificar senha
    console.log('🔍 Validando senha...');
    const isMatch = await user.validatePassword(password);
    
    if (!isMatch) {
      console.log('❌ Senha incorreta para usuário:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    console.log('✅ Credenciais válidas, gerando token...');
    const token = generateToken(user.id);

    // Atualizar último login
    await user.update({ last_login: new Date() });

    console.log('✅ Login realizado com sucesso:', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário autenticado
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('👤 Obtendo dados do usuário autenticado:', {
      userId: req.user.id,
      email: req.user.email,
      timestamp: new Date().toISOString()
    });

    // Buscar dados atualizados do usuário
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      console.log('❌ Usuário não encontrado no banco:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.is_active) {
      console.log('❌ Usuário inativo:', req.user.id);
      return res.status(403).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    console.log('✅ Dados do usuário obtidos com sucesso:', {
      userId: user.id,
      role: user.role
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        birth_date: user.birth_date,
        address: user.address,
        emergency_contact: user.emergency_contact,
        emergency_phone: user.emergency_phone,
        created_at: user.created_at,
        last_login: user.last_login,
        is_active: user.is_active
      }
    });

  } catch (error) {
    console.error('❌ Erro ao obter dados do usuário:', {
      error: error.message,
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/update-profile', authMiddleware, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('phone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Telefone inválido'),
  
  body('birth_date')
    .optional()
    .isISO8601()
    .withMessage('Data de nascimento inválida')
], async (req, res) => {
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
      phone,
      birth_date,
      address,
      emergency_contact,
      emergency_phone
    } = req.body;

    await req.user.update({
      name: name || req.user.name,
      phone: phone || req.user.phone,
      birth_date: birth_date || req.user.birth_date,
      address: address || req.user.address,
      emergency_contact: emergency_contact || req.user.emergency_contact,
      emergency_phone: emergency_phone || req.user.emergency_phone
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        birth_date: req.user.birth_date,
        address: req.user.address,
        emergency_contact: req.user.emergency_contact,
        emergency_phone: req.user.emergency_phone
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;