const express = require("express");
const { login, addNewEmployee, deleteEmployee, getAllEmployees } = require("../controllers/employeeController");
const router = express.Router();

router.get("/", getAllEmployees);
router.post("/login", login);
router.post("/addNewEmployee", addNewEmployee);
router.delete("/delete/:id", deleteEmployee);

module.exports = router;