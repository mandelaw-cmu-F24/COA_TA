"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Droping tables in correct order (respecting foreign key constraints)
    try {
      await queryInterface.sequelize.query(
        'DROP TABLE IF EXISTS "Transactions" CASCADE'
      );
      await queryInterface.sequelize.query(
        'DROP TABLE IF EXISTS "Accounts" CASCADE'
      );
      await queryInterface.sequelize.query(
        'DROP TABLE IF EXISTS "Categories" CASCADE'
      );
      await queryInterface.sequelize.query(
        'DROP TABLE IF EXISTS "Subcategories" CASCADE'
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Accounts_type"'
      );
    } catch (error) {
      console.error("Error dropping tables:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {},
};
