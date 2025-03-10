const { sql, poolPromise } = require("../config/db");

const getProductByCategory = async (req, res) => {
    const categoryName = req.params.categoryName;

    if (!categoryName) {
        return res.status(400).json({ message: "Kategori Adı Gereklidir..." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('categoryName', sql.NVarChar, categoryName)
            .query('SELECT p.*, c.name AS categoryName FROM Products p JOIN Categories c ON p.category_id = c.id WHERE c.name = @categoryName');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Bu Kategoriye Ait Ürün Bulunamadı..." });
        }

        res.json(result.recordset);

    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getProductByCategory
}