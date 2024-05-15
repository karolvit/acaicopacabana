const express = require("express");

const params = express.Router();

const { updateAcaiPrice, getConfigById } = require('../../service/params');
const { errorMiddleware } = require('../../utils/intTelegram')
const passport = require('passport');

params.put("/acai", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const { valor_peso } = req.body;
    const result = await updateAcaiPrice(valor_peso);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao atulizar valor do açai ${err}`))
  }
});

params.use(errorMiddleware);

module.exports = params;
