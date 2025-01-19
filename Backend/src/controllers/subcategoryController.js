const subcategoryService = require("../services/subcategoryService");

const subcategoryController = {
  async getAllSubcategories(req, res) {
    try {
      const subcategories = await subcategoryService.findAll();
      res.json({
        message: "Subcategories retrieved successfully",
        data: subcategories,
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  },

  async getSubcategoriesByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const subcategories = await subcategoryService.findByCategory(categoryId);
      res.json({
        message: "Subcategories retrieved successfully",
        data: subcategories,
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  },

  async createSubcategory(req, res) {
    try {
      const { name, budget, categoryId } = req.body;

      if (!name || !budget || !categoryId) {
        return res.status(400).json({
          message: "Name, budget, and categoryId are required fields",
        });
      }

      const subcategory = await subcategoryService.create({
        name,
        budget,
        categoryId,
      });

      res.status(201).json({
        message: "Subcategory created successfully",
        data: subcategory,
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      res.status(500).json({
        message: "Error creating subcategory",
        error: error.message,
      });
    }
  },

  async updateSubcategory(req, res) {
    try {
      const { id } = req.params;
      const { name, budget } = req.body;

      const updatedSubcategory = await subcategoryService.update(id, {
        name,
        budget,
      });

      res.json({
        message: "Subcategory updated successfully",
        data: updatedSubcategory,
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({
        message: "Error updating subcategory",
        error: error.message,
      });
    }
  },

  async deleteSubcategory(req, res) {
    try {
      const { id } = req.params;
      await subcategoryService.delete(id);

      res.json({
        message: "Subcategory deleted successfully",
        data: { id },
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({
        message: "Error deleting subcategory",
        error: error.message,
      });
    }
  },
};

module.exports = subcategoryController;
