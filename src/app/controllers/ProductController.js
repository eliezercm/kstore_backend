import * as Yup from 'yup';
import mongoose from 'mongoose';

import Product from '../models/Product';
import Category from '../models/Category';

class ProductController {
  async search(req, res) {
    const { ids } = req.body;

    if (!ids) {
      return res.status(400).json({ error: 'Especifique os produtos' });
    }

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Formato inválido!' });
    }

    try {
      const products = await Product.find()
        .where('_id')
        .in(ids);

      return res.json({ products });
    } catch (err) {
      return res.status(400).json({ error: 'Formato inválido!' });
    }
  }

  async index(req, res) {
    const products = await Product.find();

    return res.json({ products });
  }

  async store(req, res) {
    // if promoPrice is null send as 0

    const {
      name,
      reference,
      internalCode,
      price,
      promoPrice,
      size,
      colorCode,
      category,
      description,
    } = req.body;

    if (
      !name |
      !reference |
      !internalCode |
      !price |
      !size |
      !colorCode |
      !category |
      !description
    )
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: 'Insira uma categoria válida.' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      reference: Yup.string().required(),
      internalCode: Yup.string().required(),
      price: Yup.number().required(),
      promoPrice: Yup.number(),
      size: Yup.array().of(Yup.string().oneOf(['PP', 'P', 'M', 'G', 'GG'])),
      colorCode: Yup.string().required(),
      category: Yup.string().required(),
      description: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Houve um erro de validação!' });
    }

    const categoryFromDb = await Category.findById(category);

    if (!categoryFromDb)
      return res.status(400).json({ error: 'Esta categoria não existe!' });

    const product = await Product.create({
      name,
      reference,
      internalCode,
      price,
      promoPrice: promoPrice ? promoPrice : 0,
      size,
      colorCode,
      category,
      description,
    });

    return res.json({ product });
  }
}

export default new ProductController();
