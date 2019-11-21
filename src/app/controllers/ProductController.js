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
    const { category } = req.query;
    if(category) {
      const products = await Product.find().where({ category })
      .select(['-__v'])
      .populate({ path: 'category', select: '-_id -__v' });

      return res.json({ products });
    }

    const products = await Product.find()
      .select(['-__v'])
      .populate({ path: 'category', select: '-_id -__v' });

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
      image,
    } = req.body;

    if (
      !name |
      !reference |
      !internalCode |
      !price |
      !size |
      !colorCode |
      !category |
      !description |
      !image
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
      image: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      if(err.message) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: 'Houve um erro de validação!' });
    }

    const categoryFromDb = await Category.findById(category);

    if (!categoryFromDb)
      return res.status(400).json({ error: 'Esta categoria não existe!' });

    try {
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
        image,
      });

      return res.json({ product });
    } catch (err) {
      if(err.code && err.code === 11000) {
        return res.status(400).json({ error: 'Código interno ou de referência duplicado. Verifique e tente novamente.'})
      }
      return res.status(400).json({ error: 'Não foi possível cadastrar o produto, verifique os campos e tente novamente.'});
    }
    
  }
}

export default new ProductController();