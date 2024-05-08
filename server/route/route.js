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
    const query = `SELECT id, nome, usuario as nome_usuario, senha, cargo, adm FROM usuario`;

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
    codigo_personalizado,
    preco_custo,
    tipo,
    quantidade,
    img_produto,
  ];
  const query = `INSERT INTO produto (nome,categoria,codigo_personalizado,preco_custo,tipo,quantidade,img_produto) VALUES (?,?,?,?,?,?,?)`;

  pool.query(query, values, (err, results) => {
    if (err) {
      res
        .status(400)
        .json({ success: false, error: ["Erro ao cadastrar produto", err] });
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
  const { nome, nome_usuario, senha, cargo } = req.body;
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
    const values = [nome, nome_usuario, hashedsenha, cargo];

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

// Atualizar usuário com senha opcional
router.put('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { nome_usuario, senha, id } = req.body;

  try {
    let query = 'UPDATE usuario SET usuario = ?';
    const values = [nome_usuario];

    if (senha && senha.trim() !== '') { // Verifique se a senha está vazia ou em branco
      const hashedPassword = await bcrypt.hash(senha, 10);
      query += ', senha = ?'; // Atualizar a coluna senha
      values.push(hashedPassword); // Adicionar o hash ao array de valores
    }

    query += ' WHERE id = ?';
    values.push(id); // Adicionar ID ao array de valores

    pool.query(query, values, (err, results) => {
      if (err) {
        console.error('Erro ao atualizar o usuário:', err);
        res.status(500).json({ success: false, error: ['Por favor, contate o administrador'] });
      } else {
        res.status(200).json({ success: true, message: ['Usuário alterado com sucesso'] });
      }
    });
  } catch (error) {
    console.error('Erro ao aplicar hash na senha:', error);
    res.status(500).json({ success: false, error: ['Erro interno do servidor'] });
  }
});

  router.get("/produtoid", (req, res) => {
    const query = "SELECT * FROM produto WHERE codigo_produto = ?";
    const { codigo_produto } = req.query;
    const values = [codigo_produto];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Por favor entrar em contato com o administrador']})
      } else {
        res.status(200).json(results)
      }
    })
  })

  router.get("/lvendas", (req, res) => {
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

    const { pedido } = req.query;
    const values = [ pedido ];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Entre em contato com administrador']});
      } else {
        res.status(200).json(results);
      }
    })
  })

  router.get("/rvendas", (req, res) => {
    const query = `
    SELECT
      pedno.pedido,
      pedno.valor_unit,
      SUM(pedno.valor_unit) as total,
      usuario.nome as operador,
      DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y") as data_venda
    FROM
      pedno
    INNER JOIN
      produto
    ON
      pedno.prodno = produto.codigo_produto
    INNER JOIN 
      usuario
    ON 
      pedno.userno = usuario.id
    WHERE
      pedno.data_fechamento BETWEEN ? AND ?
    GROUP BY 
      (pedido)`;

    const { data_inicial, data_final } = req.query;
    const values = [ data_inicial, data_final];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Erro no sistema, contate o administrador', err]})
      } else {
        res.status(200).json(results);
      }
    })
  })

  router.delete("/usuario", (req, res) => {
    const query = `DELETE FROM usuario WHERE id = ?`;
    const { id } = req.body;
    const values = [ id];

    pool.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Contate o administrador']})
      } else {
        res.status(200).json({ success: true, message: ['Usuario excluido com sucesso']})
      }
    })
  })

 router.get("/red", (req, res) => {
    const query = "SELECT * FROM sys WHERE id = 2"
    const { id } = req.body;
    const values = [ id ]

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
        } else {
            res.status(200).json(results)
        }
    })
})

router.get("/yellow", (req, res) => {
    const query = "SELECT * FROM sys WHERE id = 3"
    const { id } = req.body;
    const values = [ id ]

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
        } else {
            res.status(200).json(results)
        }
    })
})

router.get("/blue", (req, res) => {
    const query = "SELECT * FROM sys WHERE id = 4"
    const { id } = req.body;
    const values = [ id ]

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
        } else {
            res.status(200).json(results)
        }
    })
})

router.put("/param/estoque", (req, res) => {
    const query = "UPDATE sys SET val = ? WHERE id = ?"
    const { val, id } = req.body;
    const values = [ val, id ]

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
        } else {
            res.status(200).json({ success: true, message: ['Parametros alterado com sucesso']})
        }
    })
})

router.put("/attestoque", (req, res) => {
  const query = `
  INSERT INTO 
    produto (codigo_produto, quantidade)
  VALUES 
    (?, ?)
  ON DUPLICATE KEY UPDATE
    quantidade = quantidade + VALUES(quantidade);
  `
  const { codigo_produto, quantidade } = req.body;
  const values = [ codigo_produto, quantidade ];

  pool.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, error:[' Por favor contate o administrador']})
    } else {
      res.status(201).json({ success: true, message: ['Estoque atualizado com sucesso']})
    }
  })
})

module.exports = router;
