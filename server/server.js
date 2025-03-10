const express = require("express");
const cors = require("cors");
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const cafeRoutes = require("./routes/cafe");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Çalışıyor...");
});

app.use("/api/categories", categoriesRoutes);
app.use("api/products", productsRoutes);
app.use("api/cafe", cafeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} Portunda Çalışıyor...`)
});