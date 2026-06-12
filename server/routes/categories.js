const express = require("express");
const { getAllCategories, addNewCategory, deleteCategory, updateCategory } = require("../controllers/categoriesController");
const upload = require("../middleware/upload");
const router = express.Router();


router.get("/", getAllCategories);
router.post("/addNewCategory", upload.single("image"), addNewCategory);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:id", upload.single("image"), updateCategory);

module.exports = router;