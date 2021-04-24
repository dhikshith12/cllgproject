//DB Connection
const mysql = require("mysql2");

var mysqlConnection = new mysql.createConnection({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: "mysql",
    host: "localhost",
});

module.exports = mysqlConnection;