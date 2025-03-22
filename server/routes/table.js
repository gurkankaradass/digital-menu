const express = require("express");
const { getAllTables, addNewTable, deleteTable } = require("../controllers/tableController");
const router = express.Router();

router.get("/", getAllTables);
router.post("/addNewTable", addNewTable);
router.delete("/delete/:id", deleteTable);

module.exports = router;