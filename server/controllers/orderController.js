const { poolPromise, sql } = require('../config/db');

const getOrderByTableNumber = async (req, res) => {
    const table_number = parseInt(req.params.table_number);

    if (!table_number) {
        return res.status(400).json({ message: "Geçersiz masa numarası!" });
    }

    try {
        let pool = await poolPromise;

        let result = await pool
            .request()
            .input("table_number", sql.Int, table_number)
            .query(`
            SELECT 
                Tables.table_number,
                Products.name AS product_name,
                Orders.quantity,
                Orders.total_price,
                Tables.bill
            FROM Orders
            JOIN Tables ON Orders.table_id = Tables.id
            JOIN Products ON Orders.product_id = Products.id
            WHERE Tables.table_number = @table_number
            ORDER BY Orders.id DESC
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Bu masa için sipariş bulunamadı." });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası!" });
    }
}

const orderProduct = async (req, res) => {
    const { table_id, product_id, quantity } = req.body;

    if (!table_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Eksik veri girdiniz!" });
    }

    try {
        let pool = await poolPromise;

        let productQuery = await pool
            .request()
            .input("product_id", sql.Int, product_id)
            .query("SELECT price FROM Products WHERE id = @product_id");

        if (productQuery.recordset.length === 0) {
            return res.status(404).json({ message: "Ürün bulunamadı!" });
        }

        let price = productQuery.recordset[0].price;
        let additional_price = price * quantity;

        let existingOrderQuery = await pool
            .request()
            .input("table_id", sql.Int, table_id)
            .input("product_id", sql.Int, product_id)
            .query("SELECT id, quantity, total_price FROM Orders WHERE table_id = @table_id AND product_id = @product_id");

        if (existingOrderQuery.recordset.length > 0) {
            let existingOrder = existingOrderQuery.recordset[0];
            let newQuantity = existingOrder.quantity + quantity;
            let newTotalPrice = existingOrder.total_price + additional_price;

            await pool
                .request()
                .input("order_id", sql.Int, existingOrder.id)
                .input("newQuantity", sql.Int, newQuantity)
                .input("newTotalPrice", sql.Decimal(10, 2), newTotalPrice)
                .query("UPDATE Orders SET quantity = @newQuantity, total_price = @newTotalPrice WHERE id = @order_id");

        } else {
            await pool
                .request()
                .input("table_id", sql.Int, table_id)
                .input("product_id", sql.Int, product_id)
                .input("quantity", sql.Int, quantity)
                .input("total_price", sql.Decimal(10, 2), additional_price)
                .query("INSERT INTO Orders (table_id, product_id, quantity, total_price) VALUES (@table_id, @product_id, @quantity, @total_price)");
        }

        await pool
            .request()
            .input("table_id", sql.Int, table_id)
            .query(`
          UPDATE Tables 
          SET bill = (
              SELECT COALESCE(SUM(total_price), 0) 
              FROM Orders 
              WHERE Orders.table_id = Tables.id
          ) 
          WHERE id = @table_id
      `);

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
        const pool = await poolPromise;
        const checkOrder = await pool.request()
            .input("table_number", sql.Int, table_number)
            .input("product_name", sql.NVarChar, product_name)
            .query("SELECT o.id FROM Orders o JOIN Products p ON o.product_id = p.id JOIN Tables t ON o.table_id = t.id WHERE p.name = @product_name AND t.table_number = @table_number");

        if (checkOrder.recordset.length === 0) {
            return res.status(404).json({ message: "Ürün Bulunamadı..." });
        }

        const orderId = checkOrder.recordset[0].id;

        await pool.request()
            .input("orderId", sql.Int, orderId)
            .query("DELETE FROM Orders WHERE id = @orderId");

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
        const pool = await poolPromise;

        const tableResult = await pool.request()
            .input("table_number", sql.Int, table_number)
            .query("SELECT id FROM Tables WHERE table_number = @table_number");

        if (tableResult.recordset.length === 0) {
            return res.status(404).json({ message: "Masa bulunamadı!" });
        }

        const tableId = tableResult.recordset[0].id;

        await pool.request()
            .input("tableId", sql.Int, tableId)
            .query("DELETE FROM Orders WHERE table_id = @tableId");

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