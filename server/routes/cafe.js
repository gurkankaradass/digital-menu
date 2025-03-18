const express = require("express");
const { getCafeInfo, updateCafeInfo } = require("../controllers/cafeController");
const router = express.Router();


router.get("/", getCafeInfo);
router.put("/update/:id", updateCafeInfo);


module.exports = router;