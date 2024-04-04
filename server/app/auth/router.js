const router = require('express').Router();
const authController = require('./controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/me', authController.currUserInfo);

module.exports = router;