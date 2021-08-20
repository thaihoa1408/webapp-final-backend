var fs = require("fs");
exports.datatypeInfor = (req, res) => {
  fs.readFile("./app/data/datatype.json", (err, data) => {
    if (err) throw err;
    let dataObj = JSON.parse(data);
    return res.send(dataObj);
  });
};
exports.updateDatatype = (req, res) => {
  let dataObj = req.body.data;
  const data = JSON.stringify(dataObj);

  // write file to disk
  fs.writeFile("./app/data/datatype.json", data, "utf8", (err) => {
    if (err) {
      return res.send({ message: "Update Data Type Failed!" });
    } else {
      return res.send({ message: "Update Data Type Successfully!" });
    }
  });
};
