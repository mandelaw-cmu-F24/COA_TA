import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  FolderPlus,
  ChevronRight,
  PieChart,
  BarChart3,
  TrendingUp,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const CategoryManagement = () => {
  // State definitions
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Housing",
      icon: "🏠",
      subcategories: [
        { id: 1, name: "Rent", budget: 1200 },
        { id: 2, name: "Utilities", budget: 200 },
        { id: 3, name: "Maintenance", budget: 150 },
      ],
    },
    {
      id: 2,
      name: "Food & Dining",
      icon: "🍽️",
      subcategories: [
        { id: 4, name: "Groceries", budget: 400 },
        { id: 5, name: "Restaurants", budget: 200 },
        { id: 6, name: "Coffee Shops", budget: 50 },
      ],
    },
    {
      id: 3,
      name: "Transportation",
      icon: "🚗",
      subcategories: [
        { id: 7, name: "Public Transit", budget: 100 },
        { id: 8, name: "Fuel", budget: 150 },
        { id: 9, name: "Car Maintenance", budget: 100 },
      ],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  // Sample data
  const transactions = [
    {
      id: 1,
      date: "2024-01-10",
      amount: 45.5,
      description: "Grocery Shopping",
      category: "Food & Dining",
      subcategory: "Groceries",
      account: "Bank Account",
    },
    {
      id: 2,
      date: "2024-01-11",
      amount: 25.0,
      description: "Bus Ticket",
      category: "Transportation",
      subcategory: "Public Transit",
      account: "Mobile Money",
    },
  ];

  const categorySpending = [
    { name: "Housing", amount: 1550 },
    { name: "Food & Dining", amount: 650 },
    { name: "Transportation", amount: 350 },
  ];

  const monthlyTrend = [
    { month: "Jan", Housing: 1550, Food: 650, Transportation: 350 },
    { month: "Feb", Housing: 1500, Food: 700, Transportation: 380 },
    { month: "Mar", Housing: 1600, Food: 600, Transportation: 320 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Categories</CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsAddingCategory(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isAddingCategory && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={() => setIsAddingCategory(false)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subcategories */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {selectedCategory
                        ? `${selectedCategory.name} Subcategories`
                        : "Select a Category"}
                    </CardTitle>
                    {selectedCategory && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsAddingSubcategory(true)}
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedCategory && (
                    <div className="space-y-4">
                      {selectedCategory.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">
                                {subcategory.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Budget: €{subcategory.budget}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categorySpending}
                          dataKey="amount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {categorySpending.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Housing"
                          stroke={COLORS[0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="Food"
                          stroke={COLORS[1]}
                        />
                        <Line
                          type="monotone"
                          dataKey="Transportation"
                          stroke={COLORS[2]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categorySpending}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryManagement;
