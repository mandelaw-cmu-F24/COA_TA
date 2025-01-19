const { Category, Subcategory } = require("../models");

const categoryService = {
  async findAll() {
    return await Category.findAll({
      include: [{ model: Subcategory }],
    });
  },

  async create(categoryData) {
    return await Category.create(categoryData);
  },

  async update(id, categoryData) {
    return await Category.update(categoryData, {
      where: { id },
    });
  },

  async delete(id) {
    return await Category.destroy({
      where: { id },
    });
  },
};

module.exports = categoryService;
