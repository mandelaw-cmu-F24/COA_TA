"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    // Also drop ENUM types
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Accounts_type" CASCADE;
    `);
  },

  down: async (queryInterface, Sequelize) => {},
};
