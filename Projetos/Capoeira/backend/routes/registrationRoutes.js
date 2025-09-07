import express from 'express';
import Registration from '../models/Registration.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Inscrever usuário em evento (usuário autenticado)
router.post('/', auth, async (req, res) => {
  try {
    const { evento } = req.body;
    const registration = new Registration({ usuario: req.user.id, evento });
    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar inscrições de um usuário (autenticado)
router.get('/me', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ usuario: req.user.id }).populate('evento');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas inscrições (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Acesso restrito para administradores.' });
    const registrations = await Registration.find().populate('usuario evento');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
