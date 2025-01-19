"use client";

import { useState } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../app/components/ui/card";
import { Alert, AlertDescription } from "../app/components/ui/alert";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("this-month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Alert>
        <AlertDescription className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <p>
            Entertainment budget exceeded by €50! You've spent €250 out of €200
            budget.
          </p>
        </AlertDescription>
      </Alert>

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
      <div className="space-y-6">
        {/* Income Account */}
        <Card>
          <CardHeader>
            <CardTitle>Income Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">€5,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Income:</span>
                <span className="text-[#52C41A]">+€2,800.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="text-[#52C41A]">+€2,800.00</span>
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
                <span className="font-semibold text-gray-900">€3,250.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Transactions:</span>
                <span className="text-[#FF4D4F]">-€125.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="text-[#52C41A]">+€1,250.00</span>
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
                <span className="font-semibold text-gray-900">€750.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Transactions:</span>
                <span className="text-[#FF4D4F]">-€45.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="text-[#FF4D4F]">-€250.00</span>
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
                <span className="font-semibold text-gray-900">€250.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Transactions:</span>
                <span className="text-[#FF4D4F]">-€20.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="text-[#FF4D4F]">-€150.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
