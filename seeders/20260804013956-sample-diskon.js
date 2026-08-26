'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('diskon', [
      { namadiskon: 'Diskon Lebaran', nominal: 20000 },
      { namadiskon: 'Diskon Akhir Tahun', nominal: 50000 },
      { namadiskon: 'Diskon Member Baru', nominal: 15000 },
      { namadiskon: 'Diskon Weekend', nominal: 10000 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diskon', null, {});
  }
};