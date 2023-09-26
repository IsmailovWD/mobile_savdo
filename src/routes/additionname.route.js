const express = require('express');
const router = express.Router();
const AdditionnameController = require('../controllers/additionname.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Additionnamescheme} = require('../middleware/validators/additionnameValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(AdditionnameController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Additionnamescheme.createUpdate), awaitHandlerFactory(AdditionnameController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(Additionnamescheme.createUpdate), awaitHandlerFactory(AdditionnameController.update));

module.exports = router;