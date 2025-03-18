const express = require("express");
const router = express.Router();
const { getProductByCategoryName, deleteProduct, updateProduct } = require("../controllers/productsController");


router.get("/:categoryName", getProductByCategoryName);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);


module.exports = router;