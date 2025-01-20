require("dotenv").config();
const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sequelize } = require("./src/models");

const categoryRoutes = require("./src/routes/category");
const subcategoryRoutes = require("./src/routes/subcategory");
const budgetRoutes = require("./src/routes/budget");
const transactionRoutes = require("./src/routes/transaction");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// database connection
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testDbConnection();

// Set port
const PORT = process.env.PORT || 7000;

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
