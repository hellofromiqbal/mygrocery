const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  image_url: {
    type: String,
    required: true
  },
  discRules: [{
    minQty: {
      type: Number,
      required: true
    },
    discPerc: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true });

module.exports = model('Product', productSchema);