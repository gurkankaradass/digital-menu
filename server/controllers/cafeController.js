const { sql, poolPromise } = require("../config/db");

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

const updateCafeInfo = async (req, res) => {
    const { id } = req.params;
    const { name, logo, phone, location, address, map, instagram } = req.body;

    if (!name || !logo || !phone || !location || !address || !map || !instagram) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar, name)
            .input("logo", sql.NVarChar, logo)
            .input("phone", sql.NVarChar, phone)
            .input("location", sql.NVarChar, location)
            .input("address", sql.NVarChar, address)
            .input("map", sql.NVarChar, map)
            .input("instagram", sql.NVarChar, instagram)
            .query(`UPDATE Cafe_Info 
            SET 
                name = @name,
                logo = @logo,
                phone = @phone,
                location = @location,
                address = @address,
                map = @map,
                instagram = @instagram
            WHERE id = @id`)

        // Güncellenen bilgileri veritabanından al
        const updatedCafeInfo = await pool.request()
            .input("id", sql.Int, id)
            .query(`SELECT * FROM Cafe_Info WHERE id = @id`);

        // Güncellenen veriyi döndür
        res.status(200).json({
            message: "Cafe Bilgileri Güncellendi...",
            updatedCafeInfo: updatedCafeInfo.recordset[0]  // Güncellenen veriyi dönüyoruz
        });

    } catch (error) {
        console.error("Güncelleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getCafeInfo,
    updateCafeInfo
}