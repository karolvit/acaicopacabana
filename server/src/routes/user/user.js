const express = require("express")
const { user, allUsers, updateUser, registerUser, deleteUser } = require('../../service/user');
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
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

const { errorMiddleware } = require('../../utils/intTelegram')

const usr = express.Router();

usr.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const usuario = loggedInUser.usuario;

      const result = await user(usuario); // Aqui você está chamando a função `user`
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
      const err = error;
      next(new Error(`Erro ao puxar informações do usuário, ${err}`))
    }
  }
);

usr.get(
    "/alluser",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      try {
        const result = await allUsers();
        if (result.success) {
          res.status(200).json(result);
        } else {
          res.status(404).json(result);
        }
      } catch (error) {
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
        const err = error;
        next(new Error(`Erro ao listar usuários, ${err}`))
    }
    }
);

usr.post("/user", async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await registerUser(userData);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao cadastrar usuário, ${err}`))
  }
});

usr.put('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { nome_usuario, senha, id } = req.body;
    const result = await updateUser({ nome_usuario, senha, id });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: ['Erro interno do servidor'] });
  }
});

usr.delete('/usuario', async (req, res, next) => {
  try {
    const { id } = req.body;
    const result = await deleteUser(id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: ['Erro interno do servidor'] });
    next(new Error(`Erro ao deletar usuário, ${error}`))
  }
})

usr.use(errorMiddleware);

module.exports = usr;
