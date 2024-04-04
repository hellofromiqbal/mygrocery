const { Schema, model } = require('mongoose');

const cartIten = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  amount: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = model('CartItem', cartIten);