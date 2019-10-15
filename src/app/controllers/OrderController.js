import * as Yup from 'yup';
import mongoose from 'mongoose';

import Order from '../models/Order';
import Product from '../models/Product';

class OrderController {
  async getTotalCount(req, res) {
    const orders = await Order.find().where({ user: req.userId });
    return res.json({ count: orders.length });
  }

  async index(req, res) {
    const orders = await Order.find().where({ user: req.userId });
    return res.json({ orders });
  }

  async store(req, res) {
    const { products } = req.body;

    const schema = Yup.object().shape({
      products: Yup.array().of(
        Yup.object().shape({
          _id: Yup.string(),
          quantity: Yup.number(),
          size: Yup.string().oneOf(['PP', 'P', 'M', 'G', 'GG']),
        })
      ),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'Houve um erro de validação!' });
    }

    let total = 0;

    const validatedProducts = await Promise.all(
      products.map(async product => {
        if (!mongoose.Types.ObjectId.isValid(product._id)) {
          return { ...product, isValid: false };
        }

        const productExists = await Product.findById(product._id);

        if (!productExists) {
          return { ...product, isValid: false };
        }

        total += productExists.price * product.quantity;
        return {
          ...product,
          isValid: true,
          total: Number(productExists.price * product.quantity),
        };
      })
    );

    const filteredProducts = validatedProducts.filter(
      product => product.isValid
    );

    if (!filteredProducts.length) {
      return res.status(401).json({
        error: 'Não foi possivel encontrar os produtos especificados',
      });
    }

    const productsIdOnly = filteredProducts.map(product => product._id);

    const order = await Order.create({
      user: req.userId,
      products: productsIdOnly,
      productsInfo: filteredProducts.map(product => ({
        _id: product._id,
        quantity: product.quantity,
        total: product.total,
        size: product.size,
      })),
      total,
    });

    return res.json({ order });
  }
}

export default new OrderController();
