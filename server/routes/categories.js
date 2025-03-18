const express = require("express");
const { getAllCategories, addNewCategory } = require("../controllers/categoriesController");
const router = express.Router();


router.get("/", getAllCategories);
router.post("/addNewCategory", addNewCategory);

module.exports = router;