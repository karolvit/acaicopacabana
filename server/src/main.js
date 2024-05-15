const express = require('express')

const router = require('./route/router')
const keepAlive = require('./database/keepalive');

const main = express();

main.use(router)
main.use(express.json)

module.exports = main