const { Transaction } = require("../models");

const transactionService = {
  async findAll(filters = {}) {
    try {
      const where = {};

      if (filters.account && filters.account !== "all") {
        where.account = filters.account;
      }

      if (filters.type && filters.type !== "all") {
        where.type = filters.type;
      }

      return await Transaction.findAll({
        where,
        order: [["date", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
  },

  async findById(id) {
    try {
      return await Transaction.findByPk(id);
    } catch (error) {
      throw new Error(`Error fetching transaction: ${error.message}`);
    }
  },

  async create(data) {
    try {
      return await Transaction.create(data);
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  },

  async update(id, data) {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return await transaction.update(data);
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      await transaction.destroy();
      return id;
    } catch (error) {
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  },
};

module.exports = transactionService;
