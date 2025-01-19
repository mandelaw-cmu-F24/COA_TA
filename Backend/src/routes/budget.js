const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// Get all budgets
router.get("/", budgetController.getAllBudgets);

// Get single budget
router.get("/:id", budgetController.getBudget);

// Create new budget
router.post("/", budgetController.createBudget);

// Update budget
router.put("/:id", budgetController.updateBudget);

// Update budget spent amount
router.patch("/:id/spent", budgetController.updateBudgetSpent);

// Delete budget
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
