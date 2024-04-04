const Address = require('./model');
const User = require('../user/model');

const store = async (req, res) => {
  try {
    const { userId, fullAddress } = req.body;
    const newDocument = await Address.create({ user: userId, fullAddress });
    const newAddress = await Address.findById(newDocument?._id).select('-__v -createdAt -updatedAt');

    await User.findByIdAndUpdate(userId, {
      $push: { address: newAddress._id }
    });

    return res.status(201).json({
      message: 'Address added.',
      data: newAddress
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const index = async (req, res) => {
  try {
    const { id } = req.params;
    const addresses = await Address.find({ user: id });
    return res.status(200).json({
      message: 'Addresses fetched.',
      data: addresses
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const update = async (req, res) => {
  try {
    const { addressId, fullAddress } = req.body;
    const address = await Address.findByIdAndUpdate(addressId, { fullAddress }, { new: true });

    return res.status(200).json({
      message: 'Address updated.',
      data: address
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { userId, addressId } = req.body;
    await User.findByIdAndUpdate(userId, {
      $pull: { address: addressId }
    });
    await Address.findByIdAndDelete(addressId);
    return res.status(200).json({
      message: 'Address deleted.'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { store, index, update, destroy };