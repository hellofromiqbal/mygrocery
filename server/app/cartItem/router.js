const router = require('express').Router();
const cartItemController = require('./controller');

router.post('/cart-items', cartItemController.store);
router.delete('/cart-items', cartItemController.destroy);
router.put('/cart-items', cartItemController.update);

module.exports = router;