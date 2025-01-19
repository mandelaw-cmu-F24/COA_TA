const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryContoller");

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
