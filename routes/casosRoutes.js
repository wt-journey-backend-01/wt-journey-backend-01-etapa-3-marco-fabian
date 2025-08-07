const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/', casosController.getAllCasos);
router.get('/:id', casosController.getCasoById);
router.get('/:caso_id/agente', casosController.getAgenteFromCaso);
router.post('/', casosController.createCaso);
router.put('/:id', casosController.updateCaso);
router.patch('/:id', casosController.patchCaso);
router.delete('/:id', casosController.deleteCaso);

module.exports = router; 