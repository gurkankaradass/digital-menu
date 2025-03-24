const express = require("express");
const { getOrderByTableNumber, orderProduct } = require("../controllers/orderController");
const router = express.Router();

router.get("/:table_number", getOrderByTableNumber)
router.post("/orderProduct", orderProduct);

module.exports = router;