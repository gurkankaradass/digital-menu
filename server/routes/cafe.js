const express = require("express");
const { getCafeInfo, updateCafeInfo } = require("../controllers/cafeController");
const upload = require("../middleware/upload");
const router = express.Router();


router.get("/", getCafeInfo);
router.put("/update/:id", upload.single("logo"), updateCafeInfo);


module.exports = router;