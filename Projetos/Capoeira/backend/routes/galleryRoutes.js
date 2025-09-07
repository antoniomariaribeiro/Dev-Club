import express from 'express';
import Gallery from '../models/Gallery.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Criar galeria (apenas admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).json(gallery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar galerias
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find().populate('evento');
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar galeria por ID
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).populate('evento');
    if (!gallery) return res.status(404).json({ error: 'Galeria não encontrada' });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar galeria (apenas admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gallery) return res.status(404).json({ error: 'Galeria não encontrada' });
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar galeria (apenas admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Galeria não encontrada' });
    res.json({ message: 'Galeria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
