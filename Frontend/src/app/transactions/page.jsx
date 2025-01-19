"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Plus, Clock } from "lucide-react";

export default function TransactionsPage() {
  const [transactions] = useState([
    {
      id: 1,
      date: "2024-01-14",
      description: "Monthly Salary",
      amount: 2800.0,
      type: "income",
      account: "Bank Account",
      category: "Salary",
    },
    {
      id: 2,
      date: "2024-01-14",
      description: "Grocery Shopping",
      amount: -125.0,
      type: "expense",
      account: "Bank Account",
      category: "Food & Groceries",
    },
    {
      id: 3,
      date: "2024-01-14",
      description: "Bus Ticket",
      amount: -45.0,
      type: "expense",
      account: "Mobile Money",
      category: "Transportation",
    },
    {
      id: 4,
      date: "2024-01-14",
      description: "Coffee",
      amount: -20.0,
      type: "expense",
      account: "Cash",
      category: "Food & Dining",
    },
  ]);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Form states
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    account: "Bank Account",
    category: "Food & Groceries",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add transaction logic here
    setShowAddTransaction(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Filters and Add Transaction */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <select
              className="border rounded-lg px-4 py-2 text-gray-900 bg-white"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="all" className="text-gray-900">
                All Accounts
              </option>
              <option value="Bank Account" className="text-gray-900">
                Bank Account
              </option>
              <option value="Mobile Money" className="text-gray-900">
                Mobile Money
              </option>
              <option value="Cash" className="text-gray-900">
                Cash
              </option>
            </select>

            <select
              className="border rounded-lg px-4 py-2 text-gray-900 bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all" className="text-gray-900">
                All Types
              </option>
              <option value="income" className="text-gray-900">
                Income
              </option>
              <option value="expense" className="text-gray-900">
                Expense
              </option>
            </select>
          </div>

          <button
            onClick={() => setShowAddTransaction(true)}
            className="bg-[#1677FF] text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Transactions List */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-gray-900">All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions
                .filter(
                  (t) =>
                    selectedAccount === "all" || t.account === selectedAccount
                )
                .filter(
                  (t) => selectedType === "all" || t.type === selectedType
                )
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {transaction.description}
                          </span>
                          <span className="text-sm text-gray-700">
                            • {transaction.account}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          Category: {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === "income"
                            ? "text-[#52C41A]"
                            : "text-[#FF4D4F]"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}
                        {transaction.amount.toFixed(2)}€
                      </p>
                      <p className="text-sm text-gray-700">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-gray-900">
                  Add New Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-gray-900"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full border rounded-lg px-4 py-2 text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account
                    </label>
                    <select
                      name="account"
                      value={formData.account}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-gray-900"
                    >
                      <option value="Bank Account">Bank Account</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-gray-900"
                    >
                      <option value="Salary">Salary</option>
                      <option value="Food & Groceries">Food & Groceries</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Housing">Housing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Transaction description"
                      className="w-full border rounded-lg px-4 py-2 text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-gray-900"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddTransaction(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1677FF] text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Transaction
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
