const express = require("express");
const config = express.Router();

const { openSerialPort, getWeightData } = require('../../config/serialPort');
const { errorMiddleware }  = require('../../utils/intTelegram')

config.get("/peso", async (req, res, next) => {
  try {
    await openSerialPort();
    res.send({ peso: getWeightData() });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao puxar peso da balança, ${err}`))
  }
});

module.exports = config;
