const express = require('express');
const ChartController = require('../controllers/ChartController')
const router = express.Router();

router.get('/getChartSpendingInMonth', ChartController.getChartSpendingInMonth);
router.get('/getChartCompareSpending', ChartController.getChartCompareSpending);
router.get('/getCompareInMonth', ChartController.getCompareInMonth);
router.get('/getChartIncomeInMonth', ChartController.getChartIncomeInMonth);
router.get('/getChartCompareIncome', ChartController.getChartCompareIncome);

module.exports = router;