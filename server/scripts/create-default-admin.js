/**
 * ========================================
 * 🔧 SCRIPT DE INICIALIZAÇÃO DO ADMIN
 * ========================================
 * 
 * Este script garante que existe um usuário
 * administrador padrão no sistema.
 * 
 * Credenciais padrão:
 * Email: admin@admin.com
 * Senha: admin123
 * 
 * ========================================
 */

const { User } = require('../models');

const createDefaultAdmin = async () => {
  try {
    console.log('🔧 Verificando usuário admin padrão...');

    // Verificar se já existe admin
    const existingAdmin = await User.findOne({
      where: {
        email: 'admin@admin.com'
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Usuário admin já existe - verificando senha...');
      
      // Testar se a senha está correta
      const bcrypt = require('bcryptjs');
      const isPasswordCorrect = await bcrypt.compare('admin123', existingAdmin.password);
      
      if (!isPasswordCorrect) {
        console.log('🔧 Senha incorreta detectada, recriando admin...');
        await existingAdmin.destroy();
        console.log('🗑️  Admin antigo removido');
      } else {
        console.log('✅ Admin existente com senha correta:', {
          id: existingAdmin.id,
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role,
          is_active: existingAdmin.is_active
        });

        // Garantir que está ativo
        if (!existingAdmin.is_active) {
          await existingAdmin.update({ is_active: true });
          console.log('✅ Admin reativado');
        }

        return existingAdmin;
      }
    }

    // Criar novo admin
    console.log('🔨 Criando usuário admin padrão...');
    
    // Não fazer hash manual - o hook beforeCreate do modelo fará isso
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123', // Senha em texto simples - será hasheada pelo hook
      role: 'admin',
      is_active: true,
      phone: '(11) 99999-9999',
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log('✅ Usuário admin criado com sucesso:', {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    console.log('🔑 Credenciais do admin:');
    console.log('   Email: admin@admin.com');
    console.log('   Senha: admin123');

    return admin;

  } catch (error) {
    console.error('❌ Erro ao criar admin padrão:', error);
    throw error;
  }
};

module.exports = { createDefaultAdmin };