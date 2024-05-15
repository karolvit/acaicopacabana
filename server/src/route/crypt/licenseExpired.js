const express = require('express');

const crypt = express.Router();

crypt.post('/login', (req, res) => {
    res.status(403).json({ success: false, message: ['Licença expirada, por favor contate o administrador']})
})

module.exports = { crypt };