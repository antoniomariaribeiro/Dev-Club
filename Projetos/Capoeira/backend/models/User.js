import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
  senha: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
