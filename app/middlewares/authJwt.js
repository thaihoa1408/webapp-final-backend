const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
isOnline = (req, res) => {
  User.findById(req.userId).exec((err, userObj) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    else return res.status(200).send({
      user: {
        id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        role: userObj.role,
        siteid: userObj.siteid
      },
      accessToken: req.body.token || req.query.token,
    });
  });
};
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      if (user.role === "admin") {
        next();
        return;
      }
    }
    res.status(403).send({ message: "Required Admin Role!" });
    return;
  });
};
isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      if (user.role === "moderator") {
        next();
        return;
      }
    }
    res.status(403).send({ message: "Require Moderator Role!" });
    return;
  });
};
const authJwt = {
  verifyToken,
  isOnline,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
