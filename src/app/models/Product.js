import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  internalCode: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  promoPrice: {
    type: Number,
  },
  size: [
    {
      type: String,
      enum: ['PP', 'P', 'M', 'G', 'GG'],
      required: true,
    },
  ],
  colorCode: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Product', ProductSchema);
