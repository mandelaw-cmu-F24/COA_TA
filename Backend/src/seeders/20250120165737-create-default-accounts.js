"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Accounts", [
      {
        name: "Bank Account",
        type: "Bank Account",
        balance: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mobile Money",
        type: "Mobile Money",
        balance: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cash",
        type: "Cash",
        balance: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Accounts", null, {});
  },
};
