const express = require('express');
const router = express.Router();
const RasxodController = require('../controllers/rasxod.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { rasxodScheme } = require('../middleware/validators/rasxodValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(RasxodController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(RasxodController.getById));
router.post('/', auth(Role.Admin,Role.Programmer), joiMiddleware(rasxodScheme.create), awaitHandlerFactory(RasxodController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer), joiMiddleware(rasxodScheme.create), awaitHandlerFactory(RasxodController.update));
router.delete('/id/:id', auth(Role.Admin,Role.Programmer), awaitHandlerFactory(RasxodController.delete));
router.get('/last-number', auth(), awaitHandlerFactory(RasxodController.lastDocNumber)); 


module.exports = router;
