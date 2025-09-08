// Script para criar um usuário admin no MongoDB
// Rode: node backend/scripts/createAdmin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capoeira';

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);

  const senha = 'Mestretoninho'; // Altere para a senha desejada
  const senhaHash = await bcrypt.hash(senha, 10);

  const admin = new User({
    nome: 'Mestre Toninho',
    email: 'toninhodacapoeira@gmail.com',
    cpf: '12261737807',
    telefone: '15991080218',
    senha: senhaHash,
    isAdmin: true
  });

  await admin.save();
  console.log('Usuário admin criado com sucesso!');
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error('Erro ao criar admin:', err);
  mongoose.disconnect();
});
