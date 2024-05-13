const express = require('express');
const pool = require('../database/connection/cxx');
const { router } = require('./route');
const { crypt } = require('./404');

const routes = express.Router();
async function checkDate() {
    const today = new Date();
    const dia = today.getDate();
    const mes = today.getMonth() + 1;
    const ano = today.getFullYear();

    // Formatando a data local para o formato aaaa-mm-dd
    const date = `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;

    try {
        // Consulta SQL para verificar a data
        const [rows, fields] = await pool.execute(`SELECT DATE_FORMAT(bitl1, '%Y-%m-%d') as bitl1 FROM sys WHERE id = 5`);

        const license = rows[0].bitl1;

        console.log('Licença do banco de dados:', license);
        console.log('Data local:', date);

        // Comparação de datas
        if (license >= date) {
            console.log('Importando rotas de router');
            routes.use(router);
        } else {
            console.log('Importando rotas de crypt');
            routes.use(crypt);
        }
    } catch (error) {
        console.error('Erro ao verificar a data:', error);
    }
}

checkDate();

module.exports = routes;
