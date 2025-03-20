const express = require("express");
const { login, addNewEmployee } = require("../controllers/employeeController");
const router = express.Router();

router.post("/login", login);
router.post("/addNewEmployee", addNewEmployee);

module.exports = router;