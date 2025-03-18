const { sql, poolPromise } = require("../config/db");

const getProductByCategoryName = async (req, res) => {
    const categoryName = req.params.categoryName;

    if (!categoryName) {
        return res.status(400).json({ message: "Kategori Adı Gereklidir..." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('categoryName', sql.NVarChar, categoryName)
            .query('SELECT p.id, p.name, p.image, p.price, c.name AS categoryName FROM Products p JOIN Categories c ON p.category_id = c.id WHERE c.name = @categoryName');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Bu Kategoriye Ait Ürün Bulunamadı..." });
        }

        res.json(result.recordset);

    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {

        const pool = await poolPromise;
        const checkProduct = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id FROM Products WHERE id = @id");

        if (checkProduct.length === 0) {
            return res.status(404).json({ message: "Ürün Bulunamadı..." });
        }

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Products WHERE id = @id");

        res.status(200).json({ message: "Ürün Başarıyla Silindi" });
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, image, price, categoryName } = req.body;

    if (!name || !image || !price || !categoryName) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        const pool = await poolPromise;

        let formattedPrice = price;

        if (formattedPrice % 1 === 0) {
            formattedPrice = `${formattedPrice}.00`;
        }

        formattedPrice = parseFloat(formattedPrice).toFixed(2);

        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar, name)
            .input("image", sql.NVarChar, image)
            .input("price", sql.Decimal(10, 2), formattedPrice)
            .input("categoryName", sql.NVarChar, categoryName)
            .query(`UPDATE Products 
            SET 
                name = @name,
                image = @image,
                price = @price,
                category_id = (SELECT id FROM Categories WHERE name = @categoryName)
            WHERE id = @id`)

        res.status(201).json({ message: "Ürün Güncellendi..." });
    } catch (error) {
        console.error("Ürün Güncelleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getProductByCategoryName,
    deleteProduct,
    updateProduct
}