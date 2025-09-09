import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendMail } from '../utils/miler.js';

const CLIENT_URL = process.env.CLIENT_URL;

export async function requestPasswordReset(req, res) {
    const genericMsg = 'Se o e-mail existir, enviaremos instruções para redefinição.';
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: 'E-mail inválido.' });

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: genericMsg });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();

        const resetLink = `${CLIENT_URL}/reset-password.html?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Redefinição de Senha - Capoeira Nacional',
            html: `
        <h2>Redefinição de Senha</h2>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Este link expira em 1 hora: <a href="${resetLink}">Redefinir Senha</a></p>
        <p>Link: ${resetLink}</p>
      `
        });

        return res.json({ message: genericMsg });
    } catch (err) {
        console.error('Erro em requestPasswordReset:', err);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};

export async function resetPassword(req, res) {
    try {
        const { token, novaSenha } = req.body;
        if (!token || !novaSenha) return res.status(400).json({ error: 'Dados inválidos.' });

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ error: 'Token inválido ou expirado.' });

        const hash = await bcrypt.hash(novaSenha, 10);
        user.senha = hash;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (err) {
        console.error('Erro em resetPassword:', err);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};