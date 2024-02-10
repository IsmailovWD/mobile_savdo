const express = require('express');
const router = express.Router();
const KontragentPayController = require('../controllers/kontragentPay.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { KontrAgentPayScheme } = require('../middleware/validators/kontragentPayValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(KontragentPayController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(KontragentPayController.getById));
router.post('/', auth(), joiMiddleware(KontrAgentPayScheme.createUpdate), awaitHandlerFactory(KontragentPayController.create));
router.patch('/id/:id', auth(), joiMiddleware(KontrAgentPayScheme.createUpdate), awaitHandlerFactory(KontragentPayController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(KontragentPayController.delete));
router.get('/last-number', auth(), awaitHandlerFactory(KontragentPayController.lastDocNumber)); 

module.exports = router;
