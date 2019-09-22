import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required,
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      phone: Yup.number().required(),
      roleDesired: Yup.string()
        .oneOf(['Cliente', 'Revendedora'])
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, email, password, phone, roleDesired } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(401)
        .json({ error: 'Já existe um usuário com este email!' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      roleDesired,
    });

    user.password = undefined;

    return res.json({ user });
  }
}

export default new UserController();
