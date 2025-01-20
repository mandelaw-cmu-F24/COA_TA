"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Accounts", [
      {
        name: "Bank Account",
        type: "Bank Account",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mobile Money",
        type: "Mobile Money",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cash",
        type: "Cash",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    //  Getting created accounts
    const accounts = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Accounts"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Updating existing transactions with the corresponding accountId
    for (const account of accounts) {
      await queryInterface.sequelize.query(
        `UPDATE "Transactions" 
         SET "accountId" = :accountId 
         WHERE account = :accountName`,
        {
          replacements: {
            accountId: account.id,
            accountName: account.name,
          },
        }
      );
    }

    // Making accountId not nullable
    await queryInterface.changeColumn("Transactions", "accountId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Accounts",
        key: "id",
      },
    });

    //  Removing the old account column
    await queryInterface.removeColumn("Transactions", "account");
  },

  down: async (queryInterface, Sequelize) => {
    // Adding back the account column
    await queryInterface.addColumn("Transactions", "account", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Restoring the old account values
    const accounts = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Accounts"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const account of accounts) {
      await queryInterface.sequelize.query(
        `UPDATE "Transactions" 
         SET account = :accountName 
         WHERE "accountId" = :accountId`,
        {
          replacements: {
            accountId: account.id,
            accountName: account.name,
          },
        }
      );
    }

    //  Making account column not nullable
    await queryInterface.changeColumn("Transactions", "account", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Removing accountId
    await queryInterface.removeColumn("Transactions", "accountId");

    // Removing the accounts
    await queryInterface.bulkDelete("Accounts", null, {});
  },
};
