const router = require('express').Router();
const invoiceController = require('./controller');

router.post('/invoices', invoiceController.store);
router.put('/invoices', invoiceController.update);
router.post('/invoices/:id', invoiceController.index);

module.exports = router;