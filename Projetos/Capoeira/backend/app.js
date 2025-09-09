import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';


import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { auth, isAdmin } from './middleware/auth.js';

dotenv.config();

const app = express();

// CORS para múltiplos domínios
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'http://localhost:5501'
];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rotas de usuário
app.use('/api/users', userRoutes);
// Rotas de produtos
app.use('/api/produtos', productRoutes);

// Servir arquivos estáticos do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'public')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
                console.log('MongoDB conectado');
                const port = process.env.PORT || 5000;
                app.listen(port, () => console.log(`Server rodando na porta ${port}`));
        })
        .catch(err => console.error('Erro ao conectar no MongoDB:', err));