const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const crypt = require('./routes/crypt/crypt')
const keepAlive = require('./database/keepalive');

const main = express();

main.use(bodyParser.json()); 
main.use(bodyParser.urlencoded({ extended: true }));
main.use(cors())
main.use(crypt)
main.use(express.json())

module.exports = main
