"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    static associate(models) {
      Subcategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }

  Subcategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Subcategory",
      tableName: "Subcategories",
      timestamps: true,
    }
  );

  return Subcategory;
};
