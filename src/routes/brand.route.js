const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brand.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Brandscheme} = require('../middleware/validators/brandValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(BrandController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Brandscheme.createUpdate), awaitHandlerFactory(BrandController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(Brandscheme.createUpdate), awaitHandlerFactory(BrandController.update));

module.exports = router;