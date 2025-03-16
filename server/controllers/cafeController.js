const { poolPromise } = require("../config/db");

const getCafeInfo = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Cafe_Info WHERE id = 1');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Cafe Bilgilerine Ulaşılamadı..." });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getCafeInfo
}