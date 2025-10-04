const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Contact } = require('../models');
const nodemailer = require('nodemailer');

// Configurar transporter do nodemailer (exemplo com Gmail)
const createTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return null;
};

// Validações para formulário de contato
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('phone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Telefone inválido'),
  
  body('age')
    .optional()
    .isInt({ min: 3, max: 120 })
    .withMessage('Idade deve ser entre 3 e 120 anos'),
  
  body('interest_type')
    .isIn(['classes', 'events', 'workshops', 'performances', 'general'])
    .withMessage('Tipo de interesse inválido'),
  
  body('experience_level')
    .isIn(['none', 'beginner', 'intermediate', 'advanced'])
    .withMessage('Nível de experiência inválido'),
  
  body('preferred_schedule')
    .isIn(['morning', 'afternoon', 'evening', 'weekend', 'flexible'])
    .withMessage('Horário preferido inválido')
];

// @route   POST /api/contacts
// @desc    Enviar formulário de contato/inscrição
// @access  Public
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
      preferred_schedule
    } = req.body;

    // Criar registro no banco
    const contact = await Contact.create({
      name,
      email,
      phone,
      age,
      message,
      interest_type,
      experience_level,
      preferred_schedule,
      source: 'website'
    });

    // Tentar enviar email de notificação (opcional)
    const transporter = createTransporter();
    if (transporter) {
      try {
        const interestTypes = {
          classes: 'Aulas regulares',
          events: 'Eventos especiais',
          workshops: 'Workshops',
          performances: 'Apresentações',
          general: 'Informações gerais'
        };

        const experienceLevels = {
          none: 'Nenhuma experiência',
          beginner: 'Iniciante',
          intermediate: 'Intermediário',
          advanced: 'Avançado'
        };

        const schedules = {
          morning: 'Manhã',
          afternoon: 'Tarde',
          evening: 'Noite',
          weekend: 'Fim de semana',
          flexible: 'Flexível'
        };

        const emailBody = `
          <h2>Nova mensagem de contato - Capoeira Pro</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
          <p><strong>Idade:</strong> ${age || 'Não informada'}</p>
          <p><strong>Interesse:</strong> ${interestTypes[interest_type]}</p>
          <p><strong>Experiência:</strong> ${experienceLevels[experience_level]}</p>
          <p><strong>Horário preferido:</strong> ${schedules[preferred_schedule]}</p>
          ${message ? `<p><strong>Mensagem:</strong><br>${message}</p>` : ''}
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Enviar para o próprio email da academia
          subject: `Nova inscrição de interesse - ${name}`,
          html: emailBody
        });

        // Email de confirmação para o interessado
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Obrigado pelo seu interesse - Capoeira Pro',
          html: `
            <h2>Olá, ${name}!</h2>
            <p>Obrigado pelo seu interesse em nossos serviços de capoeira!</p>
            <p>Recebemos suas informações e entraremos em contato em breve.</p>
            <p>Enquanto isso, siga-nos nas redes sociais para ficar por dentro de nossas novidades.</p>
            <p>Axé!</p>
            <p><strong>Equipe Capoeira Pro</strong></p>
          `
        });

      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Não falhar a requisição por erro de email
      }
    }

    res.status(201).json({
      message: 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.',
      contact: {
        id: contact.id,
        name: contact.name,
        interest_type: contact.interest_type
      }
    });

  } catch (error) {
    console.error('Erro ao processar contato:', error);
    res.status(500).json({
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// @route   GET /api/contacts/info
// @desc    Obter informações de contato da academia
// @access  Public
router.get('/info', (req, res) => {
  res.json({
    academy: {
      name: 'Capoeira Pro',
      address: 'Rua da Capoeira, 123 - Bairro Cultural',
      city: 'Sua Cidade - Estado',
      cep: '12345-678',
      phone: '(11) 99999-9999',
      email: 'contato@capoeirapro.com',
      whatsapp: '5511999999999',
      
      // Horários de funcionamento
      hours: {
        monday: '06:00 - 22:00',
        tuesday: '06:00 - 22:00',
        wednesday: '06:00 - 22:00',
        thursday: '06:00 - 22:00',
        friday: '06:00 - 22:00',
        saturday: '08:00 - 18:00',
        sunday: '08:00 - 16:00'
      },
      
      // Coordenadas para o mapa
      coordinates: {
        lat: -23.5505,  // Exemplo: São Paulo
        lng: -46.6333
      },
      
      // Redes sociais
      social: {
        instagram: 'https://instagram.com/capoeirapro',
        facebook: 'https://facebook.com/capoeirapro',
        youtube: 'https://youtube.com/capoeirapro',
        tiktok: 'https://tiktok.com/@capoeirapro'
      },
      
      // Informações sobre as aulas
      classes: {
        kids: {
          age: '4-12 anos',
          times: ['Segunda 16:00', 'Quarta 16:00', 'Sábado 09:00']
        },
        teens: {
          age: '13-17 anos',
          times: ['Terça 17:00', 'Quinta 17:00', 'Sábado 10:00']
        },
        adults: {
          age: '18+ anos',
          times: ['Segunda 19:00', 'Quarta 19:00', 'Sexta 19:00', 'Sábado 11:00']
        }
      }
    }
  });
});

module.exports = router;