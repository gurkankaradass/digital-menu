const express = require("express");
const { orderProduct } = require("../controllers/orderController");
const router = express.Router();

router.post("/orderProduct", orderProduct);

module.exports = router;