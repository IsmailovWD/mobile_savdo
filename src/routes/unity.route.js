const express = require('express');
const router = express.Router();
const UnityController = require('../controllers/unity.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Unityscheme} = require('../middleware/validators/unityValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(UnityController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Unityscheme.createUpdate), awaitHandlerFactory(UnityController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer),joiMiddleware(Unityscheme.createUpdate), awaitHandlerFactory(UnityController.update));

module.exports = router;