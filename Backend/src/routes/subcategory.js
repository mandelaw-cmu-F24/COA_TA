const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/subcategoryController");

// Get all subcategories
router.get("/", subcategoryController.getAllSubcategories);

// Get subcategories by category
router.get(
  "/category/:categoryId",
  subcategoryController.getSubcategoriesByCategory
);

// Create new subcategory
router.post("/", subcategoryController.createSubcategory);

// Update subcategory
router.put("/:id", subcategoryController.updateSubcategory);

// Delete subcategory
router.delete("/:id", subcategoryController.deleteSubcategory);

module.exports = router;
