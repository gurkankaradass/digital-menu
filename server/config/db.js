const sql = require("mssql");
require("dotenv").config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("SQL Bağlantısı Başarılı...");
        return pool;
    })
    .catch(err => {
        console.log("Bağlantı Hatası: ", err);
        process.exit(1);
    })


module.exports = {
    sql,
    poolPromise
}