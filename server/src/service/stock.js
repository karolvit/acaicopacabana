const pool  = require('../database/connection');

async function stockList() {
  try {
    const query = `
      SELECT
        nome,
        categoria,
        codigo_produto,
        codigo_personalizado,
        preco_custo,
        tipo,
        SUM(quantidade) as quantidade,
        img_produto
      FROM
        produto
      GROUP BY 
        nome
      ORDER BY 
        codigo_produto ASC
    `;

    const [results] = await pool.query(query);

    if (results.length === 0) {
      return { success: true, message: "Você não possui itens no estoque" };
    } else {
      return { success: true, data: results };
    }
  } catch (error) {
    return { success: false, error: "Por favor contatar o administrador", details: error };
  }
}

async function registerProduct(productDate) {
  try {
    const {
      nome,
      categoria,
      codigo_personalizado,
      preco_custo,
      tipo,
      quantidade,
      img_produto,
    } = productDate;

    const query = `INSERT INTO produto (nome, categoria, codigo_personalizado, preco_custo, tipo, quantidade, img_produto) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      nome,
      categoria,
      codigo_personalizado,
      preco_custo,
      tipo,
      quantidade,
      img_produto,
    ];

    await pool.query(query, values);
    return { success: true, message: "Produto cadastrado com sucesso" };
  } catch (error) {
    return { success: false, error: "Erro ao cadastrar produto", details: error };
  }
}

async function allProducts() {
    try {
      const query = "SELECT * FROM estoque";
      const [results] = await pool.query(query);
  
      if (results.length === 0) {
        return { success: true, message: "Não existem produtos cadastrados" };
      } else {
        return { success: true, data: results };
      }
    } catch (error) {
      return { success: false, error: "Por favor contatar o suporte", details: error };
    }
  }
  
  async function serachProductByName(nome) {
    try {
      const query = `SELECT * FROM produto WHERE nome LIKE ?`;
      const values = [`${nome}%`];
      const [results] = await pool.query(query, values);
  
      if (results.length === 0) {
        return { success: true, message: "Não foi encontrado nenhum produto com esse nome" };
      } else {
        return { success: true, message: results };
      }
    } catch (error) {
      return { success: false, error: "Erro no servidor, por favor contatar o administrador", details: error };
    }
  }

module.exports = {
  stockList,
  registerProduct,
  allProducts,
  serachProductByName
};
