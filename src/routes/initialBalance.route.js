const express = require('express');
const router = express.Router();
const InitialBalanceController = require('../controllers/initialBalance.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const joiMiddleware = require('../middleware/joi.middleware');
const { InitialBalanceScheme } = require('../middleware/validators/initialBalanceValidator.middleware');

router.get('/', auth(), awaitHandlerFactory(InitialBalanceController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(InitialBalanceController.getById));
router.post('/', auth(Role.Admin, Role.Programmer), joiMiddleware(InitialBalanceScheme.createUpdate), awaitHandlerFactory(InitialBalanceController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer), joiMiddleware(InitialBalanceScheme.createUpdate), awaitHandlerFactory(InitialBalanceController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer), awaitHandlerFactory(InitialBalanceController.delete));
router.get('/last-number', auth(), awaitHandlerFactory(InitialBalanceController.lastDocNumber));

module.exports = router;