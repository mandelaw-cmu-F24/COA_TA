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
      const { type, amount, account, category, description, date } = req.body;

      if (!type || !amount || !account || !category || !description || !date) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const transaction = await transactionService.create({
        type,
        amount,
        account,
        category,
        description,
        date,
      });

      res.status(201).json({
        message: "Transaction created successfully",
        data: transaction,
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
      const { type, amount, account, category, description, date } = req.body;

      const transaction = await transactionService.update(id, {
        type,
        amount,
        account,
        category,
        description,
        date,
      });

      res.json({
        message: "Transaction updated successfully",
        data: transaction,
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
