const { poolPromise, sql } = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Categories');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Kategori Bulunamadı..." });
        }

        res.json(result.recordset);
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
}

const addNewCategory = async (req, res) => {
    const { name, image } = req.body;

    if (!name || !image) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." });
    }

    try {
        const pool = await poolPromise;

        const checkCategory = await pool.request()
            .input("name", sql.NVarChar, name)
            .query("SELECT id FROM Categories WHERE name = @name");

        if (checkCategory.recordset.length > 0) {
            return res.status(400).json({ message: "Kategori Zaten Mevcut" });;
        }

        await pool.request()
            .input("name", sql.NVarChar, name)
            .input("image", sql.NVarChar, image)
            .query("INSERT INTO Categories (name, image) VALUES (@name, @image)")

        const newCategories = await pool.request()
            .query("SELECT * FROM Categories");

        res.status(200).json({
            message: "Yeni Kategori Oluşturuldu...",
            newCategories: newCategories.recordset
        })
    } catch (error) {
        console.error("Kategori Oluşturma Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }

}

module.exports = {
    getAllCategories,
    addNewCategory
}