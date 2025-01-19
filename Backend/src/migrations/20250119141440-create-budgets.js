"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Budgets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      limit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      spent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: "€",
      },
      alertThreshold: {
        type: Sequelize.INTEGER,
        defaultValue: 80,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Budgets");
  },
};
