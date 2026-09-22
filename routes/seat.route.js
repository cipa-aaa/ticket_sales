const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seat.controller');

/** load function from auth-controller, used for the new available-seats route */
const { authorize } = require('../controllers/auth.controller');

router.get('/', seatController.getAllSeat);
router.get('/event/:eventID', seatController.getSeatByEvent);

/** route to see only empty/available seats for a specific event,
 * accessible by both user and admin (as long as they are logged in) */
router.get('/available/:eventID', authorize, seatController.getAvailableSeats);

router.get('/:id', seatController.getSeatById);
router.post('/', seatController.createSeat);
router.put('/:id', seatController.updateSeat);
router.delete('/:id', seatController.deleteSeat);

module.exports = router;