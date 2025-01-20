"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if accountId column exists
    const tableDescription = await queryInterface.describeTable("Transactions");
    if (!tableDescription.accountId) {
      //adding column if it doesn't exist
      await queryInterface.addColumn("Transactions", "accountId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Accounts",
          key: "id",
        },
      });
    }

    // Get the Account IDs for each account type
    const accounts = await queryInterface.sequelize.query(
      `SELECT id, type FROM "Accounts"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Update existing transactions with the corresponding accountId
    for (const account of accounts) {
      await queryInterface.sequelize.query(
        `UPDATE "Transactions" 
         SET "accountId" = :accountId 
         WHERE account = :accountType`,
        {
          replacements: {
            accountId: account.id,
            accountType: account.type,
          },
        }
      );
    }

    // Now make accountId not nullable after data is migrated
    await queryInterface.changeColumn("Transactions", "accountId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Accounts",
        key: "id",
      },
    });

    // Finally remove the old account column
    await queryInterface.removeColumn("Transactions", "account");
  },

  down: async (queryInterface, Sequelize) => {
    // First add back the account column
    await queryInterface.addColumn("Transactions", "account", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Get the accounts data to map IDs back to names
    const accounts = await queryInterface.sequelize.query(
      `SELECT id, type FROM "Accounts"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Restore the old account values
    for (const account of accounts) {
      await queryInterface.sequelize.query(
        `UPDATE "Transactions" 
         SET account = :accountType 
         WHERE "accountId" = :accountId`,
        {
          replacements: {
            accountId: account.id,
            accountType: account.type,
          },
        }
      );
    }

    // Make account column not nullable
    await queryInterface.changeColumn("Transactions", "account", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove accountId column
    await queryInterface.removeColumn("Transactions", "accountId");
  },
};
