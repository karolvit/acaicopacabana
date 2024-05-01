const mysql = require("mysql2");
const dotenv = require("dotenv").config;

const pool = mysql.createPool({
<<<<<<< HEAD
  host: "mysql29-farm10.kinghost.net",
  user: "celebrepro_add1",
  password: "585103Aa",
  database: "celebreprojeto",
});

module.exports = pool;
=======
    host: "mysql29-farm10.kinghost.net",
    user: "celebrepro_add1",
    password: "585103Aa",
    database: "celebreprojeto"
});

module.exports = pool
>>>>>>> db6da8e94903ef84f7e2cbc2e1a171b69ebebaf0
