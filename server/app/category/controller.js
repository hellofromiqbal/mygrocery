const Category = require('./model');

const store = async (req, res) => {
  try {
    const payload = req.body;
    const newCategory = await Category.create(payload);
    return res.status(201).json({
      message: 'New category added!',
      data: newCategory
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  };
};

const index = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      message: 'Categories fetched!',
      data: categories
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  };
};

module.exports = { store, index };