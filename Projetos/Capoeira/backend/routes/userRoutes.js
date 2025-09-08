import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Cadastro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, cpf, telefone, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, cpf, telefone, senha: hashedSenha });
    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });
  const token = jwt.sign({ id: user._id, nome: user.nome, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // Retorna token, isAdmin e nome diretamente, compatível com o frontend
  res.json({ token, isAdmin: user.isAdmin, nome: user.nome });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

// Rotas administrativas (apenas admin)
// Listar todos os usuários
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tornar usuário admin
router.patch('/:id/admin', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true }).select('-senha');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remover admin de usuário
router.patch('/:id/remove-admin', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: false }, { new: true }).select('-senha');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar usuário
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
