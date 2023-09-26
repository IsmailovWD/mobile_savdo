const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {productScheme} = require('../middleware/validators/productValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(ProductController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(productScheme.createUpdate), awaitHandlerFactory(ProductController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(productScheme.createUpdate), awaitHandlerFactory(ProductController.update));

module.exports = router;