const express = require('express');
const router = express.Router();
const PrixodController = require('../controllers/prixod.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joimiddleware = require('../middleware/joi.middleware');
const { prixodscheme } = require('../middleware/validators/prixodValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(PrixodController.getAll)); 
router.get('/by-sklad/:sklad_id', auth(), awaitHandlerFactory(PrixodController.getAllBySklad)); 
router.get('/id/:id', auth(), awaitHandlerFactory(PrixodController.getById));
router.post('/', auth(Role.Admin, Role.Programmer), joimiddleware(prixodscheme.create), awaitHandlerFactory(PrixodController.create));
router.patch('/id/:id', auth(Role.Admin), awaitHandlerFactory(PrixodController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(PrixodController.delete));
router.get('/last-number', auth(), awaitHandlerFactory(PrixodController.lastDocNumber));

module.exports = router;
