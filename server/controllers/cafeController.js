const { sql, poolPromise } = require("../config/db");

const getImageUrl = (req, path) => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${req.protocol}://${req.get('host')}/${path}`;
};

const getCafeInfo = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Cafe_Info WHERE id = 1');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Cafe Bilgilerine Ulaşılamadı..." });
        }

        const cafe = result.recordset[0];
        cafe.logo = getImageUrl(req, cafe.logo);

        res.json(cafe);

    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const updateCafeInfo = async (req, res) => {
    const { id } = req.params;
    const { name, phone, location, address, map, instagram } = req.body;
    const logoPath = req.file ? `uploads/${req.file.filename}` : req.body.logo;

    if (!name || !logoPath || !phone || !location || !address || !map || !instagram) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar, name)
            .input("logo", sql.NVarChar, logoPath)
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

        const cafe = updatedCafeInfo.recordset[0];
        cafe.logo = getImageUrl(req, cafe.logo);

        // Güncellenen veriyi döndür
        res.status(200).json({
            message: "Cafe Bilgileri Güncellendi...",
            updatedCafeInfo: cafe  // Güncellenen veriyi dönüyoruz
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