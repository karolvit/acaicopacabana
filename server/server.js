const express = require('express');
const dotenv = require('dotenv').config();
const main = require('./src/main')
const app = express();

app.use(main)
const port = process.env.port

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
}) 