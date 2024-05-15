const pool = require('../database/connection');
const bcrypt = require('bcrypt');

async function user(username) {
  try {
    const query = "SELECT * FROM usuario WHERE usuario = ?";
    const [results] = await pool.query(query, username);

    if (results.length === 1) {
      return { success: true, user: results[0] };
    } else {
      return { success: false, error: "Nenhum usuário encontrado" };
    }
  } catch (error) {
    return { success: false, error: "Erro ao buscar usuário, contate o administrador", details: error };
  }
}

async function allUsers() {
    try {
      const query = `SELECT id, nome, usuario as nome_usuario, senha, cargo, adm FROM usuario`;
      const [results] = await pool.query(query);
  
      if (results.length === 0) {
        return { success: true, message: "Nenhum usuário cadastrado" };
      } else {
        return { success: true, data: results };
      }
    } catch (error) {
      return { success: false, error: "Por favor contate o administrador", details: error };
    }
}

async function registerUser(userData) {
  try {
    const { nome, nome_usuario, senha, cargo } = userData;
    const hashedSenha = await bcrypt.hash(senha, 10);

    const query = `INSERT INTO usuario (nome, usuario, senha, cargo) VALUES (?, ?, ?, ?)`;
    const values = [nome, nome_usuario, hashedSenha, cargo];

    await pool.query(query, values);
    return { success: true, message: "Usuário cadastrado com sucesso" };
  } catch (error) {
    return { success: false, error: "Erro ao cadastrar usuário", details: error };
  }
}

async function updateUser({ nome_usuario, senha, id }) {
  try {
    let query = 'UPDATE usuario SET usuario = ?';
    const values = [nome_usuario];

    if (senha && senha.trim() !== '') { 
      const hashedPassword = await bcrypt.hash(senha, 10);
      query += ', senha = ?'; 
      values.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    values.push(id);

    await pool.query(query, values);
    return { success: true, message: 'Usuário alterado com sucesso' };
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return { success: false, error: ['Erro interno do servidor'] };
  }
}

module.exports = {
  user,
  allUsers,
  registerUser,
  updateUser
};
