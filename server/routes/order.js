const express = require("express");
const { getOrderByTableNumber, orderProduct, deleteOrder, deleteAllOrder } = require("../controllers/orderController");
const router = express.Router();

router.get("/:table_number", getOrderByTableNumber)
router.post("/orderProduct", orderProduct);
router.delete("/deleteOrder", deleteOrder);
router.delete("/deleteAllOrder", deleteAllOrder);

module.exports = router;