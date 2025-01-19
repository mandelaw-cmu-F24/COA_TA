require("dotenv").config();
const { Sequelize } = require("sequelize");
const { execSync } = require("child_process");
const path = require("path");

const DATABASE_URL =
  "postgresql://coa_db_user:mkkH2F5ywSoRT9G6jnXczIqgzK1Z2hpw@dpg-cu6i5f56l47c73c1c02g-a.frankfurt-postgres.render.com/coa_db";

const migrate = async () => {
  try {
    // Create a temporary config file for migrations
    const configPath = path.join(__dirname, "temp-config.json");
    const config = {
      development: {
        url: DATABASE_URL,
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      },
    };

    require("fs").writeFileSync(configPath, JSON.stringify(config));

    // Run migrations using the temporary config
    try {
      console.log("Running migrations...");
      execSync(
        `npx sequelize-cli db:migrate --config ${configPath} --env development`,
        { stdio: "inherit" }
      );
      console.log("Migrations completed successfully.");
    } catch (error) {
      console.error("Migration failed:", error);
    }

    // Clean up temporary config file
    require("fs").unlinkSync(configPath);
  } catch (error) {
    console.error("Error:", error);
  }
};

migrate();
