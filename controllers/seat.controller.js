const db = require('../models');
const seat = db.seat;
const event = db.event;
const ticket = db.ticket;

exports.getAllSeat = async (req, res) => {
  try {
    // belongsTo(event) tanpa alias -> default alias = 'event'
    const data = await seat.findAll({ include: [{ model: event }] });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSeatById = async (req, res) => {
  try {
    const data = await seat.findByPk(req.params.id, {
      include: [
        { model: event },
        { model: ticket, as: 'seatTicket' }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Seat tidak ditemukan' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /seat/event/:eventID -> semua kursi milik satu event
exports.getSeatByEvent = async (req, res) => {
  try {
    const data = await seat.findAll({ where: { eventID: req.params.eventID } });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSeat = async (req, res) => {
  try {
    const { eventID, rowNum, seatNum, status } = req.body;
    const data = await seat.create({ eventID, rowNum, seatNum, status });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSeat = async (req, res) => {
  try {
    const { eventID, rowNum, seatNum, status } = req.body;
    const data = await seat.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Seat tidak ditemukan' });
    await data.update({ eventID, rowNum, seatNum, status });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    const data = await seat.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Seat tidak ditemukan' });
    await data.destroy();
    res.status(200).json({ message: 'Seat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};