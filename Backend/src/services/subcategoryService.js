const { Subcategory, Category } = require("../models");

const subcategoryService = {
  async findAll() {
    try {
      return await Subcategory.findAll({
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error fetching subcategories: ${error.message}`);
    }
  },

  async findByCategory(categoryId) {
    try {
      return await Subcategory.findAll({
        where: { categoryId },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
    } catch (error) {
      throw new Error(
        `Error fetching subcategories by category: ${error.message}`
      );
    }
  },

  async findById(id) {
    try {
      return await Subcategory.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error fetching subcategory: ${error.message}`);
    }
  },

  async create(data) {
    try {
      const { name, budget, categoryId } = data;

      // Verify category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      return await Subcategory.create({
        name,
        budget,
        categoryId,
      });
    } catch (error) {
      throw new Error(`Error creating subcategory: ${error.message}`);
    }
  },

  async update(id, data) {
    try {
      const subcategory = await Subcategory.findByPk(id);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }

      const { name, budget } = data;
      return await subcategory.update({
        name,
        budget,
      });
    } catch (error) {
      throw new Error(`Error updating subcategory: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const subcategory = await Subcategory.findByPk(id);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }

      await subcategory.destroy();
      return id;
    } catch (error) {
      throw new Error(`Error deleting subcategory: ${error.message}`);
    }
  },
};

module.exports = subcategoryService;
