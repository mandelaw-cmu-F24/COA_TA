const budgetService = require("../services/budgetService");

const budgetController = {
  async getAllBudgets(req, res) {
    try {
      const budgets = await budgetService.findAll();
      res.json({
        message: "Budgets retrieved successfully",
        data: budgets,
      });
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({
        message: "Error fetching budgets",
        error: error.message,
      });
    }
  },

  async getBudget(req, res) {
    try {
      const { id } = req.params;
      const budget = await budgetService.findById(id);

      if (!budget) {
        return res.status(404).json({
          message: "Budget not found",
        });
      }

      res.json({
        message: "Budget retrieved successfully",
        data: budget,
      });
    } catch (error) {
      console.error("Error fetching budget:", error);
      res.status(500).json({
        message: "Error fetching budget",
        error: error.message,
      });
    }
  },

  async createBudget(req, res) {
    try {
      const {
        categoryId,
        limit,
        currency,
        alertThreshold,
        subcategoryBudgets,
      } = req.body;

      if (!categoryId || !limit) {
        return res.status(400).json({
          message: "Category ID and limit are required",
        });
      }

      const budget = await budgetService.create({
        categoryId,
        limit,
        currency,
        alertThreshold,
        subcategoryBudgets,
      });

      res.status(201).json({
        message: "Budget created successfully",
        data: budget,
      });
    } catch (error) {
      console.error("Error creating budget:", error);
      res.status(500).json({
        message: "Error creating budget",
        error: error.message,
      });
    }
  },

  async updateBudget(req, res) {
    try {
      const { id } = req.params;
      const { limit, alertThreshold, subcategoryBudgets } = req.body;

      const budget = await budgetService.update(id, {
        limit,
        alertThreshold,
        subcategoryBudgets,
      });

      res.json({
        message: "Budget updated successfully",
        data: budget,
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      res.status(500).json({
        message: "Error updating budget",
        error: error.message,
      });
    }
  },

  async updateBudgetSpent(req, res) {
    try {
      const { id } = req.params;
      const { spent } = req.body;

      const budget = await budgetService.updateSpent(id, spent);

      res.json({
        message: "Budget spent amount updated successfully",
        data: budget,
      });
    } catch (error) {
      console.error("Error updating budget spent:", error);
      res.status(500).json({
        message: "Error updating budget spent",
        error: error.message,
      });
    }
  },

  async deleteBudget(req, res) {
    try {
      const { id } = req.params;
      await budgetService.delete(id);

      res.json({
        message: "Budget deleted successfully",
        data: { id },
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({
        message: "Error deleting budget",
        error: error.message,
      });
    }
  },
};

module.exports = budgetController;
