const express = require('express');
const router = express.Router();
const diskonController = require('../controllers/diskon.controller');

router.get('/', diskonController.getAllDiskon);
router.get('/:id', diskonController.getDiskonById);
router.post('/', diskonController.createDiskon);
router.put('/:id', diskonController.updateDiskon);
router.delete('/:id', diskonController.deleteDiskon);

module.exports = router;