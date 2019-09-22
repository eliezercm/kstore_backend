import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'É necessário fazer a autenticação!' });
  }

  const [, token] = authHeader.split(' ');

  req.token = token;

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
