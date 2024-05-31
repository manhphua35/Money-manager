const express = require('express');
const IncomeController = require('../controllers/IncomeController');
const router = express.Router();

router.post('/create', IncomeController.createIncome);
router.put('/update/:id', IncomeController.updateIncome);
router.delete('/delete/:id', IncomeController.deleteIncome);
router.get('/getIncomeInMonth', IncomeController.getIncomeInMonth);
router.get('/getStaticsInMonth', IncomeController.getStaticsInMonth);
router.get('/report/download', IncomeController.getReport);
module.exports = router;