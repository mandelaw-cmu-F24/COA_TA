"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Plus, Clock, Pencil, Trash2 } from "lucide-react";
import { transactionService, categoryService } from "../services/api";
import { toast } from "react-hot-toast";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    account: "Bank Account",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAllTransactions({
        account: selectedAccount,
        type: selectedType,
      });
      setTransactions(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data.data);
      if (response.data.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category: response.data.data[0].name,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [selectedAccount, selectedType]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find(
        (c) => c.name === formData.category
      );
      const response = await transactionService.createTransaction({
        ...formData,
        amount:
          formData.type === "expense"
            ? -Math.abs(parseFloat(formData.amount))
            : Math.abs(parseFloat(formData.amount)),
        category: selectedCategory?.name,
        categoryId: selectedCategory?.id,
      });

      if (response.data.budgetAlert) {
        if (response.data.budgetAlert.type === "exceeded") {
          toast.error(response.data.budgetAlert.message, {
            duration: 120000, // 2 minutes
            style: {
              border: "1px solid #FF4D4F",
              padding: "16px",
              color: "#FF4D4F",
            },
          });
        } else {
          toast.warning(response.data.budgetAlert.message, {
            duration: 120000, // 2 minutes
            style: {
              border: "1px solid #faad14",
              padding: "16px",
              color: "#faad14",
            },
          });
        }
      }

      toast.success("Transaction created successfully");
      setShowAddTransaction(false);
      setFormData({
        type: "expense",
        amount: "",
        account: "Bank Account",
        category: categories.length > 0 ? categories[0].name : "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchTransactions();
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find(
        (c) => c.name === formData.category
      );
      const response = await transactionService.updateTransaction(
        editingTransaction.id,
        {
          ...formData,
          amount:
            formData.type === "expense"
              ? -Math.abs(parseFloat(formData.amount))
              : Math.abs(parseFloat(formData.amount)),
          category: selectedCategory?.name,
          categoryId: selectedCategory?.id,
        }
      );

      if (response.data.budgetAlert) {
        if (response.data.budgetAlert.type === "exceeded") {
          toast.error(response.data.budgetAlert.message, {
            duration: 120000, // 2 minutes
            style: {
              border: "1px solid #FF4D4F",
              padding: "16px",
              color: "#FF4D4F",
            },
          });
        } else {
          toast.warning(response.data.budgetAlert.message, {
            duration: 120000, // 2 minutes
            style: {
              border: "1px solid #faad14",
              padding: "16px",
              color: "#faad14",
            },
          });
        }
      }

      toast.success("Transaction updated successfully");
      setShowAddTransaction(false);
      setEditingTransaction(null);
      setFormData({
        type: "expense",
        amount: "",
        account: "Bank Account",
        category: categories.length > 0 ? categories[0].name : "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchTransactions();
    } catch (error) {
      toast.error("Failed to update transaction");
      console.error(error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      ...transaction,
      amount: Math.abs(transaction.amount),
      category: transaction.category,
    });
    setShowAddTransaction(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.deleteTransaction(id);
        toast.success("Transaction deleted successfully");
        fetchTransactions();
      } catch (error) {
        toast.error("Failed to delete transaction");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Filters and Add Transaction */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <select
              className="border rounded-lg px-4 py-2 text-black bg-white"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="all">All Accounts</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Cash">Cash</option>
            </select>

            <select
              className="border rounded-lg px-4 py-2 text-black bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setFormData({
                type: "expense",
                amount: "",
                account: "Bank Account",
                category: categories.length > 0 ? categories[0].name : "",
                description: "",
                date: new Date().toISOString().split("T")[0],
              });
              setShowAddTransaction(true);
            }}
            className="bg-[#1677FF] text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Transactions List */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-black font-bold">
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="w-5 h-5 text-black" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-black">
                            {transaction.description}
                          </span>
                          <span className="text-sm text-black">
                            • {transaction.account}
                          </span>
                        </div>
                        <div className="text-sm text-black">
                          Category:{" "}
                          {transaction.categoryAssociation?.name ||
                            transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            transaction.type === "income"
                              ? "text-[#52C41A]"
                              : "text-[#FF4D4F]"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : ""}
                          {Math.abs(transaction.amount).toFixed(2)}€
                        </p>
                        <p className="text-sm text-black">{transaction.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 hover:bg-blue-100 rounded-full"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-black font-bold">
                  {editingTransaction
                    ? "Edit Transaction"
                    : "Add New Transaction"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingTransaction ? handleUpdate : handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-black"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Account
                    </label>
                    <select
                      name="account"
                      value={formData.account}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-black"
                    >
                      <option value="Bank Account">Bank Account</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Transaction description"
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 text-black"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTransaction(false);
                        setEditingTransaction(null);
                      }}
                      className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1677FF] text-white rounded-lg hover:bg-blue-600"
                    >
                      {editingTransaction ? "Update" : "Add"} Transaction
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
