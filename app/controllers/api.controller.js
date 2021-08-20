const axios = require("axios");
exports.entityGet = async (req, res) => {
  const { id, ids, parent, ancestor, attrs, ...queries } = req.query;
  await axios
    .get(`http://localhost:3002/entity/get`, {
      params: {
        id: id,
        ids: ids,
        attrs: attrs,
        parent: parent,
        ancestor: ancestor,
        ...queries,
      },
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityAdd = async (req, res) => {
  const { data, alias, link, parent } = req.body;
  await axios
    .post(`http://localhost:3002/entity/add`, {
      data: data,
      alias: alias,
      link: link,
      parent: parent,
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityUpdate = async (req, res) => {
  const { id, data, alias, link } = req.body;
  await axios
    .post(`http://localhost:3002/entity/update`, {
      id: id,
      data: data,
      alias: alias,
      link: link,
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityDelete = async (req, res) => {
  const { id, ids, parent, ancestor, ...queries } = req.query;
  await axios
    .get(`http://localhost:3002/entity/delete`, {
      params: {
        id: id,
        ids: ids,
        parent: parent,
        ancestor: ancestor,
        ...queries,
      },
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityGetRecords = async (req, res) => {
  const { id, attrs, interval, filter, date, from, to } = req.query;
  await axios
    .get(`http://localhost:3002/entity/get/records`, {
      params: {
        id: id,
        attrs: attrs,
        interval: interval,
        filter: filter,
        date: date,
        from: from,
        to: to,
      },
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.provisionStatus = async (req, res) => {
  const { entity } = req.query;
  await axios
    .get(`http://localhost:3002/provision/status`, {
      params: {
        entity: entity,
      },
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.provisionBegin = async (req, res) => {
  const { entity, timeout } = req.query;
  await axios
    .get(`http://localhost:3002/provision/begin`, {
      params: {
        entity: entity,
        timeout: timeout,
      },
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.provisionRetrieve = async (req, res) => {
  const { entity } = req.query;
  await axios
    .get(`http://localhost:3002/provision/retrieve`, {
      params: {
        entity: entity,
      },
    })
    .then((response) => {
      if (response.data.data) {
        return res.send(response.data.data);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityGetRecordsDaily = async (req, res) => {
  const { id, attrs, date, interval } = req.query;
  await axios
    .get(`http://localhost:3002/entity/get/records`, {
      params: {
        id: id,
        attrs: attrs,
        interval: "day",
        filter: "all",
        date: date,
      },
    })
    .then((response) => {
      if (response.data.data) {
        let data = response.data.data;
        let objdata = {};
        attrs.split(",").map((item, index) => {
          if (data[`${item}`] !== null) {
            let result = [];
            let timestep = parseInt(interval);
            for (let i1 = 0; i1 <= 23; i1++) {
              for (let i2 = 0; i2 < 60; i2 = i2 + timestep) {
                let hourstr;
                let minstr;
                if (i1 < 10) {
                  hourstr = "0" + i1.toString();
                } else {
                  hourstr = i1.toString();
                }
                if (i2 < 10) {
                  minstr = "0" + i2.toString();
                } else {
                  minstr = i2.toString();
                }
                let timestr = hourstr + ":" + minstr;
                let flag = 0;
                if (data[`${item}`].length !== 0) {
                  let dataItem = data[`${item}`][0].all;
                  dataItem.every((item1, index1) => {
                    //tach lay gio va phutS
                    let a = item1.t.split("T")[1].slice(0, 5);
                    if (a === timestr) {
                      result.push({
                        v: item1.v,
                        t: timestr,
                      });

                      flag = 1;
                      return false;
                    }
                    return true;
                  });
                }
                if (flag === 0) {
                  result.push({
                    v: null,
                    t: timestr,
                  });
                }
              }
            }
            objdata[`${item}`] = result;
          } else {
            objdata[`${item}`] = null;
          }
        });
        return res.send(objdata);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityGetRecordsMonthly = async (req, res) => {
  const { id, attrs, month, interval } = req.query;
  await axios
    .get(`http://localhost:3002/entity/get/records`, {
      params: {
        id: id,
        attrs: attrs,
        interval: "day",
        filter: "first,last",
        date: month,
      },
    })
    .then((response) => {
      if (response.data.data) {
        let data = response.data.data;
        let objdata = {};
        let yearstr = month.split(",")[0];
        let monthstr = month.split(",")[1];
        let numDayofMonth;
        if (monthstr === "02") {
          numDayofMonth = 29;
        } else if (
          monthstr === "04" ||
          monthstr === "06" ||
          monthstr === "09" ||
          monthstr === "11"
        ) {
          numDayofMonth = 30;
        } else {
          numDayofMonth = 31;
        }
        attrs.split(",").map((item, index) => {
          if (data[`${item}`] !== null) {
            let result = [];
            for (let i = 1; i <= numDayofMonth; i++) {
              let daystr = String(i).padStart(2, "0");
              let timestr = yearstr + "-" + monthstr + "-" + daystr;
              let flag = 0;
              if (data[`${item}`].length !== 0) {
                let dataItem = data[`${item}`];
                dataItem.every((item1, index1) => {
                  let a = item1.time.split("T")[0];
                  if (a === timestr) {
                    result.push({
                      v: item1.last.v - item1.first.v,
                      t: timestr,
                    });
                    flag = 1;
                    return false;
                  }
                  return true;
                });
              }
              if (flag === 0) {
                result.push({
                  v: null,
                  t: timestr,
                });
              }
            }
            objdata[`${item}`] = result;
          } else {
            objdata[`${item}`] = null;
          }
        });
        return res.send(objdata);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
exports.entityGetRecordsYearly = async (req, res) => {
  const { id, attrs, year } = req.query;
  await axios
    .get(`http://localhost:3002/entity/get/records`, {
      params: {
        id: id,
        attrs: attrs,
        interval: "month",
        filter: "first,last",
        date: year,
      },
    })
    .then((response) => {
      if (response.data.data) {
        let data = response.data.data;
        let objdata = {};
        let yearstr = year;
        attrs.split(",").map((item, index) => {
          if (data[`${item}`] !== null) {
            let result = [];
            for (let i = 1; i <= 12; i++) {
              let monthstr = String(i).padStart(2, "0");
              let timestr = year + "-" + monthstr;
              let flag = 0;
              if (data[`${item}`].length !== 0) {
                let dataItem = data[`${item}`];
                dataItem.every((item1, index1) => {
                  let a = item1.time.split("T")[0].slice(0, 7);
                  if (a === timestr) {
                    result.push({
                      v: item1.last.v - item1.first.v,
                      t: timestr,
                    });
                    flag = 1;
                    return false;
                  }
                  return true;
                });
              }
              if (flag === 0) {
                result.push({
                  v: null,
                  t: timestr,
                });
              }
            }
            objdata[`${item}`] = result;
          } else {
            objdata[`${item}`] = null;
          }
        });
        return res.send(objdata);
      }
    })
    .catch((err) => {
      return res.send(err.data);
    });
};
const roundfunction = (value, number) => {
  if (value === null) {
    return null;
  } else {
    let digit = 1 * Math.pow(10, number);
    return Math.round(value * digit) / digit;
  }
};
exports.getDataSiteViewChartInfor = async (req, res) => {
  const handleProduction = (data) => {
    let sum = null;
    data.map((item) => {
      if (
        item.EnergyMeterProduction !== null &&
        item.EnergyMeterProduction.length !== 0
      ) {
        sum =
          sum +
          item.EnergyMeterProduction[0].last.v -
          item.EnergyMeterProduction[0].first.v;
      }
    });
    return sum;
  };
  const handleActivePower = (data) => {
    let sum = null;
    data.map((item) => {
      if (item.ActivePower !== null && item.ActivePower.length !== 0) {
        sum = sum + item.ActivePower[0].last.v;
      }
    });
    return sum;
  };
  const handleIrradiation = (data) => {
    if (data.Irradiation !== null && data.Irradiation.length !== 0) {
      return data.Irradiation[0].last.v - data.Irradiation[0].first.v;
    } else {
      return null;
    }
  };
  const handleData = (data1, data2) => {
    let production = handleProduction(data1);
    let activepower = handleActivePower(data1);
    let irradiation = handleIrradiation(data2);
    if (time === "day") {
      let dataObj = {
        production: roundfunction(production, 3),
        yield: roundfunction(production / (1000 * capacity), 3),
        irradiation: roundfunction(irradiation, 3),
        powerratio: roundfunction((activepower * 100) / (1000 * capacity), 3),
      };
      return dataObj;
    } else {
      let dataObj = {
        production: roundfunction(production, 3),
        yield: roundfunction(production / (1000 * capacity), 3),
        irradiation: roundfunction(irradiation, 3),
        powerratio: roundfunction(
          (production * 100) / (capacity * irradiation),
          3
        ),
      };
      return dataObj;
    }
  };
  const { siteid, time, date } = req.query;
  const [capacity] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?id=${siteid}`)
      .then((response) => response.data.data.Capacity),
  ]);
  const [firstResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=EnergyMeter`
      )
      .then((response) => response.data.data),
  ]);
  const [secondResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=WeatherStation`
      )
      .then((response) => response.data.data),
  ]);

  let thirdResponse = [];
  let fourthResponse = { Irradiation: [] };

  if (firstResponse.length) {
    let url = [];
    firstResponse.map((item, index) => {
      url.push(
        axios
          .get(`http://localhost:3002/entity/get/records`, {
            params: {
              id: item.id,
              attrs: "EnergyMeterProduction,ActivePower",
              interval: time,
              filter: "first,last",
              date: date,
            },
          })
          .then((response) => response.data.data)
      );
    });
    thirdResponse = await Promise.all(url);
  }
  if (secondResponse.length) {
    [fourthResponse] = await Promise.all([
      axios
        .get(`http://localhost:3002/entity/get/records`, {
          params: {
            id: secondResponse[0].id,
            attrs: "Irradiation",
            interval: time,
            filter: "first,last",
            date: date,
          },
        })
        .then((response) => response.data.data),
    ]);
  }
  let dataObj = handleData(thirdResponse, fourthResponse);
  return res.send(dataObj);
};
exports.getDataSiteviewInverterTable = async (req, res) => {
  const handleData = (firstResponse, secondResponse, fourthResponse) => {
    if (time === "day") {
      let a = [];
      firstResponse.map((item, index) => {
        a.push({
          name: item.name,
          InverterProduction:
            secondResponse[index].InverterProduction !== null &&
            secondResponse[index].InverterProduction.length !== 0
              ? roundfunction(
                  secondResponse[index].InverterProduction[0].last.v -
                    secondResponse[index].InverterProduction[0].first.v,
                  3
                )
              : null,
          InverterYield:
            secondResponse[index].InverterProduction !== null &&
            secondResponse[index].InverterProduction.length !== 0
              ? roundfunction(
                  (secondResponse[index].InverterProduction[0].last.v -
                    secondResponse[index].InverterProduction[0].first.v) /
                    item.Capacity,
                  3
                )
              : null,

          InverterPowerRatio:
            secondResponse[index].InverterActivePower !== null &&
            secondResponse[index].InverterActivePower.length !== 0
              ? roundfunction(
                  secondResponse[index].InverterActivePower[0].last.v /
                    item.Capacity,
                  3
                )
              : null,
        });
      });
      return a;
    } else {
      let a = [];
      firstResponse.map((item, index) => {
        a.push({
          name: item.name,
          InverterProduction:
            secondResponse[index].InverterProduction !== null &&
            secondResponse[index].InverterProduction.length !== 0
              ? roundfunction(
                  secondResponse[index].InverterProduction[0].last.v -
                    secondResponse[index].InverterProduction[0].first.v,
                  3
                )
              : null,
          InverterYield:
            secondResponse[index].InverterProduction !== null &&
            secondResponse[index].InverterProduction.length !== 0
              ? roundfunction(
                  (secondResponse[index].InverterProduction[0].last.v -
                    secondResponse[index].InverterProduction[0].first.v) /
                    item.Capacity,
                  3
                )
              : null,
          InverterPowerRatio:
            secondResponse[index].InverterProduction !== null &&
            secondResponse[index].InverterProduction.length !== 0 &&
            fourthResponse.Irradiation !== null &&
            fourthResponse.Irradiation.length !== 0
              ? roundfunction(
                  ((secondResponse[index].InverterProduction[0].last.v -
                    secondResponse[index].InverterProduction[0].first.v) *
                    100) /
                    ((fourthResponse.Irradiation[0].last.v -
                      fourthResponse.Irradiation[0].first.v) *
                      item.Capacity),
                  3
                )
              : null,
        });
      });
      return a;
    }
  };
  const { siteid, time, date } = req.query;
  let url = [];
  const [firstResponse] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?ancestor=${siteid}&kind=Inverter`)
      .then((response) => response.data.data),
  ]);
  firstResponse.map((item, index) => {
    url.push(
      axios
        .get(`http://localhost:3002/entity/get/records`, {
          params: {
            id: item.id,
            attrs: "InverterProduction,InverterActivePower",
            interval: time,
            filter: "first,last",
            date: date,
          },
        })
        .then((response) => response.data.data)
    );
  });
  const secondResponse = await Promise.all(url);
  const [thirdResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=WeatherStation`
      )
      .then((response) => response.data.data),
  ]);
  let fourthResponse;
  if (thirdResponse.length) {
    [fourthResponse] = await Promise.all([
      axios
        .get(`http://localhost:3002/entity/get/records`, {
          params: {
            id: thirdResponse[0].id,
            attrs: "Irradiation",
            interval: time,
            filter: "first,last",
            date: date,
          },
        })
        .then((response) => response.data.data),
    ]);
  }
  let objData = handleData(firstResponse, secondResponse, fourthResponse);
  return res.send(objData);
};
