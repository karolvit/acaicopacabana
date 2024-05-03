const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const pool = require("../database/connection/cxx");
// const license = require('../system/verificarion');
const { SerialPort } = require("serialport");
//Teste rota de up
const fs = require("fs").promises;

const jwtSecret = "token";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    done(null, payload);
  })
);

router.post("/estoque", (req, res) => {
  const query = `INSERT INTO estoque (nome, categoria, data_compra, data_validade, quantidade, valor_compra) VALUES (?, ?, ?, ? ,?, ?)`;
  const {
    nome,
    categoria,
    data_compra,
    data_validade,
    quantidade,
    valor_compra,
  } = req.body;
  const values = [
    nome,
    categoria,
    data_compra,
    data_validade,
    quantidade,
    valor_compra,
  ];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({
        success: false,
        error: ["Erro ao inserir produto no estoque"],
      });
      return;
    }

    console.log(results);
    res
      .status(200)
      .json({ success: true, data: [" Produto inserido com sucesso "] });
  });
});

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user;
    const usuario = user.usuario;

    const query = "select * from usuario where usuario = ?";

    pool.query(query, usuario, (err, results) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: ["Erro ao buscar usuário, contate o administrador", err],
        });
      } else if (results.length === 1) {
        const dados = results[0];
        res.status(200).json({ success: true, user: dados });
      } else {
        res
          .status(404)
          .json({ success: false, error: ["Nenhum usuário encontrado"] });
      }
    });
  }
);

router.get(
  "/alluser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const query = `SELECT * FROM usuario`;

    pool.query(query, (err, results) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: ["Por favor contate o administrador"],
        });
      } else if (results.length === 0) {
        res
          .status(404)
          .json({ success: true, message: ["Nenhum usuario cadastrado"] });
      } else {
        res.status(200).json({ success: true, data: results });
      }
    });
  }
);

router.get("/estoque", (req, res) => {
  const query = `select nome,categoria,codigo_produto,codigo_personalizado,preco_custo,tipo,SUM(quantidade) as quantidade,img_produto
from produto
group by nome;`;

  pool.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: ["Por favor contatar o administrador", err],
      });
      return;
    } else if (results.length === 0) {
      res
        .status(404)
        .json({ success: true, message: ["Você não possui itens no estoque"] });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

router.get("/nped", async (req, res) => {
  const query = "SELECT MAX(pedido) + 1 as proximoNumero FROM pedidos ";

  pool.query(query, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, error: ["Erro ao buscar número do pedido"] });
    } else {
      res.status(200).json({ success: true, message: results });
    }
  });
});

router.post("/produto", (req, res) => {
  const {
    nome,
    categoria,
    codigo_produto,
    codigo_personalizado,
    preco_custo,
    tipo,
    quantidade,
    data_venda,
    img_produto,
  } = req.body;
  const values = [
    nome,
    categoria,
    codigo_produto,
    codigo_personalizado,
    preco_custo,
    tipo,
    quantidade,
    data_venda,
    img_produto,
  ];
  const query = `INSERT INTO produto (nome,categoria,codigo_produto,codigo_personalizado,preco_custo,tipo,quantidade,data_venda,img_produto) VALUES (?,?,?,?,?,?,?,?,?)`;

  pool.query(query, values, (err, results) => {
    if (err) {
      res
        .status(400)
        .json({ success: false, error: ["Erro ao cadastrar produto"] });
    } else {
      res
        .status(201)
        .json({ success: true, message: ["Produto cadastrado com sucesso"] });
    }
  });
});

router.get("/produto", (req, res) => {
  const query = "SELECT * FROM estoque";

  pool.query(query, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, error: ["Por favor contatar o suporte"] });
    } else if (results.length === 0) {
      res
        .status(404)
        .json({ success: true, message: ["Não existe produtos cadastrados"] });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

router.post("/user", async (req, res) => {
  const { nome, usuario, senha, cargo } = req.body;
  const hashedsenha = await bcrypt.hash(senha, 10);

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, error: ["Erro ao cadastrar usuário"] });
      return;
    }

    const query = `INSERT INTO usuario (nome, usuario, senha, cargo) VALUES (?, ?, ?, ?)`;
    const values = [nome, usuario, hashedsenha, cargo];

    pool.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, error: ["Erro ao cadastrar usuário"] });
        return;
      }

      res
        .status(201)
        .json({ success: true, data: ["Usuário cadastrado com sucesso"] });
    });
  });
});

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const query = "SELECT * FROM usuario WHERE usuario = ?";

  pool.query(query, [usuario], async (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, errors: ["Erro no Banco de Dados"] });
    } else if (results.length === 1) {
      const user = results[0];

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (isPasswordValid) {
        const payload = { id: user.id, usuario: user.usuario };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
        const decodedToken = jwt.decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        res.json({ 
          success: true,
          token: token,
          expiration: expirationDate,
          nome: user.nome,
          cargo: user.cargo,
          adm: user.adm
        });
      } else {
        res
          .status(401)
          .json({ success: false, errors: ["Falha na Autenticação"] });
      }
    } else {
      res
        .status(401)
        .json({ success: false, errors: ["Usuário não encontrado"] });
    }
  });
});

router.post("/ped", (req, res) => {
  if (!req.body || !req.body.pedido || !req.body.pedido.produtos) {
    return res.status(400).send("Formato de pedido inválido");
  }

  const pedido = req.body.pedido;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Erro ao obter conexão do pool:", err);
      return res.status(500).send("Erro ao obter conexão do pool");
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Erro ao iniciar transação:", err);
        pool.release();
        return res.status(500).send("Erro ao iniciar transação");
      }

      pedido.produtos.forEach((produto) => {
        const sql =
          "INSERT INTO pedno (pedido, prodno, valor_unit, unino, data_fechamento, sta, userno) VALUES (?,?, ?, ?, CURRENT_TIMESTAMP, ?, ?)";
        const values = [
          produto.pedido,
          produto.prodno,
          produto.valor_unit,
          produto.unino,
          produto.sta,
          produto.userno,
        ];

        pool.query(sql, values, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              console.error("Erro ao inserir produto no banco de dados:", err);
              connection.release();
              res.status(500).send("Erro ao inserir produto no banco de dados");
            });
          }
        });
      });

      connection.commit((err) => {
        if (err) {
          return pool.rollback(() => {
            console.error("Erro ao commitar transação:", err);
            connection.release();
            res.status(500).send("Erro ao commitar transação");
          });
        }

        console.log("Transação commitada com sucesso.");
        connection.release();
        res.send("Pedido enviado com sucesso!");
      });
    });
  });
});

router.get("/liuser", (req, res) => {
  const query = "SELECT * FROM usuario";

  pool.query(query, (err, results) => {
    if (err) {
      res
        .status(404)
        .json({ success: false, error: ["Erro ao listar usuários"] });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

router.get("/nextped", (req, res) => {
  pool.query(
    `
    SELECT MAX(pedido) AS maxProdNo 
    FROM pedidos
  `,
    (err, maxResults) => {
      if (err) {
        console.error("Erro ao executar a consulta:", err);
        res.status(500).send("Erro ao buscar próximo número do pedido");
        return;
      }

      const proximoProdNo = maxResults[0].maxProdNo + 1;

      pool.query(
        `
      SELECT pedidos.pedido, sys.val as acai_valor
      FROM pedidos
      INNER JOIN sys
      ON pedidos.bit1 = sys.id
    `,
        (err, results) => {
          if (err) {
            console.error("Erro ao executar o INNER JOIN:", err);
            res.status(500).send("Erro ao executar o INNER JOIN");
            return;
          }
          const valor = results[0].acai_valor;
          res.json({ success: true, message: proximoProdNo, valor: valor });
        }
      );
    }
  );
});
// teste rota up
// importação dos modulos de extração
const Tesseract = require("tesseract.js");
const path = require("path");
// Configuração do multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extension}`);
  },
});
const upload = multer({ storage: storage });
//rota
router.post("/up", upload.single("imagePath"), (req, res) => {
  if (!req.file) {
    res.status(404).json({ success: false, error: ["Nenhuma imagem enviada"] });
  } else {
    const imagePath = req.file.path;
    const extension = path.extname(req.file.originalname);
    const imageName = req.file.filename;
    const imageURL = `${imagePath}${extension}`;

    Tesseract.recognize(imagePath, "eng", {
      logger: (info) => console.log(info),
    })
      .then(({ data: { text } }) => {
        const numerosEncontrados = extrairNumeros(text);
        console.log("Números encontrados:", numerosEncontrados);

        res.status(201).json({
          success: true,
          message: ["Imagem carregada com sucesso"],
          imagePath: imageURL,
          numbers: numerosEncontrados,
        });
      })
      .catch((error) => {
        console.error("Erro ao processar a imagem:", error);
        res
          .status(500)
          .json({ success: false, error: ["Erro ao processar a imagem"] });
      });
  }
});

function extrairNumeros(texto) {
  const regexNumeros = /[-+]?\b\d+(\.\d+)?\b/g;
  return texto.match(regexNumeros) || [];
}

router.get("/busca", (req, res) => {
  const { nome } = req.query;
  const values = [`${nome}%`];
  const query = `SELECT * FROM produto WHERE nome like ? `;

  pool.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: ["Erro no servidor, por favor contatar o administrador", err],
      });
    } else if (results === 0) {
      res.status(404).json({
        success: true,
        message: ["Não foi encontrado nenhum produto com esse nome"],
      });
    } else {
      res.status(200).json({ success: true, message: results });
    }
  });
});

router.put(
  "/acai",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const query = "UPDATE sys SET val = ? WHERE id = 1";
    const { valor_peso } = req.body;
    const values = [valor_peso];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: [
            "Erro ao atualizar valor do açai, por favor contate o administrador",
          ],
        });
      } else {
        res.status(201).json({
          success: true,
          message: ["Valor do açai atualizado com sucesso"],
        });
      }
    });
  }
);

router.get("/acai", (req, res) => {
  const query = "select val from sys where id = 1";

  pool.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: ["Por favor entrar em contato com o administrador"],
      });
    } else {
      res.status(200).json({ success: true, message: results });
    }
  });
});

const serialPort = new SerialPort({
  path: "COM1",
  baudRate: 9600,
  autoOpen: false,
});

serialPort.open((err) => {
  if (err) {
    console.error("Erro ao abrir a porta serial:", err.message);
  }
});

let weightData = "";

serialPort.on("data", (data) => {
  const dataStr = data.toString().replace(/[^\d]/g, "");

  if (dataStr) {
    weightData = Number(dataStr).toLocaleString("pt-BR");
  }
});

router.get("/peso", (req, res) => {
  res.send({ peso: weightData });
});

router.put("/user", passport.authenticate("jwt", ({ session: false})), (req, res) => {
            const query = `UPDATE usuario set usuario = ? AND senha = ? WHERE id = ? `;
            const { usuario, senha, id } = req.body;
            const values = [ usuario, senha, id];

  pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
      } else {
        res.status(201).json({ success: true, message: ['Usuário alterado com sucesso']})
      }
  })
  })
  router.get("/produtoid", (req, res) => {
    const query = "SELECT * FROM produto WHERE codigo_produto = ?";
    const { codigo_produto } = req.body;
    const values = [codigo_produto];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Por favor entrar em contato com o administrador']})
      } else {
        res.status(200).json(results)
      }
    })
  })

  router.get("/produtonome", (req, res) => {
    const query = "SELECT * FROM produto WHERE nome LIKE ? ";
    const {`${nome}%`} = req.body;
    const values [nome];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
      } else {
        res.status(200).json(results)
      }
    })
  })
module.exports = router;
