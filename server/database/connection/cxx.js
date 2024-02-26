const mysql = require('mysql2');
const dotenv = require('dotenv').config

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "pizza",
    password: "585103",
    database: "pizza"
});

module.exports = pool