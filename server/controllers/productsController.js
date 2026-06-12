const { sql, poolPromise } = require("../config/db");

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
        const pool = await poolPromise;
        const result = await pool.request()
            .input('categoryName', sql.NVarChar, categoryName)
            .query('SELECT p.id, p.name, p.image, p.price, c.name AS categoryName FROM Products p JOIN Categories c ON p.category_id = c.id WHERE c.name = @categoryName');

        const products = result.recordset.map(product => ({
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
        const pool = await poolPromise;

        let formattedPrice = price;

        if (formattedPrice % 1 === 0) {
            formattedPrice = `${formattedPrice}.00`;
        }

        formattedPrice = parseFloat(formattedPrice).toFixed(2);

        const checkProduct = await pool.request()
            .input("name", sql.NVarChar, name)
            .query("SELECT id FROM Products WHERE name = @name");

        if (checkProduct.recordset.length > 0) {
            return res.status(400).json({ message: "Ürün Zaten Mevcut" });;
        }

        const categoryResult = await pool.request()
            .input("categoryName", sql.NVarChar, categoryName)
            .query("SELECT id FROM Categories WHERE name = @categoryName");

        if (categoryResult.recordset.length === 0) {
            return res.status(400).json({ message: "Kategori bulunamadı" });
        }

        const categoryId = categoryResult.recordset[0].id;

        await pool.request()
            .input("name", sql.NVarChar, name)
            .input("categoryId", sql.Int, categoryId)
            .input("image", sql.NVarChar, imagePath)
            .input("price", sql.Decimal(10, 2), formattedPrice)
            .query(`INSERT INTO Products (name, category_id, image, price) VALUES (@name, @categoryId, @image, @price)`)

        const newProducts = await pool.request()
            .input("categoryId", sql.Int, categoryId)
            .query("SELECT * FROM Products WHERE category_id = @categoryId");

        const mappedProducts = newProducts.recordset.map(product => ({
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
        const pool = await poolPromise;
        const checkProduct = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id FROM Products WHERE id = @id");

        if (checkProduct.recordset.length === 0) {
            return res.status(404).json({ message: "Ürün Bulunamadı..." });
        }

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Products WHERE id = @id");

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
        const pool = await poolPromise;

        let formattedPrice = price;

        if (formattedPrice % 1 === 0) {
            formattedPrice = `${formattedPrice}.00`;
        }

        formattedPrice = parseFloat(formattedPrice).toFixed(2);

        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar, name)
            .input("image", sql.NVarChar, imagePath)
            .input("price", sql.Decimal(10, 2), formattedPrice)
            .input("categoryName", sql.NVarChar, categoryName)
            .query(`UPDATE Products 
            SET 
                name = @name,
                image = @image,
                price = @price,
                category_id = (SELECT id FROM Categories WHERE name = @categoryName)
            WHERE id = @id`)

        res.status(201).json({ message: "Ürün Güncellendi..." });
    } catch (error) {
        console.error("Ürün Güncelleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getProductByCategoryName,
    addNewProduct,
    deleteProduct,
    updateProduct
}