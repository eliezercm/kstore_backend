import * as Yup from 'yup';
import mongoose from 'mongoose';

import Product from '../models/Product';

class ProductController {
  async index(req, res) {
    const products = await Product.find();

    return res.json({ products });
  }

  async store(req, res) {
    const {
      name,
      reference,
      internal_code,
      price,
      phone,
      size,
      colorCode,
      category,
      description,
    } = req.body;

    if (
      !name |
      !reference |
      !internal_code |
      !price |
      !phone |
      !size |
      !colorCode |
      !category |
      !description
    )
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.sendStatus(400).json({ error: 'Essa categoria não existe!' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      reference: Yup.string()
        .email()
        .required(),
      internal_code: Yup.string().required(),
      price: Yup.number().required(),
      phone: Yup.string().required(),
      size: Yup.string()
        .oneOf(['PP', 'P', 'M', 'G', 'GG'])
        .required(),
      colorCode: Yup.string().required(),
      category: Yup.string().required(),
      description: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Houve um erro de validação!' });
    }

    return res.json();
  }
}

export default new ProductController();
