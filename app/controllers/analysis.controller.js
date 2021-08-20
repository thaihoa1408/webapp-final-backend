const db = require("../models");
const Analysis = db.analysis;
exports.addnew = (req, res) => {
  const analysis = new Analysis({
    ref: req.userId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    schema: req.body.schema,
    yaxis: req.body.yaxis,
    siteid: req.body.siteid,
  });
  analysis.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.send({ message: "New Analysis was created successfully!" });
    }
  });
};
exports.analysisGet = (req, res) => {
  Analysis.find({ ref: req.userId }).exec((err, items) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      var analysises = [];
      items.forEach(function (item) {
        analysises.push({
          id: item._id,
          name: item.name,
          description: item.description,
          url: item.url,
          schema: item.schema,
          yaxis: item.yaxis,
          siteid: item.siteid,
        });
      });
      return res.send(analysises);
    }
  });
};
exports.analysisDelete = (req, res) => {
  Analysis.findById(req.body.analysisId).exec((err, analysisObj) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      analysisObj.remove();
      res.send({ message: "Analysis has been deleted" });
    }
  });
};
