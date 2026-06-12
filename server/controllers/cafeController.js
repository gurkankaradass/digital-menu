const pool = require("../config/db");
const supabase = require("../config/supabase");
const path = require("path");

const getImageUrl = (req, path) => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${req.protocol}://${req.get('host')}/${path}`;
};

const uploadToSupabase = async (file) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${base}-${uniqueSuffix}${ext}`;

    const { data, error } = await supabase.storage
        .from('cafe-resimleri')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

    if (error) {
        throw error;
    }

    const { data: publicUrlData } = supabase.storage
        .from('cafe-resimleri')
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
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
    const hasLogo = req.file || req.body.logo;

    if (!name || !hasLogo || !phone || !location || !address || !map || !instagram) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        let logoPath = req.body.logo;
        if (req.file) {
            logoPath = await uploadToSupabase(req.file);
        }
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