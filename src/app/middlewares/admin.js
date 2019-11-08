import User from '../models/User';

export const isAdmin = async (req, res, next) => {

  try {
    const user = await User.findById(req.userId);

    let isAdmin = false;

    if(user.role === 'Admin') {
      isAdmin = true;
    };

    req.isAdmin = isAdmin;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }
};

export const adminOnly = async (req, res, next) => {

  try {
    const user = await User.findById(req.userId);

    if(user.role !== 'Admin') {
      return res.status(400).json({ error: 'Reservado á administradores.' });
    };

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Usuário não encontrado.' });
  }
};

export default { isAdmin, adminOnly };