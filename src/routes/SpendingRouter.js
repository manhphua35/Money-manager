const express = require('express');
const SpendingController = require('../controllers/SpendingController');
const router = express.Router();

router.post('/create', SpendingController.createSpending);
router.put('/update/:id', SpendingController.updateSpending);
router.delete('/delete/:id', SpendingController.deleteSpending);
router.get('/getSpendingInMonth', SpendingController.getSpendingInMonth);
router.get('/getStaticsInMonth', SpendingController.getStaticsInMonth);
router.get('/getchart', SpendingController.getchart);
module.exports = router;
