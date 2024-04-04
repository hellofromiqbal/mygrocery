const path = require('path');
const router = require('express').Router();
const productController = require('./controller');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalname);
    const newFilename = path.basename(originalname, extension) + '-' + uniqueSuffix + extension;
    cb(null, newFilename);
  }
});
const upload = multer({ storage });

router.post('/products', upload.single('image'), productController.store);
router.get('/products', productController.index);
router.put('/products/:id', upload.single('image'), productController.update);
router.delete('/products/:id', productController.destroy);

module.exports = router;