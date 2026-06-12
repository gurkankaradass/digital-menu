const pool = require("../config/db");

const getImageUrl = (req, path) => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${req.protocol}://${req.get('host')}/${path}`;
};

const getProductByCategoryName = async (req, res) => {
    const categoryName = req.params.categoryName;

    if (!categoryName) {
        return res.status(400).json({ message: "Kategori Adı Gereklidir..." });
    }

    try {
        const result = await pool.query(
            'SELECT p.id, p.name, p.image, p.price, c.name AS "categoryName" FROM "Products" p JOIN "Categories" c ON p.category_id = c.id WHERE c.name = $1 ORDER BY p.sort_order ASC, p.id ASC',
            [categoryName]
        );

        const products = result.rows.map(product => ({
            ...product,
            image: getImageUrl(req, product.image)
        }));

        res.json(products);

    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const addNewProduct = async (req, res) => {
    const { name, categoryName, price } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : req.body.image;

    if (!name || !categoryName || !imagePath || !price) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        let formattedPrice = price;

        if (formattedPrice % 1 === 0) {
            formattedPrice = `${formattedPrice}.00`;
        }

        formattedPrice = parseFloat(formattedPrice).toFixed(2);

        const checkProduct = await pool.query(
            'SELECT id FROM "Products" WHERE name = $1',
            [name]
        );

        if (checkProduct.rows.length > 0) {
            return res.status(400).json({ message: "Ürün Zaten Mevcut" });
        }

        const categoryResult = await pool.query(
            'SELECT id FROM "Categories" WHERE name = $1',
            [categoryName]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(400).json({ message: "Kategori bulunamadı" });
        }

        const categoryId = categoryResult.rows[0].id;

        await pool.query(
            'INSERT INTO "Products" (name, category_id, image, price) VALUES ($1, $2, $3, $4)',
            [name, categoryId, imagePath, formattedPrice]
        );

        const newProducts = await pool.query(
            'SELECT * FROM "Products" WHERE category_id = $1 ORDER BY sort_order ASC, id ASC',
            [categoryId]
        );

        const mappedProducts = newProducts.rows.map(product => ({
            ...product,
            image: getImageUrl(req, product.image)
        }));

        res.status(200).json({
            message: "Yeni Ürün Oluşturuldu...",
            newProducts: mappedProducts
        })

    } catch (error) {
        console.error("Ürün Ekleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const checkProduct = await pool.query(
            'SELECT id FROM "Products" WHERE id = $1',
            [id]
        );

        if (checkProduct.rows.length === 0) {
            return res.status(404).json({ message: "Ürün Bulunamadı..." });
        }

        await pool.query('DELETE FROM "Products" WHERE id = $1', [id]);

        res.status(200).json({ message: "Ürün Başarıyla Silindi" });
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, categoryName } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : req.body.image;

    if (!name || !imagePath || !price || !categoryName) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        let formattedPrice = price;

        if (formattedPrice % 1 === 0) {
            formattedPrice = `${formattedPrice}.00`;
        }

        formattedPrice = parseFloat(formattedPrice).toFixed(2);

        await pool.query(
            `UPDATE "Products" 
            SET 
                name = $1,
                image = $2,
                price = $3,
                category_id = (SELECT id FROM "Categories" WHERE name = $4)
            WHERE id = $5`,
            [name, imagePath, formattedPrice, categoryName, id]
        );

        res.status(201).json({ message: "Ürün Güncellendi..." });
    } catch (error) {
        console.error("Ürün Güncelleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const reorderProducts = async (req, res) => {
    const { products, category_id } = req.body; // Array of { id, sort_order }

    if (!Array.isArray(products) || !category_id) {
        return res.status(400).json({ message: "Geçersiz sıralama verisi..." });
    }

    try {
        for (const prod of products) {
            await pool.query(
                'UPDATE "Products" SET sort_order = $1 WHERE id = $2',
                [prod.sort_order, prod.id]
            );
        }

        const newProducts = await pool.query(
            'SELECT * FROM "Products" WHERE category_id = $1 ORDER BY sort_order ASC, id ASC',
            [category_id]
        );

        const mappedProducts = newProducts.rows.map(product => ({
            ...product,
            image: getImageUrl(req, product.image)
        }));

        res.status(200).json({
            message: "Ürün sıralaması güncellendi...",
            newProducts: mappedProducts
        });
    } catch (error) {
        console.error("Ürün Sıralama Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
};

module.exports = {
    getProductByCategoryName,
    addNewProduct,
    deleteProduct,
    updateProduct,
    reorderProducts
}