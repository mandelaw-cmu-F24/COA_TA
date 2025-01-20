"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "categoryAssociation",
      });

      // Association with account
      Transaction.belongsTo(models.Account, {
        foreignKey: "accountId",
        as: "accountAssociation",
        targetKey: "id",
      });
    }
  }

  Transaction.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Accounts",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "Transactions",
    }
  );

  return Transaction;
};
