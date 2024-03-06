const express = require('express');
const SpendingController = require('../controllers/SpendingController');
const router = express.Router();

router.post('/create', SpendingController.createSpending);
router.post('/update/:id', SpendingController.updateSpending);
router.delete('/delete/:id', SpendingController.deleteSpending);
module.exports = router;
