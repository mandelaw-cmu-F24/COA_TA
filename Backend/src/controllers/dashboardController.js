const dashboardService = require("../services/dashboardService");

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      const { timeRange, dateFrom, dateTo } = req.query;
      const data = await dashboardService.getDashboardData(
        timeRange,
        dateFrom,
        dateTo
      );
      res.json({
        message: "Dashboard data retrieved successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({
        message: "Error fetching dashboard data",
        error: error.message,
      });
    }
  },
};

module.exports = dashboardController;
