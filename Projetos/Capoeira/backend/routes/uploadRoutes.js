import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload de imagem (apenas admin)
router.post('/', auth, isAdmin, upload.single('imagem'), (req, res) => {
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;
