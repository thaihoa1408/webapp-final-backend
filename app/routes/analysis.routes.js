const controller = require("../controllers/analysis.controller");
const { authJwt } = require("../middlewares");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/analysisadd", [authJwt.verifyToken], controller.addnew);
  app.get("/analysisget", [authJwt.verifyToken], controller.analysisGet);
  app.post("/analysisdelete", [authJwt.verifyToken], controller.analysisDelete);
};
