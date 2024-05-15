const express = require("express");
const { loginUser } = require('../../service/auth');

const { errorMiddleware } = require('../../utils/intTelegram');

const auth = express.Router();

auth.post("/login", async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ success: false, errors: ["Missing request body"] });
    }

    // Destructure 'usuario' and 'senha' from req.body
    const { usuario, senha } = req.body;

    // Check if 'usuario' and 'senha' are present in req.body
    if (!usuario || !senha) {
      return res.status(400).json({ success: false, errors: ["Missing 'usuario' or 'senha' in request body"] });
    }

    // Call the loginUser function with usuario and senha
    const result = await loginUser(usuario, senha);
    
    // Handle the result accordingly
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    // Handle internal server errors
    res.status(500).json({ success: false, errors: ["Internal Server Error"], details: error });
    // Pass the error to the error handling middleware
    next(new Error(`Error while logging in: ${error}`));
  }
});


auth.use(errorMiddleware)

module.exports = auth;
