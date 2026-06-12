const pool = require('../config/db');

const getOrderByTableNumber = async (req, res) => {
    const table_number = parseInt(req.params.table_number);

    if (!table_number) {
        return res.status(400).json({ message: "Geçersiz masa numarası!" });
    }

    try {
        let result = await pool.query(`
            SELECT 
                "Tables".table_number,
                "Products".name AS product_name,
                "Orders".quantity,
                "Orders".total_price,
                "Tables".bill
            FROM "Orders"
            JOIN "Tables" ON "Orders".table_id = "Tables".id
            JOIN "Products" ON "Orders".product_id = "Products".id
            WHERE "Tables".table_number = $1
            ORDER BY "Orders".id DESC
        `, [table_number]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Bu masa için sipariş bulunamadı." });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası!" });
    }
}

const orderProduct = async (req, res) => {
    const { table_id, product_id, quantity } = req.body;

    if (!table_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Eksik veri girdiniz!" });
    }

    try {
        let productQuery = await pool.query(
            'SELECT price FROM "Products" WHERE id = $1',
            [product_id]
        );

        if (productQuery.rows.length === 0) {
            return res.status(404).json({ message: "Ürün bulunamadı!" });
        }

        let price = productQuery.rows[0].price;
        let additional_price = price * quantity;

        let existingOrderQuery = await pool.query(
            'SELECT id, quantity, total_price FROM "Orders" WHERE table_id = $1 AND product_id = $2',
            [table_id, product_id]
        );

        if (existingOrderQuery.rows.length > 0) {
            let existingOrder = existingOrderQuery.rows[0];
            let newQuantity = existingOrder.quantity + quantity;
            let newTotalPrice = existingOrder.total_price + additional_price;

            await pool.query(
                'UPDATE "Orders" SET quantity = $1, total_price = $2 WHERE id = $3',
                [newQuantity, newTotalPrice, existingOrder.id]
            );

        } else {
            await pool.query(
                'INSERT INTO "Orders" (table_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)',
                [table_id, product_id, quantity, additional_price]
            );
        }

        await pool.query(`
          UPDATE "Tables" 
          SET bill = (
              SELECT COALESCE(SUM(total_price), 0) 
              FROM "Orders" 
              WHERE "Orders".table_id = "Tables".id
          ) 
          WHERE id = $1
        `, [table_id]);

        res.status(200).json({ message: "Sipariş başarıyla eklendi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası!" });
    }
}

const deleteOrder = async (req, res) => {
    const { table_number, product_name } = req.query;

    if (!table_number || !product_name) {
        return res.status(400).json({ message: "Eksik parametreler var!" });
    }

    try {
        const checkOrder = await pool.query(
            `SELECT o.id, t.id AS table_id 
             FROM "Orders" o 
             JOIN "Products" p ON o.product_id = p.id 
             JOIN "Tables" t ON o.table_id = t.id 
             WHERE p.name = $1 AND t.table_number = $2`,
            [product_name, table_number]
        );

        if (checkOrder.rows.length === 0) {
            return res.status(404).json({ message: "Ürün Bulunamadı..." });
        }

        const orderId = checkOrder.rows[0].id;
        const tableId = checkOrder.rows[0].table_id;

        await pool.query('DELETE FROM "Orders" WHERE id = $1', [orderId]);

        // Masa toplamını güncelle
        await pool.query(`
            UPDATE "Tables" 
            SET bill = (
                SELECT COALESCE(SUM(total_price), 0) 
                FROM "Orders" 
                WHERE "Orders".table_id = "Tables".id
            ) 
            WHERE id = $1
        `, [tableId]);

        res.status(200).json({ message: "Ürün Başarıyla Silindi" });
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteAllOrder = async (req, res) => {
    const { table_number } = req.query;

    if (!table_number) {
        return res.status(400).json({ message: "Masa numarası belirtilmelidir!" });
    }

    try {
        const tableResult = await pool.query(
            'SELECT id FROM "Tables" WHERE table_number = $1',
            [table_number]
        );

        if (tableResult.rows.length === 0) {
            return res.status(404).json({ message: "Masa bulunamadı!" });
        }

        const tableId = tableResult.rows[0].id;

        await pool.query('DELETE FROM "Orders" WHERE table_id = $1', [tableId]);

        res.status(200).json({ message: "Hesap Alındı..." });
    } catch (error) {
        console.error("API Hatası:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
}

module.exports = {
    getOrderByTableNumber,
    orderProduct,
    deleteOrder,
    deleteAllOrder
}