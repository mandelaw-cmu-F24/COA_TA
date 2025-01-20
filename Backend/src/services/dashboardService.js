const { Transaction, Account, sequelize } = require("../models");
const { Op } = require("sequelize");

const dashboardService = {
  async getDashboardData(timeRange, dateFrom, dateTo) {
    try {
      // Initialize default dashboard data
      const dashboardData = {
        accounts: {
          income: {
            balance: 0,
            todayIncome: 0,
            monthlyIncome: 0,
          },
          bank: {
            balance: 0,
            todayTransactions: 0,
            monthlyTransactions: 0,
          },
          mobileMoney: {
            balance: 0,
            todayTransactions: 0,
            monthlyTransactions: 0,
          },
          cash: {
            balance: 0,
            todayTransactions: 0,
            monthlyTransactions: 0,
          },
        },
        budgetAlerts: [],
      };

      // Create default accounts if they don't exist
      const defaultAccounts = [
        { name: "Main Bank Account", type: "Bank Account", balance: 0 },
        { name: "Cash Wallet", type: "Cash", balance: 0 },
        { name: "Mobile Money Account", type: "Mobile Money", balance: 0 },
      ];

      // Check if accounts exist, if not create them
      for (const defaultAccount of defaultAccounts) {
        const [account] = await Account.findOrCreate({
          where: { type: defaultAccount.type },
          defaults: defaultAccount,
        });
      }

      // Now fetch accounts with transactions
      let dateFilter = {};
      switch (timeRange) {
        case "today":
          dateFilter = {
            date: {
              [Op.gte]: sequelize.fn("CURRENT_DATE"),
            },
          };
          break;
        case "this-week":
          dateFilter = {
            date: {
              [Op.gte]: sequelize.literal("CURRENT_DATE - INTERVAL '7 days'"),
            },
          };
          break;
        case "this-month":
          dateFilter = {
            date: {
              [Op.gte]: sequelize.literal("DATE_TRUNC('month', CURRENT_DATE)"),
            },
          };
          break;
        case "custom":
          if (dateFrom && dateTo) {
            dateFilter = {
              date: {
                [Op.between]: [dateFrom, dateTo],
              },
            };
          }
          break;
      }

      const accounts = await Account.findAll({
        include: [
          {
            model: Transaction,
            as: "transactions",
            attributes: [],
            where: dateFilter,
            required: false,
          },
        ],
        attributes: [
          "id",
          "name",
          "type",
          "balance",
          [
            sequelize.fn(
              "COALESCE",
              sequelize.fn(
                "SUM",
                sequelize.literal(
                  "CASE WHEN transactions.date >= CURRENT_DATE THEN transactions.amount ELSE 0 END"
                )
              ),
              0
            ),
            "todayTransactions",
          ],
          [
            sequelize.fn(
              "COALESCE",
              sequelize.fn(
                "SUM",
                sequelize.literal(
                  "CASE WHEN transactions.type = 'income' AND transactions.date >= CURRENT_DATE THEN transactions.amount ELSE 0 END"
                )
              ),
              0
            ),
            "todayIncome",
          ],
          [
            sequelize.fn(
              "COALESCE",
              sequelize.fn("SUM", sequelize.col("transactions.amount")),
              0
            ),
            "periodTransactions",
          ],
        ],
        group: [
          "Account.id",
          "Account.name",
          "Account.type",
          "Account.balance",
        ],
        raw: true,
      });

      // Update dashboardData with actual account data if exists
      if (accounts && accounts.length > 0) {
        accounts.forEach((account) => {
          switch (account.type) {
            case "Bank Account":
              dashboardData.accounts.bank = {
                balance: parseFloat(account.balance) || 0,
                todayTransactions: parseFloat(account.todayTransactions) || 0,
                monthlyTransactions:
                  parseFloat(account.periodTransactions) || 0,
              };
              break;
            case "Mobile Money":
              dashboardData.accounts.mobileMoney = {
                balance: parseFloat(account.balance) || 0,
                todayTransactions: parseFloat(account.todayTransactions) || 0,
                monthlyTransactions:
                  parseFloat(account.periodTransactions) || 0,
              };
              break;
            case "Cash":
              dashboardData.accounts.cash = {
                balance: parseFloat(account.balance) || 0,
                todayTransactions: parseFloat(account.todayTransactions) || 0,
                monthlyTransactions:
                  parseFloat(account.periodTransactions) || 0,
              };
              break;
          }

          if (account.todayIncome > 0) {
            dashboardData.accounts.income.todayIncome +=
              parseFloat(account.todayIncome) || 0;
          }
        });
      }

      // Budget alerts part remains the same
      const budgets = await sequelize.query(
        `SELECT 
            c.name as category,
            b.limit,
            b.spent,
            b.alertThreshold
          FROM Budgets b
          JOIN Categories c ON b.categoryId = c.id
          WHERE b.spent >= b.limit * (b.alertThreshold / 100)`,
        { type: sequelize.QueryTypes.SELECT }
      );

      budgets.forEach((budget) => {
        const percentageUsed = (budget.spent / budget.limit) * 100;
        const message = `Budget for ${
          budget.category
        } is at ${percentageUsed.toFixed(1)}% (${budget.spent}€ of ${
          budget.limit
        }€)`;
        dashboardData.budgetAlerts.push({ message });
      });

      return dashboardData;
    } catch (error) {
      console.error("Error processing dashboard data:", error);
      throw error;
    }
  },
};
module.exports = dashboardService;
