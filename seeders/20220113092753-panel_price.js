'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('panel_prices', [
      {
        id: 1,
        price_name : '10',
        price: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        price_name : '20',
        price: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        price_name : '50',
        price: 50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        price_name : '100',
        price: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        price_name : '200',
        price: 200,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        price_name : '500',
        price: 500,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
