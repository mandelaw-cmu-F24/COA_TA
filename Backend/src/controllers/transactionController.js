const transactionService = require("../services/transactionService");

const transactionController = {
  async getAllTransactions(req, res) {
    try {
      const { account, type } = req.query;
      const transactions = await transactionService.findAll({ account, type });
      res.json({
        message: "Transactions retrieved successfully",
        data: transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({
        message: "Error fetching transactions",
        error: error.message,
      });
    }
  },

  async getTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.findById(id);

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      res.json({
        message: "Transaction retrieved successfully",
        data: transaction,
      });
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({
        message: "Error fetching transaction",
        error: error.message,
      });
    }
  },

  async createTransaction(req, res) {
    try {
      const { type, amount, account, category, categoryId, description, date } =
        req.body;

      if (!type || !amount || !account || !category || !description || !date) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const result = await transactionService.create({
        type,
        amount,
        account,
        category,
        categoryId,
        description,
        date,
      });

      // Handle budget alerts
      if (result.budgetAlert) {
        if (result.budgetAlert.isOverBudget) {
          return res.status(201).json({
            message:
              "Transaction created successfully. Warning: Budget exceeded!",
            data: result.transaction,
            budgetAlert: {
              message: `Budget for ${result.budgetAlert.category} exceeded! Spent: €${result.budgetAlert.spent} of €${result.budgetAlert.limit}`,
              percentage: result.budgetAlert.percentage,
              type: "exceeded",
            },
          });
        } else if (result.budgetAlert.isNearLimit) {
          return res.status(201).json({
            message:
              "Transaction created successfully. Warning: Approaching budget limit!",
            data: result.transaction,
            budgetAlert: {
              message: `Approaching budget limit for ${
                result.budgetAlert.category
              }! ${result.budgetAlert.percentage.toFixed(1)}% used`,
              percentage: result.budgetAlert.percentage,
              type: "warning",
            },
          });
        }
      }

      res.status(201).json({
        message: "Transaction created successfully",
        data: result.transaction,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({
        message: "Error creating transaction",
        error: error.message,
      });
    }
  },

  async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const { type, amount, account, category, categoryId, description, date } =
        req.body;

      const result = await transactionService.update(id, {
        type,
        amount,
        account,
        category,
        categoryId,
        description,
        date,
      });

      // Handle budget alerts
      if (result.budgetAlert) {
        return res.json({
          message: "Transaction updated successfully",
          data: result.transaction,
          budgetAlert: {
            message: result.budgetAlert.isOverBudget
              ? `Budget for ${result.budgetAlert.category} exceeded! Spent: €${result.budgetAlert.spent} of €${result.budgetAlert.limit}`
              : `Approaching budget limit for ${
                  result.budgetAlert.category
                }! ${result.budgetAlert.percentage.toFixed(1)}% used`,
            percentage: result.budgetAlert.percentage,
            type: result.budgetAlert.isOverBudget ? "exceeded" : "warning",
          },
        });
      }

      res.json({
        message: "Transaction updated successfully",
        data: result.transaction,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({
        message: "Error updating transaction",
        error: error.message,
      });
    }
  },

  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      await transactionService.delete(id);

      res.json({
        message: "Transaction deleted successfully",
        data: { id },
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({
        message: "Error deleting transaction",
        error: error.message,
      });
    }
  },
};

module.exports = transactionController;
