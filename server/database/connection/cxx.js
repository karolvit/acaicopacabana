const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();

const pool = mysql.createPool({
  host: "mysql29-farm10.kinghost.net",
  user: "celebrepro_add1",
  password: "585103Aa",
  database: "celebreprojeto",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const keepAlive = setInterval(() => {
  pool.query("SELECT 1", (err) => {
    if (err) {
      console.error("Erro ao enviar keepalive:", err);
    } else {
      console.log("Keepalive enviado");
    }
  });
}, 60 * 1000);
module.exports = pool;

process.on("SIGINT", () => {
  clearInterval(keepAlive);
  process.exit();
});
