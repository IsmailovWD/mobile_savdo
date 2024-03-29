const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { userSchemas } = require('../middleware/validators/userValidator.middleware');


router.get('/', auth(Role.Admin,Role.Programmer), awaitHandlerFactory(userController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(userController.getById));
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getByUsername));
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser));
router.post('/',auth(Role.Admin, Role.Programmer), joiMiddleware(userSchemas.create), awaitHandlerFactory(userController.create));
router.patch('/', auth(), joiMiddleware(userSchemas.update), awaitHandlerFactory(userController.update));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer), joiMiddleware(userSchemas.update_user_admin), awaitHandlerFactory(userController.update_user));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer), awaitHandlerFactory(userController.delete));

router.post('/login', joiMiddleware(userSchemas.login), awaitHandlerFactory(userController.userLogin));

module.exports = router;