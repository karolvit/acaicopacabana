const  pool  = require('../database/connection'); 

async function nextOrder() {
  try {
    const query = "SELECT MAX(pedido) + 1 as proximoNumero FROM pedidos";
    const [results] = await pool.query(query);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: "Erro ao buscar número do pedido", details: error };
  }
}

async function createOrder(order) {
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    for (const produto of pedido.produtos) {
      const sql = `
        INSERT INTO pedno (pedido, prodno, valor_unit, unino, data_fechamento, sta, userno) 
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
      `;
      const values = [
        produto.pedido,
        produto.prodno,
        produto.valor_unit,
        produto.unino,
        produto.sta,
        produto.userno,
      ];
      
      await pool.query(sql, values);
    }

    await connection.commit();
    connection.release();
    return { success: true, message: "Pedido enviado com sucesso!" };
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return { success: false, error: "Erro ao enviar pedido", details: error };
  }
}

async function infoNextOrder() {
  try {
    const maxProdNoQuery = "SELECT MAX(pedido) AS maxProdNo FROM pedidos";
    const [maxResults] = await pool.query(maxProdNoQuery);
    const proximoProdNo = maxResults[0].maxProdNo + 1;

    const innerJoinQuery = `
      SELECT pedidos.pedido, sys.val as acai_valor
      FROM pedidos
      INNER JOIN sys
      ON pedidos.bit1 = sys.id
    `;
    const [results] = await pool.query(innerJoinQuery);
    const valor = results[0].acai_valor;

    return { success: true, message: proximoProdNo, valor: valor };
  } catch (error) {
    return { success: false, error: "Erro ao buscar próximo número do pedido", details: error };
  }
}

async function findProductById(codigo_produto) {
  try {
    const query = "SELECT * FROM produto WHERE codigo_produto = ?";
    const [results] = await pool.query(query, [codigo_produto]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    return { success: false, error: 'Por favor entrar em contato com o administrador' };
  }
}

module.exports = {
  nextOrder,
  createOrder,
  infoNextOrder,
  findProductById
};
