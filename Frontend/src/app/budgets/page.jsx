"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertCircle, Plus, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { budgetService, categoryService } from "../services/api";
import { toast } from "react-hot-toast";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    categoryId: "",
    limit: "",
    alertThreshold: 80,
    currency: "€",
  });

  // Fetch budgets and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, categoriesRes] = await Promise.all([
        budgetService.getAllBudgets(),
        categoryService.getAllCategories(),
      ]);
      setBudgets(budgetsRes.data.data);
      setCategories(categoriesRes.data.data);

      // Check budget limits after fetching
      budgetsRes.data.data.forEach(checkBudgetLimits);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check budget limits
  const checkBudgetLimits = (budget) => {
    const percentage = (budget.spent / budget.limit) * 100;

    if (budget.spent > budget.limit) {
      toast.error(
        `${budget.category.name} budget exceeded by ${budget.currency}${(
          budget.spent - budget.limit
        ).toFixed(2)}!`,
        {
          duration: 6000,
          position: "top-right",
        }
      );
    } else if (percentage >= budget.alertThreshold) {
      toast.warning(
        `${budget.category.name} budget at ${percentage.toFixed(0)}% (${
          budget.currency
        }${budget.spent} / ${budget.currency}${budget.limit})`,
        {
          duration: 6000,
          position: "top-right",
        }
      );
    }
  };

  // Create budget
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetService.createBudget({
        ...newBudget,
        limit: parseFloat(newBudget.limit),
        alertThreshold: parseInt(newBudget.alertThreshold),
      });
      toast.success("Budget created successfully");
      setShowAddBudget(false);
      fetchData();
      setNewBudget({
        categoryId: "",
        limit: "",
        alertThreshold: 80,
        currency: "€",
      });
    } catch (error) {
      toast.error("Failed to create budget");
      console.error(error);
    }
  };

  // Edit budget
  const handleEditBudget = (budget) => {
    setEditingBudget({
      id: budget.id,
      categoryId: budget.category.id,
      limit: budget.limit,
      alertThreshold: budget.alertThreshold,
    });
    setShowEditModal(true);
  };

  // Update budget
  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetService.updateBudget(editingBudget.id, {
        limit: parseFloat(editingBudget.limit),
        alertThreshold: parseInt(editingBudget.alertThreshold),
      });
      toast.success("Budget updated successfully");
      setShowEditModal(false);
      setEditingBudget(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update budget");
      console.error(error);
    }
  };

  // Delete budget
  const handleDeleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetService.deleteBudget(id);
        toast.success("Budget deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete budget");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Budget Alerts */}
        <div className="space-y-4">
          {budgets.map(
            (budget) =>
              budget.spent > budget.limit && (
                <div
                  key={budget.id}
                  className="flex items-center space-x-2 bg-[#FFF2F0] border border-[#FFCCC7] text-[#FF4D4F] px-4 py-3 rounded-lg"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <p>
                    {budget.category.name} budget exceeded by {budget.currency}
                    {(budget.spent - budget.limit).toFixed(2)}! You've spent{" "}
                    {budget.currency}
                    {budget.spent} out of {budget.currency}
                    {budget.limit} budget.
                  </p>
                </div>
              )
          )}
        </div>

        {/* Budget Overview */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Budget Overview</h2>
          <button
            onClick={() => setShowAddBudget(true)}
            className="bg-[#1677FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Set New Budget</span>
          </button>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            budgets.map((budget) => (
              <Card key={budget.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-black font-bold">
                    {budget.category.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBudget(budget)}
                      className="p-2 hover:bg-blue-100 rounded-full"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Main Category Budget */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-black">Total Budget:</span>
                        <span className="font-medium text-black">
                          {budget.currency}
                          {budget.limit}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-black">Spent:</span>
                        <span
                          className={
                            budget.spent > budget.limit
                              ? "text-[#FF4D4F] font-medium"
                              : "text-black font-medium"
                          }
                        >
                          {budget.currency}
                          {budget.spent}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            budget.spent > budget.limit
                              ? "bg-[#FF4D4F]"
                              : budget.spent / budget.limit >
                                budget.alertThreshold / 100
                              ? "bg-[#FAAD14]"
                              : "bg-[#52C41A]"
                          }`}
                          style={{
                            width: `${Math.min(
                              (budget.spent / budget.limit) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Alert at {budget.alertThreshold}% of budget
                      </div>
                    </div>

                    {/* Subcategories */}
                    {budget.subcategoryBudgets?.length > 0 && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-medium text-black">
                          Subcategories
                        </h4>
                        {budget.subcategoryBudgets.map((sub, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-black">
                                {sub.subcategory.name}
                              </span>
                              <span
                                className={
                                  sub.spent > sub.limit
                                    ? "text-[#FF4D4F] font-medium"
                                    : "text-black font-medium"
                                }
                              >
                                {budget.currency}
                                {sub.spent} / {budget.currency}
                                {sub.limit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  sub.spent > sub.limit
                                    ? "bg-[#FF4D4F]"
                                    : sub.spent / sub.limit > 0.8
                                    ? "bg-[#FAAD14]"
                                    : "bg-[#52C41A]"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (sub.spent / sub.limit) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Budget Modal */}
        {showAddBudget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-black font-bold">
                  Set Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBudget} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      value={newBudget.categoryId}
                      onChange={(e) =>
                        setNewBudget({
                          ...newBudget,
                          categoryId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Budget Limit
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      value={newBudget.limit}
                      onChange={(e) =>
                        setNewBudget({ ...newBudget, limit: e.target.value })
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Alert Threshold (%)
                    </label>
                    <input
                      type="number"
                      placeholder="80"
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      value={newBudget.alertThreshold}
                      onChange={(e) =>
                        setNewBudget({
                          ...newBudget,
                          alertThreshold: e.target.value,
                        })
                      }
                      required
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddBudget(false)}
                      className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1677FF] text-white rounded-lg hover:bg-blue-600"
                    >
                      Save Budget
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Budget Modal */}
        {showEditModal && editingBudget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-black font-bold">
                  Edit Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateBudget} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Budget Limit
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      value={editingBudget.limit}
                      onChange={(e) =>
                        setEditingBudget({
                          ...editingBudget,
                          limit: e.target.value,
                        })
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Alert Threshold (%)
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      value={editingBudget.alertThreshold}
                      onChange={(e) =>
                        setEditingBudget({
                          ...editingBudget,
                          alertThreshold: e.target.value,
                        })
                      }
                      required
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingBudget(null);
                      }}
                      className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Update Budget
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
