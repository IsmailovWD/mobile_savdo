const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');

router.get('/product-residual', auth(), awaitHandlerFactory(ReportController.product_ostatok))

module.exports = router;