const pool = require('../config/db');

const getImageUrl = (req, path) => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${req.protocol}://${req.get('host')}/${path}`;
};

const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Categories" ORDER BY sort_order ASC, id ASC');

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kategori Bulunamadı..." });
        }

        const categories = result.rows.map(cat => ({
            ...cat,
            image: getImageUrl(req, cat.image)
        }));

        res.json(categories);
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
}

const addNewCategory = async (req, res) => {
    const { name } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : req.body.image;

    if (!name || !imagePath) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." });
    }

    try {
        const checkCategory = await pool.query(
            'SELECT id FROM "Categories" WHERE name = $1',
            [name]
        );

        if (checkCategory.rows.length > 0) {
            return res.status(400).json({ message: "Kategori Zaten Mevcut" });
        }

        await pool.query(
            'INSERT INTO "Categories" (name, image) VALUES ($1, $2)',
            [name, imagePath]
        );

        const newCategories = await pool.query('SELECT * FROM "Categories" ORDER BY sort_order ASC, id ASC');

        const mappedCategories = newCategories.rows.map(cat => ({
            ...cat,
            image: getImageUrl(req, cat.image)
        }));

        res.status(200).json({
            message: "Yeni Kategori Oluşturuldu...",
            newCategories: mappedCategories
        })
    } catch (error) {
        console.error("Kategori Oluşturma Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }

}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const checkCategory = await pool.query(
            'SELECT id FROM "Categories" WHERE id = $1',
            [id]
        );

        if (checkCategory.rows.length === 0) {
            return res.status(404).json({ message: "Kategori Bulunamadı..." });
        }

        await pool.query(
            'DELETE FROM "Categories" WHERE id = $1',
            [id]
        );

        const newCategories = await pool.query('SELECT * FROM "Categories" ORDER BY sort_order ASC, id ASC');

        const mappedCategories = newCategories.rows.map(cat => ({
            ...cat,
            image: getImageUrl(req, cat.image)
        }));

        res.status(200).json({
            message: "Kategori Başarıyla Silindi...",
            newCategories: mappedCategories
        })

    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : req.body.image;

    if (!name || !imagePath) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." });
    }

    try {
        await pool.query(
            `UPDATE "Categories"
            SET
                name = $1,
                image = $2
            WHERE id = $3`,
            [name, imagePath, id]
        );

        const newCategories = await pool.query('SELECT * FROM "Categories" ORDER BY sort_order ASC, id ASC');

        const mappedCategories = newCategories.rows.map(cat => ({
            ...cat,
            image: getImageUrl(req, cat.image)
        }));

        res.status(200).json({
            message: "Kategori Güncellendi...",
            newCategories: mappedCategories
        })

    } catch (error) {
        console.error("Kategori Güncelleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
}

const reorderCategories = async (req, res) => {
    const { categories } = req.body; // Array of { id, sort_order }

    if (!Array.isArray(categories)) {
        return res.status(400).json({ message: "Geçersiz sıralama verisi..." });
    }

    try {
        for (const cat of categories) {
            await pool.query(
                'UPDATE "Categories" SET sort_order = $1 WHERE id = $2',
                [cat.sort_order, cat.id]
            );
        }

        const newCategories = await pool.query('SELECT * FROM "Categories" ORDER BY sort_order ASC, id ASC');

        const mappedCategories = newCategories.rows.map(cat => ({
            ...cat,
            image: getImageUrl(req, cat.image)
        }));

        res.status(200).json({
            message: "Kategori sıralaması güncellendi...",
            newCategories: mappedCategories
        });
    } catch (error) {
        console.error("Kategori Sıralama Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
};

module.exports = {
    getAllCategories,
    addNewCategory,
    deleteCategory,
    updateCategory,
    reorderCategories
}