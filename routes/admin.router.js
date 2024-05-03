const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { fAuthenticateToken, fCheckAdminRole } = require('../middleware/user.middleware');

router.get('/users', fAuthenticateToken, fCheckAdminRole, adminController.fGetUsersAdmin);

module.exports = router;
