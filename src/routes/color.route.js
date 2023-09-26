const express = require('express');
const router = express.Router();
const ColorController = require('../controllers/color.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Colorscheme} = require('../middleware/validators/colorValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(ColorController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Colorscheme.createUpdate), awaitHandlerFactory(ColorController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(Colorscheme.createUpdate), awaitHandlerFactory(ColorController.update));

module.exports = router;