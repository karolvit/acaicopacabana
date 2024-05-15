const express = require("express");
const { loginUser } = require('../../service/auth');

const { errorMiddleware } = require('../../utils/intTelegram');

const auth = express.Router();

auth.post("/login", async (req, res, next) => {
  try {
    const { usuario, senha } = req.body;
   
    const result = await loginUser(usuario, senha);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Erro interno do servidor"], details: error });
    const err = error;
    next(new Error(`Erro ao fazer login, ${err}`))
  }
});

auth.use(errorMiddleware)

module.exports = auth;
