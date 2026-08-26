const { Diskon } = require('../models');

exports.getAllDiskon = async (req, res) => {
  try {
    const data = await Diskon.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDiskonById = async (req, res) => {
  try {
    const data = await Diskon.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Diskon tidak ditemukan' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDiskon = async (req, res) => {
  try {
    const { namadiskon, nominal } = req.body;
    const data = await Diskon.create({ namadiskon, nominal });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDiskon = async (req, res) => {
  try {
    const { namadiskon, nominal } = req.body;
    const diskon = await Diskon.findByPk(req.params.id);
    if (!diskon) return res.status(404).json({ message: 'Diskon tidak ditemukan' });
    await diskon.update({ namadiskon, nominal });
    res.status(200).json(diskon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDiskon = async (req, res) => {
  try {
    const diskon = await Diskon.findByPk(req.params.id);
    if (!diskon) return res.status(404).json({ message: 'Diskon tidak ditemukan' });
    await diskon.destroy();
    res.status(200).json({ message: 'Diskon berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};