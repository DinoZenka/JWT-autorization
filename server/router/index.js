const router = require('express').Router()
const userController = require('../controllers/userController');



router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('logout', userController.logout);
router.get('/activate/:link', userController.activation);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);

module.exports = router