const { Transaction, Budget, Category, sequelize } = require("../models");

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
        include: [
          {
            model: Category,
            as: "categoryAssociation",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
  },

  async findById(id) {
    try {
      return await Transaction.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error fetching transaction: ${error.message}`);
    }
  },

  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        // Create the transaction
        const transaction = await Transaction.create(data, { transaction: t });

        // Update budget if it's an expense
        if (data.type === "expense" && data.categoryId) {
          const budget = await Budget.findOne({
            where: { categoryId: data.categoryId },
            transaction: t,
          });

          if (budget) {
            const newSpent =
              parseFloat(budget.spent || 0) + Math.abs(parseFloat(data.amount));
            await budget.update({ spent: newSpent }, { transaction: t });

            // Return budget alert information
            return {
              transaction,
              budgetAlert: {
                isOverBudget: newSpent > budget.limit,
                isNearLimit:
                  (newSpent / budget.limit) * 100 >= budget.alertThreshold,
                spent: newSpent,
                limit: budget.limit,
                percentage: (newSpent / budget.limit) * 100,
                category: data.category,
              },
            };
          }
        }

        return { transaction };
      });

      return result;
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  },

  async update(id, data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const oldTransaction = await Transaction.findByPk(id);
        if (!oldTransaction) {
          throw new Error("Transaction not found");
        }

        // Update transaction
        const transaction = await oldTransaction.update(data, {
          transaction: t,
        });

        // Adjust budget if it's an expense
        if (data.type === "expense" && data.categoryId) {
          const budget = await Budget.findOne({
            where: { categoryId: data.categoryId },
            transaction: t,
          });

          if (budget) {
            // Remove old amount and add new amount
            const oldAmount = Math.abs(parseFloat(oldTransaction.amount));
            const newAmount = Math.abs(parseFloat(data.amount));
            const newSpent =
              parseFloat(budget.spent || 0) - oldAmount + newAmount;

            await budget.update({ spent: newSpent }, { transaction: t });

            return {
              transaction,
              budgetAlert: {
                isOverBudget: newSpent > budget.limit,
                isNearLimit:
                  (newSpent / budget.limit) * 100 >= budget.alertThreshold,
                spent: newSpent,
                limit: budget.limit,
                percentage: (newSpent / budget.limit) * 100,
                category: data.category,
              },
            };
          }
        }

        return { transaction };
      });

      return result;
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      await sequelize.transaction(async (t) => {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
          throw new Error("Transaction not found");
        }

        // Update budget if it was an expense
        if (transaction.type === "expense" && transaction.categoryId) {
          const budget = await Budget.findOne({
            where: { categoryId: transaction.categoryId },
            transaction: t,
          });

          if (budget) {
            const newSpent =
              parseFloat(budget.spent || 0) -
              Math.abs(parseFloat(transaction.amount));
            await budget.update(
              { spent: Math.max(0, newSpent) },
              { transaction: t }
            );
          }
        }

        await transaction.destroy({ transaction: t });
      });

      return id;
    } catch (error) {
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  },
};

module.exports = transactionService;
