const express = require('express');
const router = express.Router();
const KursController = require('../controllers/kurs.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {Kursscheme} = require('../middleware/validators/kursValidator.middleware')

router.get('/', auth(), awaitHandlerFactory(KursController.getLastKurs));
router.get('/all', auth(), awaitHandlerFactory(KursController.getAll));
router.post('/', auth(Role.Admin,Role.Programmer),joiMiddleware(Kursscheme.createUpdate), awaitHandlerFactory(KursController.create));

module.exports = router;