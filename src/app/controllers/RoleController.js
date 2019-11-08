import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async show(req, res) {
    const { id } = req.params;

    const user = await User.findById(id);

    return res.json({ role: user.role });
  }
}

export default new UserController();
