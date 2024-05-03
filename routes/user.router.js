const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { fValidateUserInput } = require('../validators/user.validators');
const { fLogRequest, fHandleErrors, fAuthenticateToken } = require('../middleware/user.middleware');

router.use(fLogRequest);

// Open routes
router.post('/users', fValidateUserInput, userController.fCreateUser);
router.post('/login', userController.fLoginUser);

// Protected routes
router.get('/users/:id', fAuthenticateToken, userController.fGetUser);
router.put('/users/:id', fAuthenticateToken, fValidateUserInput, userController.fUpdateUser);
router.delete('/users/:id', fAuthenticateToken, userController.fDeleteUser);

router.use(fHandleErrors);

module.exports = router;