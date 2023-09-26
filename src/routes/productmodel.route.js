const express = require('express');
const router = express.Router();
const ProductmodelController = require('../controllers/producmodel.controlle');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Productmodelscheme} = require('../middleware/validators/productmodelValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(ProductmodelController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Productmodelscheme.createUpdate), awaitHandlerFactory(ProductmodelController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(Productmodelscheme.createUpdate), awaitHandlerFactory(ProductmodelController.update));

module.exports = router;