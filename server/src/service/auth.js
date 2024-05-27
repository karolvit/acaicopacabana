const  pool = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

const jwtSecret = process.env.secret

async function loginUser(usuario, senha) {
  try {
    const query = `
      SELECT 
        id, 
        UPPER(nome) AS nome, 
        usuario, 
        senha, 
        UPPER(cargo) AS cargo, 
        adm
      FROM usuario
      WHERE usuario = ?
    `;
    const values = [usuario]
    const [results] = await pool.query(query, values);
    
    if (results.length === 1) {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      
      if (isPasswordValid) {
        const payload = { id: user.id, usuario: user.usuario };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
        const decodedToken = jwt.decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        return { 
          success: true,
          token: token,
          expiration: expirationDate,
          nome: user.nome,
          cargo: user.cargo,
          adm: user.adm,
          id: user.id
        };
      } else {
        return { success: false, errors: ["Senha incorreta"] };
      }
    } else {
      return { success: false, errors: ["Usuário não encontrado"] };
    }
  } catch (error) {
    return { success: false, errors: ["Erro no Banco de Dados"], details: error };
  }
}

module.exports = {
  loginUser
};
