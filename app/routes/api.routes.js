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
  //api get data for siteview page
  app.get("/siteview/chartinfor", controller.getDataSiteViewChartInfor);
  app.get("/siteview/invertertable", controller.getDataSiteviewInverterTable);
  app.get("/siteview/productioninfor", controller.getDataSiteviewProduction);
  app.get(
    "/siteview/linecolumnchart",
    controller.getDataSiteviewLineColumnChart
  );
  app.get(
    "/siteview/linecolumnchart1",
    controller.getDataSiteviewLineColumnChart1
  );
  app.get(
    "/siteview/linecolumnchart2",
    controller.getDataSiteviewLineColumnChart2
  );
  app.get("/siteview/linechart", controller.getDataSiteviewLineChart);
  app.get("/siteview/linechart1", controller.getDataSiteviewLineChart1);
  app.get("/siteview/linechart2", controller.getDataSiteviewLineChart2);
  //api get data for sitelist page
  app.get("/sitelist", controller.getDataSiteList);
  app.get("/leaderboard/production", controller.getDataLeaderboardProduction);
  app.get(
    "/leaderboard/performanceranking",
    controller.getDataLeaderboardPerformanceRanking
  );
  app.get("/fleetview/overview", controller.getDataFleetviewOverview);
  app.get("/fleetview/map", controller.getDataFleetviewMap);
  app.get("/topologyanalysis/infor", controller.getDataTopologyAnalysisInfor);
  app.get(
    "/topologyanalysis/stringstate",
    controller.getDataTopologyAnalysisStringState
  );
};
