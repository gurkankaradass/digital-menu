const express = require("express");
const router = express.Router();
const { getProductByCategoryName, deleteProduct, updateProduct, addNewProduct, reorderProducts } = require("../controllers/productsController");
const upload = require("../middleware/upload");


router.get("/:categoryName", getProductByCategoryName);
router.post("/addNewProduct", upload.single("image"), addNewProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", upload.single("image"), updateProduct);
router.put("/reorder", reorderProducts);


module.exports = router;