const { sql, poolPromise } = require("../config/db")

const getAllTables = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Tables");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Masa Bulunamadı..." });
        }

        res.json(result.recordset);
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
};

const addNewTable = async (req, res) => {
    const { table_number } = req.body

    if (!table_number) {
        return res.status(400).json({ message: "Gerekli Alan Doldurulmalıdır..." })
    }

    try {
        const pool = await poolPromise;

        const checkTable = await pool.request()
            .input("table_number", sql.Int, table_number)
            .query("SELECT id FROM Tables WHERE table_number = @table_number");

        if (checkTable.recordset.length > 0) {
            return res.status(400).json({ message: "Masa Zaten Mevcut" });;
        }

        await pool.request()
            .input("table_number", sql.Int, table_number)
            .query(`INSERT INTO Tables (table_number) VALUES (@table_number)`)

        const newTables = await pool.request()
            .query("SELECT * FROM Tables");

        res.status(200).json({
            message: "Masa Eklendi...",
            newTables: newTables.recordset
        })

    } catch (error) {
        console.error("Masa Ekleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteTable = async (req, res) => {
    const { id } = req.params;

    try {

        const pool = await poolPromise;
        const checkTable = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id FROM Tables WHERE id = @id");

        if (checkTable.length === 0) {
            return res.status(404).json({ message: "Masa Bulunamadı..." });
        }

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Tables WHERE id = @id");

        const newTables = await pool.request()
            .query("SELECT * FROM Tables");

        res.status(200).json({
            message: "Masa Başarıyla Silindi...",
            newTables: newTables.recordset
        })
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getAllTables,
    addNewTable,
    deleteTable
}