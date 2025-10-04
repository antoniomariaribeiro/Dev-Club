#!/usr/bin/env node

const { sequelize } = require('../config/database');
const { setupAssociations, User } = require('../models');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('🔧 Configurando associações dos modelos...');
    setupAssociations();

    console.log('🔌 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');

    console.log('📊 Sincronizando modelos...');
    await sequelize.sync({ force: true }); // CUIDADO: force: true apaga todas as tabelas
    console.log('✅ Modelos sincronizados');

    console.log('👤 Criando usuário administrador padrão...');
    const adminExists = await User.findOne({ where: { email: 'admin@academiacapoeiranacional.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Mestre Administrador',
        email: 'admin@academiacapoeiranacional.com',
        password: 'admin123', // Será hasheada automaticamente
        role: 'admin',
        phone: '(11) 99999-9999'
      });
      console.log('✅ Usuário admin criado: admin@academiacapoeiranacional.com / admin123');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

    console.log('👨‍🎓 Criando usuário aluno de exemplo...');
    const studentExists = await User.findOne({ where: { email: 'aluno@academiacapoeiranacional.com' } });
    
    if (!studentExists) {
      await User.create({
        name: 'João Silva',
        email: 'aluno@academiacapoeiranacional.com',
        password: 'aluno123',
        role: 'student',
        phone: '(11) 88888-8888'
      });
      console.log('✅ Usuário aluno criado: aluno@academiacapoeiranacional.com / aluno123');
    } else {
      console.log('ℹ️  Usuário aluno já existe');
    }

    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📝 Credenciais de acesso:');
    console.log('👑 Admin: admin@academiacapoeiranacional.com / admin123');
    console.log('👨‍🎓 Aluno: aluno@academiacapoeiranacional.com / aluno123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;