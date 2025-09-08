import express from 'express';
import Presenca from '../models/Presenca.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Registrar presença do aluno (POST /api/presencas)
router.post('/', auth, async (req, res) => {
  try {
    const { data, hora, mes } = req.body;
    const nome = req.user.nome;
    const user = req.user.id;
    const presenca = new Presenca({ user, nome, data, hora, mes });
    await presenca.save();
    res.status(201).json({ message: 'Presença registrada!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar presenças do aluno logado (GET /api/presencas/minhas)
router.get('/minhas', auth, async (req, res) => {
  try {
    const user = req.user.id;
    const lista = await Presenca.find({ user }).sort({ data: -1, hora: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar presenças de todos os alunos (admin) (GET /api/presencas)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const lista = await Presenca.find().sort({ data: -1, hora: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
