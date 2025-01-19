"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SubcategoryBudget extends Model {
    static associate(models) {
      SubcategoryBudget.belongsTo(models.Budget, {
        foreignKey: "budgetId",
        as: "budget",
      });
      SubcategoryBudget.belongsTo(models.Subcategory, {
        foreignKey: "subcategoryId",
        as: "subcategory",
      });
    }
  }

  SubcategoryBudget.init(
    {
      budgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subcategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: "SubcategoryBudget",
      tableName: "SubcategoryBudgets",
    }
  );

  return SubcategoryBudget;
};
