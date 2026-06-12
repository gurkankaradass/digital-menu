const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_SERVER || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Veritabanı bağlantı hatası:", err.stack);
    } else {
        console.log("PostgreSQL Bağlantısı Başarılı...");
        release();
    }
});

module.exports = pool;