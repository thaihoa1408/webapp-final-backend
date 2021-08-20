const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role ? req.body.role : "user",
    siteid: req.body.siteid,
  });
  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.send({ message: "User was registered successfully!" });
    }
  });
};
exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, //1 ngay
    });
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      res.status(200).send({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          siteid: user.siteid,
        },
        accessToken: token,
        time_start: decoded.iat,
        time_expire: decoded.exp,
      });
    });
  });
};
