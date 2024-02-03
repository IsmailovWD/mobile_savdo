const express = require('express');
const router = express.Router();
const SkladController = require('../controllers/sklad.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {sklaScheme} = require('../middleware/validators/skladValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(SkladController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(sklaScheme.create), awaitHandlerFactory(SkladController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(sklaScheme.update), awaitHandlerFactory(SkladController.update));
router.post('/check', joiMiddleware(sklaScheme.check), awaitHandlerFactory(SkladController.sklad_date_update));

module.exports = router;