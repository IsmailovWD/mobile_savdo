const express = require('express');
const router = express.Router();
const Statistic = require('../controllers/mobileReport.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { StatisticScheme } = require('../middleware/validators/statisticValidator.middleware')

router.get('/sections/list', auth(), awaitHandlerFactory(Statistic.sectionsList));
router.post('/sections/data', auth(), awaitHandlerFactory(Statistic.sectionsData));
router.post('/table/data', auth(), awaitHandlerFactory(Statistic.tableData));

module.exports = router;