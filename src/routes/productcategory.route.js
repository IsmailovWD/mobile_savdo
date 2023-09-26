const express = require('express');
const router = express.Router();
const ProductcategoryController = require('../controllers/productcategory.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {productcategoryScheme} = require('../middleware/validators/productcategoryValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(ProductcategoryController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(productcategoryScheme.createUpdate), awaitHandlerFactory(ProductcategoryController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(productcategoryScheme.createUpdate), awaitHandlerFactory(ProductcategoryController.update));

module.exports = router;