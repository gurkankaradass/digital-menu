const express = require("express");
const router = express.Router();
const { getProductByCategoryName, deleteProduct, updateProduct, addNewProduct } = require("../controllers/productsController");


router.get("/:categoryName", getProductByCategoryName);
router.post("/addNewProduct", addNewProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);


module.exports = router;