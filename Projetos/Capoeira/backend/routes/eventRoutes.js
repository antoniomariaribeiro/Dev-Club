import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Criar evento
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar evento
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar evento
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ message: 'Evento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
