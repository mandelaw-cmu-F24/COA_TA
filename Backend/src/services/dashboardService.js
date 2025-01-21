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
        { name: "Bank Account", type: "Bank Account", balance: 0 },
        { name: "Cash", type: "Cash", balance: 0 },
        { name: "Mobile Money", type: "Mobile Money", balance: 0 },
      ];

      // Check if accounts exist, if not create them
      for (const defaultAccount of defaultAccounts) {
        await Account.findOrCreate({
          where: { name: defaultAccount.name },
          defaults: defaultAccount,
        });
      }

      // Set up date filters
      let dateFilter = {};
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (timeRange) {
        case "today":
          dateFilter = {
            date: {
              [Op.gte]: today,
              [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          };
          break;
        case "this-week":
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          dateFilter = {
            date: {
              [Op.gte]: weekStart,
              [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          };
          break;
        case "this-month":
          dateFilter = {
            date: {
              [Op.gte]: new Date(today.getFullYear(), today.getMonth(), 1),
              [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          };
          break;
        case "custom":
          if (dateFrom && dateTo) {
            dateFilter = {
              date: {
                [Op.between]: [new Date(dateFrom), new Date(dateTo)],
              },
            };
          }
          break;
      }

      // Fetch accounts with their transactions
      const accounts = await Account.findAll({
        attributes: ["id", "name", "type", "balance"],
        include: [
          {
            model: Transaction,
            as: "transactions",
            where: dateFilter,
            required: false,
            attributes: ["amount", "type", "date"],
          },
        ],
        raw: false,
        nest: true,
      });

      // Process accounts data
      for (const account of accounts) {
        const accountData = {
          balance: parseFloat(account.balance) || 0,
          todayTransactions: 0,
          monthlyTransactions: 0,
        };

        // Calculate transactions totals
        if (account.transactions) {
          for (const transaction of account.transactions) {
            const amount = parseFloat(transaction.amount);

            // Update monthly/period transactions
            accountData.monthlyTransactions += amount;

            // Update today's transactions
            if (
              new Date(transaction.date).toDateString() === today.toDateString()
            ) {
              accountData.todayTransactions += amount;
              if (transaction.type === "income") {
                dashboardData.accounts.income.todayIncome += amount;
              }
            }
          }
        }

        // Update the corresponding account type in dashboardData
        switch (account.type) {
          case "Bank Account":
            dashboardData.accounts.bank = accountData;
            break;
          case "Mobile Money":
            dashboardData.accounts.mobileMoney = accountData;
            break;
          case "Cash":
            dashboardData.accounts.cash = accountData;
            break;
        }
      }

      // Fetch budget alerts
      const budgets = await sequelize.query(
        `SELECT 
          c.name as category,
          b.limit,
          b.spent,
          b.alertThreshold
        FROM "Budgets" b
        JOIN "Categories" c ON b."categoryId" = c.id
        WHERE b.spent >= b.limit * (b."alertThreshold" / 100)`,
        { type: sequelize.QueryTypes.SELECT }
      );

      // Process budget alerts
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
