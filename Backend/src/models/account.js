"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.Transaction, {
        foreignKey: "accountId",
        as: "transactions",
      });
    }
  }

  Account.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM("Bank Account", "Mobile Money", "Cash"),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "Accounts",
    }
  );

  return Account;
};
