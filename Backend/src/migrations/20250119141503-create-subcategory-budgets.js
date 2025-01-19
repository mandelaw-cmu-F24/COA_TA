"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubcategoryBudgets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      budgetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Budgets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      subcategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Subcategories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      limit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      spent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
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

    // Add indexes for better query performance
    await queryInterface.addIndex("SubcategoryBudgets", ["budgetId"]);
    await queryInterface.addIndex("SubcategoryBudgets", ["subcategoryId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SubcategoryBudgets");
  },
};
