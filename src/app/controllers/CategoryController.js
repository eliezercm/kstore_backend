import * as Yup from 'yup';

import Category from '../models/Category';

class CategoryController {
  async index(req, res) {
    const categories = await Category.find();

    return res.json({ categories });
  }

  async store(req, res) {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    const categoryExists = await Category.findOne({ name });

    if (!!categoryExists) {
      return res.status(406).json({ error: 'Esta categoria já existe!' });
    }

    const category = await Category.create({
      name,
    });

    return res.json({ category });
  }
}

export default new CategoryController();
