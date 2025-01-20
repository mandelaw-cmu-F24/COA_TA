"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../app/components/ui/card";
import { Alert, AlertDescription } from "../app/components/ui/alert";
import { api, dashboardService } from "../app/services/api";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("this-month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState({
    income: { balance: 0, todayIncome: 0, monthlyIncome: 0 },
    bank: { balance: 0, todayTransactions: 0, monthlyTransactions: 0 },
    mobileMoney: { balance: 0, todayTransactions: 0, monthlyTransactions: 0 },
    cash: { balance: 0, todayTransactions: 0, monthlyTransactions: 0 },
  });
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("timeRange", timeRange);
      if (timeRange === "custom") {
        params.append("dateFrom", dateFrom);
        params.append("dateTo", dateTo);
      }

      const response = await dashboardService.getDashboardData(
        timeRange,
        dateFrom,
        dateTo
      );
      console.log("Dashboard Response:", response.data);

      if (response.data && response.data.data) {
        const dashboardData = response.data.data;

        if (dashboardData.accounts) {
          setAccountData(dashboardData.accounts);
        } else {
          console.error("Invalid dashboard data structure:", dashboardData);
          toast.error("Invalid data received from server");
        }

        setBudgetAlerts(dashboardData.budgetAlerts || []);
      } else {
        console.error("Invalid response structure:", response);
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, dateFrom, dateTo]);

  useEffect(() => {
    console.log("Current accountData:", accountData);
  }, [accountData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getTransactionColor = (amount) => {
    return amount >= 0 ? "text-[#52C41A]" : "text-[#FF4D4F]";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Budget Alerts */}
      {budgetAlerts.map((alert, index) => (
        <Alert key={index} variant="warning">
          <AlertDescription className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <p>{alert.message}</p>
          </AlertDescription>
        </Alert>
      ))}

      {/* Time Range Selector */}
      <div className="flex items-center space-x-4">
        <select
          className="border rounded-lg px-4 py-2 bg-white"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {timeRange === "custom" && (
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
      </div>

      {/* Account Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income Account */}
        <Card>
          <CardHeader>
            <CardTitle>Income Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(accountData.income.balance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Income:</span>
                <span
                  className={getTransactionColor(
                    accountData.income.todayIncome
                  )}
                >
                  {accountData.income.todayIncome >= 0 ? "+" : ""}
                  {formatCurrency(accountData.income.todayIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  This {timeRange === "this-month" ? "Month" : "Period"}:
                </span>
                <span
                  className={getTransactionColor(
                    accountData.income.monthlyIncome
                  )}
                >
                  {accountData.income.monthlyIncome >= 0 ? "+" : ""}
                  {formatCurrency(accountData.income.monthlyIncome)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(accountData.bank.balance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Transactions:</span>
                <span
                  className={getTransactionColor(
                    accountData.bank.todayTransactions
                  )}
                >
                  {accountData.bank.todayTransactions >= 0 ? "+" : ""}
                  {formatCurrency(accountData.bank.todayTransactions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  This {timeRange === "this-month" ? "Month" : "Period"}:
                </span>
                <span
                  className={getTransactionColor(
                    accountData.bank.monthlyTransactions
                  )}
                >
                  {accountData.bank.monthlyTransactions >= 0 ? "+" : ""}
                  {formatCurrency(accountData.bank.monthlyTransactions)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Money */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Money</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(accountData.mobileMoney.balance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Transactions:</span>
                <span
                  className={getTransactionColor(
                    accountData.mobileMoney.todayTransactions
                  )}
                >
                  {accountData.mobileMoney.todayTransactions >= 0 ? "+" : ""}
                  {formatCurrency(accountData.mobileMoney.todayTransactions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  This {timeRange === "this-month" ? "Month" : "Period"}:
                </span>
                <span
                  className={getTransactionColor(
                    accountData.mobileMoney.monthlyTransactions
                  )}
                >
                  {accountData.mobileMoney.monthlyTransactions >= 0 ? "+" : ""}
                  {formatCurrency(accountData.mobileMoney.monthlyTransactions)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Account */}
        <Card>
          <CardHeader>
            <CardTitle>Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(accountData.cash.balance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Transactions:</span>
                <span
                  className={getTransactionColor(
                    accountData.cash.todayTransactions
                  )}
                >
                  {accountData.cash.todayTransactions >= 0 ? "+" : ""}
                  {formatCurrency(accountData.cash.todayTransactions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  This {timeRange === "this-month" ? "Month" : "Period"}:
                </span>
                <span
                  className={getTransactionColor(
                    accountData.cash.monthlyTransactions
                  )}
                >
                  {accountData.cash.monthlyTransactions >= 0 ? "+" : ""}
                  {formatCurrency(accountData.cash.monthlyTransactions)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
