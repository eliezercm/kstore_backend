import jwt from 'jsonwebtoken';
import User from '../models/User';

import config from '../../config';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    if (!email | !password)
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'O e-mail informado não pertence à nenhum usuário' });
    }

    if (!(await user.comparePassword(String(password)))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    user.password = undefined;

    return res.json({ user, token });
  }
}

export default new SessionController();
