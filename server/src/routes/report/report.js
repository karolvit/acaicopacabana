const express = require("express");
const report = express.Router();
const { findVendasByPedido, findVendasPorIntervaloDatas, findVendasPorIntervaloDatasCancelados, detailsPagamento } = require('../../service/report');
const { errorMiddleware } = require('../../utils/intTelegram');

report.get("/lvendas", async (req, res, next) => {
  try {
    const { pedido } = req.query;
    const result = await findVendasByPedido(pedido);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar vendas por pedido:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    const err = error;
    next(new Error(`Erro ao buscar o relatório de detalhamento do pedido, ${err}`))
  }
});

report.get("/rvendas", async (req, res) => {
  try {
    const { data_inicial, data_final } = req.query;
    const result = await findVendasPorIntervaloDatas(data_inicial, data_final);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar vendas por intervalo de datas:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    const err = error;
    next(new Error(`Erro ao buscar relatório de vendas, ${err}`))
  }
});

report.get("/cvendas", async (req, res) => {
  try {
    const {data_inicial, data_final} = req.query;
    const result = await findVendasPorIntervaloDatasCancelados(data_inicial, data_final);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: ['Erro ao buscar pedidos cancelados']})
    }
  } catch (error) {
    res.status(500).json({ success: false, error: ['Erro ao buscar pedidos cancelados']});
    next(new Error(`Erro ao buscar pedidos cancelados, ${error}`))
  }
})

report.get("/dvendas", async (req, res) => {
  try {
    const {pedido} = req.query;
    const result = await detailsPagamento(pedido);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: ['Erro ao buscar detalhes do pagamento do pedido']});
    }
  } catch (error) {
    res.status(500).json({ success: false, error: ['Erro ao buscar detalhes do pagamento']})
    next(new Error(`Erro ao buscar detalhamento de pagamento ${error}`));
  }
})

report.use(errorMiddleware)

module.exports = report;
