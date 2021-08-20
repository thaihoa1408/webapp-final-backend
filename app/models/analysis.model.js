const mongoose = require("mongoose");
const Analysis = mongoose.model(
  "Analysis",
  new mongoose.Schema({
    ref: String,
    name: String,
    description: String,
    url: Array,
    schema: Array,
    yaxis: Array,
    siteid: String,
  })
);
module.exports = Analysis;
