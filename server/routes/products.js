const express = require("express");
const router = express.Router();
const { getProductByCategoryName } = require("../controllers/productsController");


router.get("/:categoryName", getProductByCategoryName);


module.exports = router;