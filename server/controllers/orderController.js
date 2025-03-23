const { poolPromise, sql } = require('../config/db');

const orderProduct = async (req, res) => {
    const { table_id, product_id, quantity } = req.body;

    if (!table_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Eksik veri girdiniz!" });
    }

    try {
        let pool = await poolPromise;

        // Ürünün fiyatını çek
        let productQuery = await pool
            .request()
            .input("product_id", sql.Int, product_id)
            .query("SELECT price FROM Products WHERE id = @product_id");

        if (productQuery.recordset.length === 0) {
            return res.status(404).json({ message: "Ürün bulunamadı!" });
        }

        let price = productQuery.recordset[0].price;
        let additional_price = price * quantity;

        // Aynı ürün daha önce eklenmiş mi kontrol et
        let existingOrderQuery = await pool
            .request()
            .input("table_id", sql.Int, table_id)
            .input("product_id", sql.Int, product_id)
            .query("SELECT id, quantity, total_price FROM Orders WHERE table_id = @table_id AND product_id = @product_id");

        if (existingOrderQuery.recordset.length > 0) {
            // Eğer ürün zaten sipariş edilmişse miktarı ve toplam fiyatı güncelle
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
            // Eğer sipariş daha önce verilmemişse yeni sipariş ekle
            await pool
                .request()
                .input("table_id", sql.Int, table_id)
                .input("product_id", sql.Int, product_id)
                .input("quantity", sql.Int, quantity)
                .input("total_price", sql.Decimal(10, 2), additional_price)
                .query("INSERT INTO Orders (table_id, product_id, quantity, total_price) VALUES (@table_id, @product_id, @quantity, @total_price)");
        }

        // Güncellenmiş toplam masanın hesabını hesapla
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

module.exports = {
    orderProduct
}