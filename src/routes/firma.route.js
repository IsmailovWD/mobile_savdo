const express = require('express');
const router = express.Router();
const FirmaController = require('../controllers/firma.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { Firmascheme } = require('../middleware/validators/firmaValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(FirmaController.getAll)); 
router.get('/id/:id', auth(), awaitHandlerFactory(FirmaController.getById));
router.get('/name/:name', auth(), awaitHandlerFactory(FirmaController.getByName));
router.post('/', auth(Role.Admin, Role.Programmer), joiMiddleware(Firmascheme.createUpdate), awaitHandlerFactory(FirmaController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer), joiMiddleware(Firmascheme.createUpdate), awaitHandlerFactory(FirmaController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer), awaitHandlerFactory(FirmaController.delete));


module.exports = router;
