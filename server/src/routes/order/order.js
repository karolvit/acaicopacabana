const express = require("express");

const order = express.Router();

const { errorMiddleware } = require('../../utils/intTelegram');
const { nextOrder, createOrder, infoNextOrder, findProductById } = require('../../service/order');

order.get("/nped", async (req, res, next) => {
  try {
    const result = await nextOrder();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao buscar o número do próximo pedido ${err}`))
}
});

order.post("/ped", async (req, res, next) => {
  try {
    if (!req.body || !req.body.pedido || !req.body.pedido.produtos || !req.body.pedido.pagamento) {
      return res.status(400).send("Formato de pedido inválido");
    }
    
    const order = req.body.pedido;
    const result = await createOrder(order);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao finalizar pedido ${err}`))
  }
});

order.get("/nextped", async (req, res, next) => {
  try {
    const result = await infoNextOrder();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao buscar o número do próximo pedido ${err}`))
  }
});

order.get("/produtoid", async (req, res, next) => {
  try {
    const { codigo_produto } = req.query;
    const result = await findProductById(codigo_produto);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    const err = error;
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    next(new Error(`Erro ao buscar produto por id, ${err}`))
  }
});


order.use(errorMiddleware);

module.exports = order;
