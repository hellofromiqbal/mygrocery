const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  addresses: [{
    type: Schema.Types.ObjectId,
    ref: 'Address'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'CartItem'
  }],
  invoices: [{
    type: Schema.Types.ObjectId,
    ref: 'Invoice'
  }]
}, { timestamps: true });

module.exports = model('User', userSchema);