const express = require('express');
const router = express.Router();
const SkladController = require('../controllers/sklad.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {sklaScheme} = require('../middleware/validators/skladValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(SkladController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(sklaScheme.createUpdate), awaitHandlerFactory(SkladController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(sklaScheme.createUpdate), awaitHandlerFactory(SkladController.update));

module.exports = router;