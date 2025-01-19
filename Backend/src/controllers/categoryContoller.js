const { Category, Subcategory } = require("../models");

const categoryController = {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll({
        include: [{ model: Subcategory, as: "subcategories" }],
      });
      res.json({
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        message: "Error fetching categories",
        error: error.message,
      });
    }
  },

  async createCategory(req, res) {
    try {
      console.log("Received request body:", req.body);

      const { name, icon, color } = req.body;

      // input validation
      if (!name || !icon || !color) {
        return res.status(400).json({
          message: "Name, icon, and color are required fields",
        });
      }

      const category = await Category.create({ name, icon, color });

      res.status(201).json({
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        message: "Error creating category",
        error: error.message,
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, icon, color } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      await Category.update({ name, icon, color }, { where: { id } });
      res.json({
        message: "Category updated successfully",
        data: { id, name, icon, color },
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({
        message: "Error updating category",
        error: error.message,
      });
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      await Category.destroy({ where: { id } });
      res.json({
        message: "Category deleted successfully",
        data: { id },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({
        message: "Error deleting category",
        error: error.message,
      });
    }
  },
};

module.exports = categoryController;
