const express = require("express");
const { getAllCategories, addNewCategory, deleteCategory, updateCategory } = require("../controllers/categoriesController");
const router = express.Router();


router.get("/", getAllCategories);
router.post("/addNewCategory", addNewCategory);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:id", updateCategory);

module.exports = router;