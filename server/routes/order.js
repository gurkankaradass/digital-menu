const express = require("express");
const { getOrderByTableNumber, orderProduct, deleteOrder } = require("../controllers/orderController");
const router = express.Router();

router.get("/:table_number", getOrderByTableNumber)
router.post("/orderProduct", orderProduct);
router.delete("/deleteOrder", deleteOrder);

module.exports = router;