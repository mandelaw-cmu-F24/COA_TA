import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      console.error("Server error:", error);
    }
    return Promise.reject(error);
  }
);

export const categoryService = {
  getAllCategories: () => api.get("/categories"),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const subcategoryService = {
  getByCategory: (categoryId) =>
    api.get(`/subcategories/category/${categoryId}`),
  create: (data) => api.post("/subcategories", data),
  update: (id, data) => api.put(`/subcategories/${id}`, data),
  delete: (id) => api.delete(`/subcategories/${id}`),
};

export const budgetService = {
  getAllBudgets: () => api.get("/budgets"),
  getBudget: (id) => api.get(`/budgets/${id}`),
  createBudget: (data) => api.post("/budgets", data),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
  updateBudgetSpent: (id, spent) =>
    api.patch(`/budgets/${id}/spent`, { spent }),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
};

export const transactionService = {
  getAllTransactions: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.account && filters.account !== "all")
      params.append("account", filters.account);
    if (filters.type && filters.type !== "all")
      params.append("type", filters.type);
    return api.get(`/transactions?${params.toString()}`);
  },
  createTransaction: (data) => api.post("/transactions", data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
};

export const dashboardService = {
  getDashboardData: async (timeRange, dateFrom, dateTo) => {
    try {
      const params = new URLSearchParams();
      if (timeRange) params.append("timeRange", timeRange);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const url = `/dashboard?${params.toString()}`;
      console.log("Requesting URL:", url);

      return await api.get(url);
    } catch (error) {
      console.error("Dashboard request error:", error.response || error);
      throw error;
    }
  },
};
export default api;
