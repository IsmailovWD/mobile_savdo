const express = require('express');
const router = express.Router();
const ShtrixController = require('../controllers/shtrix.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { shtrixScheme } = require('../middleware/validators/shtrixValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(ShtrixController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(ShtrixController.getById));
router.get('/shtrix/:shtrix', auth(), awaitHandlerFactory(ShtrixController.getByShtrix));
router.post('/', auth(Role.Admin, Role.Programmer), joiMiddleware(shtrixScheme.createUpdate), awaitHandlerFactory(ShtrixController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer), joiMiddleware(shtrixScheme.createUpdate), awaitHandlerFactory(ShtrixController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer), awaitHandlerFactory(ShtrixController.delete));


module.exports = router;
