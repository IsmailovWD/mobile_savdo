const express = require('express');
const router = express.Router();
const KontragentInitialController = require('../controllers/kontragentInitial.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { kontragentInitialSchema } = require('../middleware/validators/kontragentInitialValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(KontragentInitialController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(KontragentInitialController.getById));
router.post('/', auth(), joiMiddleware(kontragentInitialSchema.createUpdate), awaitHandlerFactory(KontragentInitialController.create));
router.patch('/id/:id', auth(), joiMiddleware(kontragentInitialSchema.createUpdate), awaitHandlerFactory(KontragentInitialController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(KontragentInitialController.delete));
router.get('/last-number', auth(), awaitHandlerFactory(KontragentInitialController.lastDocNumber)); 

module.exports = router;