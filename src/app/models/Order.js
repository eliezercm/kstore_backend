import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  date: {
    type: Date,
    default: new Date(),
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  productsInfo: [
    {
      type: Object,
    },
  ],
  status: {
    type: String,
    enum: ['Concluído', 'Cancelado', 'Pendente'],
    default: 'Pendente',
  },
  total: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('Order', OrderSchema);
