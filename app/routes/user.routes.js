const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get("/verifyToken", [authJwt.verifyToken, authJwt.isOnline]);
  app.get(
    "/get_user_infor",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.userInfor
  );
  app.post(
    "/delete_user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
  app.post(
    "/assign_site",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.assignSite
  );
  app.post(
    "/unassign_site",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.unassignSite
  );
  app.post(
    "/update_password",
    [authJwt.verifyToken],
    controller.changePassword
  );
  app.post(
    "/reset_password",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.resetPasswordAdmin
  );
  app.post("/forget_password", controller.forgetPassword);
  app.post("/reset_password_email", controller.resetPasswordEmail);
};
