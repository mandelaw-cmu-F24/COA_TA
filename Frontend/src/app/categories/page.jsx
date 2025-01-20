"use client";

import { useState, useEffect } from "react";
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
import { categoryService, subcategoryService } from "../services/api";
import { toast } from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("Home");
  const [newCategoryColor, setNewCategoryColor] = useState("#1677FF");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryBudget, setNewSubcategoryBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory({
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor,
      });
      toast.success("Category created successfully");
      setShowAddCategory(false);
      fetchCategories();
      setNewCategoryName("");
      setNewCategoryIcon("Home");
      setNewCategoryColor("#1677FF");
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    try {
      await subcategoryService.create({
        name: newSubcategoryName,
        budget: parseFloat(newSubcategoryBudget),
        categoryId: selectedCategory,
      });
      toast.success("Subcategory created successfully");
      setShowAddSubcategory(false);
      fetchCategories();
      setNewSubcategoryName("");
      setNewSubcategoryBudget("");
    } catch (error) {
      toast.error("Failed to create subcategory");
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.deleteCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
        console.error(error);
      }
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await subcategoryService.delete(id);
        toast.success("Subcategory deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete subcategory");
        console.error(error);
      }
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Home: Home,
      Utensils: Utensils,
      Car: Car,
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-black text-xl font-bold">
              Categories
            </CardTitle>
            <button
              onClick={() => setShowAddCategory(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 text-black" />
            </button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              categories.map((category) => (
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
                    <div style={{ color: category.color }}>
                      {getIconComponent(category.icon)}
                    </div>
                    <span className="text-black font-semibold">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-black" />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {selectedCategory && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-black font-bold">
                {categories.find((c) => c.id === selectedCategory)?.name}{" "}
                Subcategories
              </CardTitle>
              <button
                onClick={() => setShowAddSubcategory(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 text-black" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories
                .find((c) => c.id === selectedCategory)
                ?.subcategories?.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="text-black font-semibold">
                        {subcategory.name}
                      </div>
                      <div className="text-gray-700">
                        Budget: €{subcategory.budget}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                        className="p-2 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-black font-bold">
                  Add New Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="Category name"
                      className="w-full p-3 border rounded-lg text-black"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Icon
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg text-black"
                      value={newCategoryIcon}
                      onChange={(e) => setNewCategoryIcon(e.target.value)}
                      required
                    >
                      <option value="Home">Home</option>
                      <option value="Utensils">Utensils</option>
                      <option value="Car">Car</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      className="w-full p-1 border rounded-lg h-12"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(false)}
                      className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Category
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {showAddSubcategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-black font-bold">
                  Add New Subcategory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSubcategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Subcategory Name
                    </label>
                    <input
                      type="text"
                      placeholder="Subcategory name"
                      className="w-full p-3 border rounded-lg text-black"
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Budget Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Budget amount"
                      className="w-full p-3 border rounded-lg text-black"
                      value={newSubcategoryBudget}
                      onChange={(e) => setNewSubcategoryBudget(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddSubcategory(false)}
                      className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Subcategory
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
