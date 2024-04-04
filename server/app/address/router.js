const router = require('express').Router();
const addressController = require('./controller');

router.post('/addresses', addressController.store);
router.post('/addresses/:id', addressController.index);
router.put('/addresses', addressController.update);
router.delete('/addresses', addressController.destroy);

module.exports = router;