const express = require("express");
const router = express.Router();
const { getProductByCategoryName, deleteProduct } = require("../controllers/productsController");


router.get("/:categoryName", getProductByCategoryName);
router.delete("/delete/:id", deleteProduct);


module.exports = router;