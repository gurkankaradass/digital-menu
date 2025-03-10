const express = require("express");
const { getCafeInfo } = require("../controllers/cafeController");
const router = express.Router();


router.get("/", getCafeInfo);


module.exports = router;