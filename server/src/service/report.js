const  pool  = require('../database/connection');

async function findVendasByPedido(pedido) {
  try {
    const query = `
      SELECT
        pedno.pedido,
        produto.nome,
        pedno.unino,
        pedno.valor_unit,
        DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y") as data_venda
      FROM 
        pedno
      INNER JOIN
        produto
      ON
        pedno.prodno = produto.codigo_produto
      WHERE
        pedno.pedido = ?
    `;
    const [results] = await pool.query(query, [pedido]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar vendas por pedido:', error);
    return { success: false, error: 'Entre em contato com administrador' };
  }
}

async function findVendasPorIntervaloDatas(data_inicial, data_final) {
  try {
    const query = `
    SELECT
      pedno.pedido,
      pedno.valor_unit,
      SUM(pedno.valor_unit) as total,
      userno as operador,
      DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y") as data_venda
    FROM
      pedno
    INNER JOIN
      produto
    ON
      pedno.prodno = produto.codigo_produto
    WHERE
      pedno.data_fechamento BETWEEN '?' AND '?'
    GROUP BY 
      (pedido)`;
    const [results] = await pool.query(query, [data_inicial, data_final]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar vendas por intervalo de datas:', error);
    return { success: false, error: 'Erro no sistema, contate o administrador', details: error };
  }
}


module.exports = {
  findVendasByPedido,
  findVendasPorIntervaloDatas
};