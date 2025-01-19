import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;
