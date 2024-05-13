const express = require('express');

const crypt = express.Router();

crypt.get('/peso', (req, res) => {
    res.status(404).json({ success: false, message: ['Licença expirada, por favor contate o administrador']})
})

module.exports = { crypt };