"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sample data - replace with actual data from your database
  const accountSummary = [
    {
      account: "Bank Account",
      income: 2800.0,
      expenses: -1250.0,
      balance: 3250.0,
    },
    {
      account: "Mobile Money",
      income: 500.0,
      expenses: -250.0,
      balance: 750.0,
    },
    {
      account: "Cash",
      income: 300.0,
      expenses: -150.0,
      balance: 250.0,
    },
  ];

  const categoryExpenses = [
    { name: "Housing", value: 1550 },
    { name: "Food & Dining", value: 650 },
    { name: "Transportation", value: 350 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Time Period Selection */}
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-lg px-4 py-2 text-gray-900 bg-white"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border rounded-lg pl-10 pr-4 py-2 bg-white"
                />
              </div>
              <span>to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border rounded-lg pl-10 pr-4 py-2 bg-white"
                />
              </div>
            </div>
          )}

          <button
            className="bg-[#1677FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            onClick={() => {
              /* Export report logic */
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountSummary.map((account, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-gray-900">
                  {account.account}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Income:</span>
                    <span className="text-[#52C41A]">
                      +€{account.income.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Expenses:</span>
                    <span className="text-[#FF4D4F]">
                      €{account.expenses.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-700">Balance:</span>
                    <span className="text-gray-900">
                      €{account.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={accountSummary}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="account" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#52C41A" name="Income" />
                    <Bar dataKey="expenses" fill="#FF4D4F" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Transactions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900">Detailed Report</CardTitle>
            <FileText className="w-5 h-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-700">Date</th>
                  <th className="text-left py-3 text-gray-700">Description</th>
                  <th className="text-left py-3 text-gray-700">Category</th>
                  <th className="text-left py-3 text-gray-700">Account</th>
                  <th className="text-right py-3 text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Sample transaction rows */}
                <tr>
                  <td className="py-3 text-gray-900">2024-01-14</td>
                  <td className="py-3 text-gray-900">Monthly Salary</td>
                  <td className="py-3 text-gray-900">Salary</td>
                  <td className="py-3 text-gray-900">Bank Account</td>
                  <td className="py-3 text-right text-[#52C41A]">+€2,800.00</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900">2024-01-14</td>
                  <td className="py-3 text-gray-900">Grocery Shopping</td>
                  <td className="py-3 text-gray-900">Food & Groceries</td>
                  <td className="py-3 text-gray-900">Bank Account</td>
                  <td className="py-3 text-right text-[#FF4D4F]">-€125.00</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
