const pool = require("../config/db");

const getAllTables = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Tables"');

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Masa Bulunamadı..." });
        }

        res.json(result.rows);
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
        const checkTable = await pool.query(
            'SELECT id FROM "Tables" WHERE table_number = $1',
            [table_number]
        );

        if (checkTable.rows.length > 0) {
            return res.status(400).json({ message: "Masa Zaten Mevcut" });
        }

        await pool.query(
            'INSERT INTO "Tables" (table_number) VALUES ($1)',
            [table_number]
        );

        const newTables = await pool.query('SELECT * FROM "Tables"');

        res.status(200).json({
            message: "Masa Eklendi...",
            newTables: newTables.rows
        })

    } catch (error) {
        console.error("Masa Ekleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteTable = async (req, res) => {
    const { id } = req.params;

    try {
        const checkTable = await pool.query(
            'SELECT id FROM "Tables" WHERE id = $1',
            [id]
        );

        if (checkTable.rows.length === 0) {
            return res.status(404).json({ message: "Masa Bulunamadı..." });
        }

        await pool.query('DELETE FROM "Tables" WHERE id = $1', [id]);

        const newTables = await pool.query('SELECT * FROM "Tables"');

        res.status(200).json({
            message: "Masa Başarıyla Silindi...",
            newTables: newTables.rows
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