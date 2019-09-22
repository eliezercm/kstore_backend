import * as Yup from 'yup';

import Category from '../models/Category';

class CategoryController {
  async store(req, res) {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    const categoryExists = await Category.find({ name });

    if (categoryExists) {
      return res.status(401).json({ error: 'Esta categoria já existe!' });
    }

    const category = await Category.create({
      name,
    });

    return res.json({ category });
  }
}

export default new CategoryController();
