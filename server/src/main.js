const express = require('express')

const crypt = require('./route/crypt.js')
const keepAlive = require('./database/keepalive');

const main = express();

main.use(crypt)
main.use(express.json)

module.exports = main
