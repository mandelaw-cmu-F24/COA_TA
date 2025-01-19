const {
  Budget,
  Category,
  Subcategory,
  SubcategoryBudget,
} = require("../models");

const budgetService = {
  async findAll() {
    try {
      return await Budget.findAll({
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: SubcategoryBudget,
            as: "subcategoryBudgets",
            include: [
              {
                model: Subcategory,
                as: "subcategory",
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error fetching budgets: ${error.message}`);
    }
  },

  async findById(id) {
    try {
      return await Budget.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: SubcategoryBudget,
            as: "subcategoryBudgets",
            include: [
              {
                model: Subcategory,
                as: "subcategory",
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error fetching budget: ${error.message}`);
    }
  },

  async create(data) {
    try {
      const {
        categoryId,
        limit,
        currency,
        alertThreshold,
        subcategoryBudgets,
      } = data;

      const budget = await Budget.create({
        categoryId,
        limit,
        currency,
        alertThreshold,
      });

      if (subcategoryBudgets && subcategoryBudgets.length > 0) {
        await SubcategoryBudget.bulkCreate(
          subcategoryBudgets.map((sub) => ({
            budgetId: budget.id,
            subcategoryId: sub.subcategoryId,
            limit: sub.limit,
          }))
        );
      }

      return this.findById(budget.id);
    } catch (error) {
      throw new Error(`Error creating budget: ${error.message}`);
    }
  },

  async update(id, data) {
    try {
      const { limit, alertThreshold, subcategoryBudgets } = data;

      await Budget.update({ limit, alertThreshold }, { where: { id } });

      if (subcategoryBudgets) {
        await SubcategoryBudget.destroy({ where: { budgetId: id } });
        await SubcategoryBudget.bulkCreate(
          subcategoryBudgets.map((sub) => ({
            budgetId: id,
            subcategoryId: sub.subcategoryId,
            limit: sub.limit,
          }))
        );
      }

      return this.findById(id);
    } catch (error) {
      throw new Error(`Error updating budget: ${error.message}`);
    }
  },

  async updateSpent(id, spent) {
    try {
      await Budget.update({ spent }, { where: { id } });
      return this.findById(id);
    } catch (error) {
      throw new Error(`Error updating budget spent: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      await Budget.destroy({ where: { id } });
      return id;
    } catch (error) {
      throw new Error(`Error deleting budget: ${error.message}`);
    }
  },
};

module.exports = budgetService;
