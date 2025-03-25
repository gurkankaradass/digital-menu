const express = require("express");
const cors = require("cors");
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const cafeRoutes = require("./routes/cafe");
const employeeRoutes = require("./routes/employee");
const tableRoutes = require("./routes/table");
const orderRoutes = require("./routes/order");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Çalışıyor...");
});

app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cafe", cafeRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/order", orderRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});