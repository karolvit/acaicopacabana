const checkDate = require('../../config/checkDate');
const express = require('express');
const crypt = express.Router()

checkDate().then((selectedRoutes) => {
    crypt.use(selectedRoutes);
}).catch((error) => {
    console.error('Erro ao definir rotas:', error);
});

module.exports = crypt;
