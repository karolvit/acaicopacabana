const express = require('express');
const {errorMiddleware} = require("../../utils/intTelegram")
const crypt = express.Router();

crypt.post('/login', (req, res, next) => {
    res.status(403).json({ success: false, message: ['Licença expirada, por favor contate o administrador']})
    next(new Error("licença expirada"))
})

crypt.use(errorMiddleware);

module.exports = { crypt };
