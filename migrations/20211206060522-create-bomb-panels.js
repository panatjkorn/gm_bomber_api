'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bomb_panels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      panel_name: {
        type: Sequelize.STRING
      },
      total_bomb : {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      //เฉลย
      panel_default: {
        type: Sequelize.JSON
      },
      //ตัวอย่างระเบิด
      panel_default_ex: {
        type: Sequelize.JSON
      },
      //เปิดช่องไหนไปแล้วบ้าง
      open_panel: {
        type: Sequelize.JSON
      },
      //ค่าที่กดไป
      open_panel_default: {
        type: Sequelize.JSON
      },
      is_won: {
        type: Sequelize.BOOLEAN
      },
      user_id: {
        type: Sequelize.JSON,
        defaultValue: null
      },
      panel_price: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      user_reward: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      // is_playing: {
      //   type: Sequelize.BOOLEAN
      // },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bomb-panels');
  }
};