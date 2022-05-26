const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

const User = require("../models/User.model");
const Session = require("../models/Session.model");


const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Badge = require("../models/Badge.model");

router.get("/session", (req, res) => {
  if (!req.headers.authorization) {
    return res.json(null);
  }
  const accessToken = req.headers.authorization;

  Session.findById(accessToken)
    .populate({path:"user",
    model:"User",
    populate:{
      path:"badge",
      model:"Badge",
    }
    })
    .populate({path:"user",
    model:"User",
    populate:{
      path:"purchase",
      model:"Purchase",
      populate:{
        path:"product",
        model:"Product"
      }
    }
    })
    .then((session) => {
      if (!session) {
        return res.status(404).json({ errorMessage: "La sesión no existe" });
      }
      return res.status(200).json(session);
    });
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Por favor ingresa tu nombre de usuario." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Tu contraseña debe medir más de 8 caracteres.",
    });
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      return res.status(400).json({ errorMessage: "Este usuario ya está ocupado." });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then((user) => {
        Session.create({
          user: user._id,
          createdAt: Date.now(),
        }).then((session) => {
          res.status(201).json({ user, accessToken: session._id });
        });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "Este nombre de usuario ya está ocupado.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Necesitamos tu nombre de usuario!" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Tu contraseña debe medir más de 8 caracteres.",
    });
  }

  User.findOne({ username })
    .populate("badge")
    .then((user) => {
      if (!user) {
        return res.status(400).json({ errorMessage: "El usuario no existe" });
      }
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "La contraseña es incorrecta" });
        }
        Session.create({ user: user._id, createdAt: Date.now() }).then(
          (session) => {
            return res.json({ user, accessToken: session._id });
          }
        );
      });
    })
    .catch((err) => {
      next(err);
      return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.delete("/logout", isLoggedIn, (req, res) => {
  Session.findByIdAndDelete(req.headers.authorization)
    .then(() => {
      res.status(200).json({ message: "El usuario a salido de su sesión" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
