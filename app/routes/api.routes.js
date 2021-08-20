const controller = require("../controllers/api.controller");
module.exports = function (app) {
  app.get("/entityget", controller.entityGet);
  app.post("/entityadd", controller.entityAdd);
  app.post("/entityupdate", controller.entityUpdate);
  app.get("/entitydelete", controller.entityDelete);
  app.get("/entitygetrecords", controller.entityGetRecords);
  app.get("/provisionstatus", controller.provisionStatus);
  app.get("/provisionbegin", controller.provisionBegin);
  app.get("/provisionretrieve", controller.provisionRetrieve);
  app.get("/entitygetrecordsdaily", controller.entityGetRecordsDaily);
  app.get("/entitygetrecordsmonthly", controller.entityGetRecordsMonthly);
  app.get("/entitygetrecordsyearly", controller.entityGetRecordsYearly);
  app.get("/siteview/chartinfor", controller.getDataSiteViewChartInfor);
  app.get("/siteview/invertertable", controller.getDataSiteviewInverterTable);
};
