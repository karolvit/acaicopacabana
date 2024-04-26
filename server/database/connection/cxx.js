const mysql = require('mysql2');
const dotenv = require('dotenv').config

const pool = mysql.createPool({
    host: "mysql29-farm10.kinghost.net",
    user: "celebrepro_add1",
    password: "585103Aa",
    database: "celebreprojeto"
});

module.exports = pool
