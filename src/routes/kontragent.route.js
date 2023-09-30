const express = require('express');
const router = express.Router();
const KontragentController = require('../controllers/kontragent.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Kontragentscheme} = require('../middleware/validators/kontragentValidator.middleware')


router.get('/', auth(), awaitHandlerFactory(KontragentController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(KontragentController.getById));
router.get('/name/:name', auth(), awaitHandlerFactory(KontragentController.getByName));
router.post('/', auth(Role.Admin, Role.Programmer), joiMiddleware(Kontragentscheme.createUpdate), awaitHandlerFactory(KontragentController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer), joiMiddleware(Kontragentscheme.createUpdate), awaitHandlerFactory(KontragentController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer), awaitHandlerFactory(KontragentController.delete));

module.exports = router;