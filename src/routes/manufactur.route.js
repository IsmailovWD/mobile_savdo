const express = require('express');
const router = express.Router();
const ManufacturController = require('../controllers/manufactur.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Manufacturscheme} = require('../middleware/validators/manufacturValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(ManufacturController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Manufacturscheme.createUpdate), awaitHandlerFactory(ManufacturController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(Manufacturscheme.createUpdate), awaitHandlerFactory(ManufacturController.update));

module.exports = router;