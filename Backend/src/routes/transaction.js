const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Get all transactions with optional filters
router.get("/", transactionController.getAllTransactions);

// Get single transaction
router.get("/:id", transactionController.getTransaction);

// Create new transaction
router.post("/", transactionController.createTransaction);

// Update transaction
router.put("/:id", transactionController.updateTransaction);

// Delete transaction
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
