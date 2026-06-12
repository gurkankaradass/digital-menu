const pool = require("../config/db");

const getImageUrl = (req, path) => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${req.protocol}://${req.get('host')}/${path}`;
};

const getCafeInfo = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Cafe_Info" WHERE id = 1');

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cafe Bilgilerine Ulaşılamadı..." });
        }

        const cafe = result.rows[0];
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
        await pool.query(
            `UPDATE "Cafe_Info" 
            SET 
                name = $1,
                logo = $2,
                phone = $3,
                location = $4,
                address = $5,
                map = $6,
                instagram = $7
            WHERE id = $8`,
            [name, logoPath, phone, location, address, map, instagram, id]
        );

        // Güncellenen bilgileri veritabanından al
        const updatedCafeInfo = await pool.query(
            `SELECT * FROM "Cafe_Info" WHERE id = $1`,
            [id]
        );

        const cafe = updatedCafeInfo.rows[0];
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