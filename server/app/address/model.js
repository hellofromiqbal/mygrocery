const { Schema, model } = require('mongoose');

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  fullAddress: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = model('Address', addressSchema);