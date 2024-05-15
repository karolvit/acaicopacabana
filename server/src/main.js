const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const crypt = require('./route/crypt/crypt')
const keepAlive = require('./database/keepalive');

const main = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
main.use(cors())
main.use(crypt)
main.use(express.json())

module.exports = main
