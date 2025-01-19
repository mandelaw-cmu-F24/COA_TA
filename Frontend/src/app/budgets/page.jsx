"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertCircle, Plus, Edit2, AlertTriangle } from "lucide-react";

export default function BudgetsPage() {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [budgets] = useState([
    {
      id: 1,
      category: "Housing",
      limit: 1200,
      spent: 1000,
      currency: "€",
      subcategories: [
        { name: "Rent", limit: 1000, spent: 900 },
        { name: "Utilities", limit: 200, spent: 100 },
      ],
    },
    {
      id: 2,
      category: "Food & Dining",
      limit: 500,
      spent: 650, // Exceeded
      currency: "€",
      subcategories: [
        { name: "Groceries", limit: 300, spent: 400 },
        { name: "Restaurants", limit: 200, spent: 250 },
      ],
    },
    {
      id: 3,
      category: "Transportation",
      limit: 200,
      spent: 180,
      currency: "€",
      subcategories: [
        { name: "Public Transit", limit: 100, spent: 80 },
        { name: "Fuel", limit: 100, spent: 100 },
      ],
    },
  ]);

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
                    {budget.category} budget exceeded by {budget.currency}
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
          <h2 className="text-xl font-semibold text-gray-900">
            Budget Overview
          </h2>
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
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900">
                  {budget.category}
                </CardTitle>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Main Category Budget */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total Budget:</span>
                      <span className="font-medium">
                        {budget.currency}
                        {budget.limit}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Spent:</span>
                      <span
                        className={
                          budget.spent > budget.limit
                            ? "text-[#FF4D4F] font-medium"
                            : "text-gray-900"
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
                            : budget.spent / budget.limit > 0.8
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
                  </div>

                  {/* Subcategories */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900">
                      Subcategories
                    </h4>
                    {budget.subcategories.map((sub, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{sub.name}</span>
                          <span
                            className={
                              sub.spent > sub.limit
                                ? "text-[#FF4D4F]"
                                : "text-gray-900"
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Budget Modal */}
        {showAddBudget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Set Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="w-full border rounded-lg px-4 py-2 text-gray-900">
                      <option>Housing</option>
                      <option>Food & Dining</option>
                      <option>Transportation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Limit
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alert Threshold (%)
                    </label>
                    <input
                      type="number"
                      placeholder="80"
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddBudget(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
      </div>
    </div>
  );
}
