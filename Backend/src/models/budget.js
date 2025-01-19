"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      Budget.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Budget.hasMany(models.SubcategoryBudget, {
        foreignKey: "budgetId",
        as: "subcategoryBudgets",
      });
    }
  }

  Budget.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      limit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      spent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "€",
      },
      alertThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 80,
        validate: {
          min: 0,
          max: 100,
        },
      },
    },
    {
      sequelize,
      modelName: "Budget",
      tableName: "Budgets",
    }
  );

  return Budget;
};
