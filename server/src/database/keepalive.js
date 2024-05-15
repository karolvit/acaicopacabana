const pool = require('./connection');

const keepAlive = setInterval(async () => {
    try {
        await pool.execute("SELECT 1");
        console.log("Keepalive enviado");
    } catch (err) {
        console.error("Erro ao enviar keepalive:", err);
    }
}, 60 * 1000);

module.exports = keepAlive;

process.on("SIGINT", () => {
    clearInterval(keepAlive);
    process.exit();
});
