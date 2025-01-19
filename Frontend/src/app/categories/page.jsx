"use client";

import { useState } from "react";
import {
  Home,
  Utensils,
  Car,
  Plus,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryBudget, setNewSubcategoryBudget] = useState("");

  const categories = [
    {
      id: 1,
      name: "Housing",
      icon: <Home className="w-5 h-5" />,
      color: "#1677FF",
      subcategories: [
        { id: 1, name: "Rent", budget: 1200 },
        { id: 2, name: "Utilities", budget: 200 },
        { id: 3, name: "Maintenance", budget: 150 },
      ],
    },
    {
      id: 2,
      name: "Food & Dining",
      icon: <Utensils className="w-5 h-5" />,
      color: "#52C41A",
      subcategories: [
        { id: 4, name: "Groceries", budget: 400 },
        { id: 5, name: "Restaurants", budget: 200 },
        { id: 6, name: "Coffee Shops", budget: 50 },
      ],
    },
    {
      id: 3,
      name: "Transportation",
      icon: <Car className="w-5 h-5" />,
      color: "#FAAD14",
      subcategories: [
        { id: 7, name: "Public Transit", budget: 100 },
        { id: 8, name: "Fuel", budget: 150 },
        { id: 9, name: "Car Maintenance", budget: 100 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        // Categories List
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 px-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-black">{category.icon}</div>
                  <span className="text-black font-medium">
                    {category.name}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>
        // Subcategories
        {selectedCategory && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {categories.find((c) => c.id === selectedCategory)?.name}{" "}
                Subcategories
              </CardTitle>
              <button
                onClick={() => setShowAddSubcategory(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories
                .find((c) => c.id === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="text-black font-medium">
                        {subcategory.name}
                      </div>
                      <div className="text-gray-500">
                        Budget: €{subcategory.budget}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
        // Add Category Modal
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Category name"
                    className="w-full p-3 border rounded-lg"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        // Add Subcategory Modal
        {showAddSubcategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Subcategory</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Subcategory name"
                    className="w-full p-3 border rounded-lg"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Budget amount"
                    className="w-full p-3 border rounded-lg"
                    value={newSubcategoryBudget}
                    onChange={(e) => setNewSubcategoryBudget(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSubcategory(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
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
