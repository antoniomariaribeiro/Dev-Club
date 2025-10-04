const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function resetAdmin() {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco de dados');

    // Sincronizar modelos
    await sequelize.sync();
    console.log('📊 Modelos sincronizados');

    // Deletar admin existente
    await User.destroy({ 
      where: { email: 'admin@admin.com' } 
    });
    console.log('🗑️  Admin anterior removido');

    // Criar novo admin (o hash será feito automaticamente pelo hook do modelo)
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123', // Senha sem hash - o modelo fará o hash automaticamente
      phone: '(11) 99999-9999',
      role: 'admin',
      is_active: true
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Senha: admin123`);
    console.log(`👤 Nome: ${admin.name}`);
    console.log(`🔑 Role: ${admin.role}`);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão fechada');
  }
}

resetAdmin();