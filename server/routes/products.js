const express = require("express");
const router = express.Router();
const { getProductByCategory } = require("../controllers/productsController");


router.get("/:categoryName", getProductByCategory);


module.exports = router;