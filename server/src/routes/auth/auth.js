const express = require("express");
const { loginUser } = require('../../service/auth');

const { errorMiddleware } = require('../../utils/intTelegram');

const auth = express.Router();

auth.post("/login", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, errors: ["Missing request body"] });
    }

    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ success: false, errors: ["Missing 'usuario' or 'senha' in request body"] });
    }

    const result = await loginUser(usuario, senha);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Internal Server Error"], details: error });
    next(new Error(`Erro ao fazer login ${error}`));
  }
});


auth.use(errorMiddleware)

module.exports = auth;
