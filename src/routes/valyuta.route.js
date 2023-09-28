const express = require('express');
const router = express.Router();
const PaytypeController = require('../controllers/valyuta.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {valyutaScheme} = require('../middleware/validators/valyutaValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(PaytypeController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(valyutaScheme.createUpdate), awaitHandlerFactory(PaytypeController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(valyutaScheme.createUpdate), awaitHandlerFactory(PaytypeController.update));

module.exports = router;