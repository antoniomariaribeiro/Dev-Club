import express from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

const router = express.Router();

// Dashboard de estatísticas gerais (apenas admin)
router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const totalProdutos = await Product.countDocuments();
    const totalEventos = await Event.countDocuments();
    const totalInscricoes = await Registration.countDocuments();
    res.json({ totalUsuarios, totalProdutos, totalEventos, totalInscricoes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
