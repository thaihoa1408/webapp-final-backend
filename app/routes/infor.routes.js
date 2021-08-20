const { authJwt } = require("../middlewares");
const controller = require("../controllers/infor.controller");
module.exports = function (app) {
  app.get(
    "/get_datatype_infor",
    [authJwt.verifyToken],
    controller.datatypeInfor
  );
  app.post(
    "/update_datatype",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateDatatype
  );
};
