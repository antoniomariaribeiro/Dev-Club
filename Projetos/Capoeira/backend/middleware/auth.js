import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido.' });
  }
}

export function isAdmin(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Acesso restrito para administradores.' });
  next();
}
