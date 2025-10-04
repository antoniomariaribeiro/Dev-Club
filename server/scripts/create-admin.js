const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function createAdmin() {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco de dados');

    // Sincronizar modelos
    await sequelize.sync();
    console.log('📊 Modelos sincronizados');

    // Verificar se admin já existe
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@admin.com' } 
    });

    if (existingAdmin) {
      console.log('⚠️  Usuário admin já existe');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Nome: ${existingAdmin.name}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      return;
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Criar usuário admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      phone: '(15) 99108-0218',
      is_active: true,
      address: 'R. Dr. Américo Figueiredo, 1939 - Wanel Ville, Sorocaba - SP',
      emergency_contact: 'Academia Capoeira Nacional',
      emergency_phone: '(15) 98812-6428'
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@admin.com');
    console.log('🔐 Senha: admin123');
    console.log(`🆔 ID: ${admin.id}`);
    console.log(`👤 Nome: ${admin.name}`);
    console.log(`🔑 Role: ${admin.role}`);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão fechada');
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;