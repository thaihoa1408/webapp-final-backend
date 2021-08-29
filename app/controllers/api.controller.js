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
exports.getDataSiteviewProduction = async (req, res) => {
  const handleSetInverterProduction = (data) => {
    let sum = null;
    data.map((item) => {
      if (
        item.InverterProduction !== null &&
        item.InverterProduction.length !== 0
      ) {
        sum =
          sum +
          item.InverterProduction[0].last.v -
          item.InverterProduction[0].first.v;
      }
    });
    return sum;
  };
  const handleSetSiteProduction = (data) => {
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
  const handleData = (data1, data2) => {
    return {
      inverterProduction: roundfunction(handleSetInverterProduction(data1), 2),
      siteProduction: roundfunction(handleSetSiteProduction(data2), 2),
    };
  };
  const { siteid, time, date } = req.query;
  const [firstResponse] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?ancestor=${siteid}&kind=Inverter`)
      .then((response) => response.data.data),
  ]);
  const [secondResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=EnergyMeter`
      )
      .then((response) => response.data.data),
  ]);
  let url1 = [];
  let url2 = [];
  if (firstResponse.length) {
    firstResponse.map((item, index) => {
      url1.push(
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
  }
  const thirdResponse = await Promise.all(url1);
  if (secondResponse.length) {
    secondResponse.map((item, index) => {
      url2.push(
        axios
          .get(`http://localhost:3002/entity/get/records`, {
            params: {
              id: item.id,
              attrs: "EnergyMeterProduction",
              interval: time,
              filter: "first,last",
              date: date,
            },
          })
          .then((response) => response.data.data)
      );
    });
  }
  const fourthResponse = await Promise.all(url2);
  let dataObj = handleData(thirdResponse, fourthResponse);
  return res.send(dataObj);
};
const getDataDaily1 = async (id, attrs, date, interval) => {
  const [data] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get/records`, {
        params: {
          id: id,
          attrs: attrs,
          interval: "day",
          filter: "all",
          date: date,
        },
      })
      .then((response) => response.data.data),
  ]);
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
  return objdata;
};
const getDataDaily = async (id, attrs, date, interval) => {
  const [data] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get/records`, {
        params: {
          id: id,
          attrs: attrs,
          interval: interval,
          filter: "first",
          date: date,
        },
      })
      .then((response) => response.data.data),
  ]);
  let objdata = {};
  attrs.split(",").map((item, index) => {
    if (data[`${item}`] !== null) {
      let result = [];
      data[`${item}`].map((dataItem) => {
        result.push({
          v: dataItem.first.v,
          t: dataItem.time.split("T")[1].slice(0, 5),
        });
      });
      objdata[`${item}`] = result;
    } else {
      objdata[`${item}`] = null;
    }
  });
  return objdata;
};
exports.getDataSiteviewLineColumnChart = async (req, res) => {
  const handleProduction = (data) => {
    let array = [];
    if (data.length !== 0) {
      let length = data[0].EnergyMeterProduction.length;
      for (let i = 0; i < length; i++) {
        let sum = null;
        let time = "";
        data.map((item) => {
          if (item.EnergyMeterProduction[i].v !== null) {
            sum = sum + item.EnergyMeterProduction[i].v;
          }
          time = item.EnergyMeterProduction[i].t;
        });
        array.push({
          v: sum,
          t: time,
        });
      }
    }
    return array;
  };
  const handleData = (item1, item2) => {
    let production = handleProduction(item1);
    let prevalue;
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let sign1 = false;
    let sign2 = false;
    production.map((item, index) => {
      if (item.v === null) {
        data1.push(item.v);
      } else {
        if (sign1 === false) {
          data1.push(item.v - item.v);
          sign1 = true;
        } else {
          data1.push(roundfunction(item.v - prevalue, 2));
        }
        prevalue = item.v;
      }
      data3.push(item.t);
    });
    item2.Irradiation.map((item, index) => {
      if (item.v === null) {
        data2.push(item.v);
      } else {
        if (sign2 === false) {
          data2.push(item.v - item.v);
          sign2 = true;
        } else {
          data2.push(roundfunction(item.v - prevalue, 2));
        }
        prevalue = item.v;
      }
    });
    return {
      production: data1,
      irradiation: data2,
      label: data3,
    };
  };
  const { siteid, date } = req.query;
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
    for (let i = 0; i < firstResponse.length; i++) {
      let a = await getDataDaily(
        firstResponse[i].id,
        "EnergyMeterProduction",
        date,
        "hour"
      );
      thirdResponse.push(a);
    }
  }
  if (secondResponse.length) {
    fourthResponse = await getDataDaily(
      secondResponse[0].id,
      "Irradiation",
      date,
      "hour"
    );
  }
  let objdata = handleData(thirdResponse, fourthResponse);
  return res.send(objdata);
};
exports.getDataSiteviewLineChart = async (req, res) => {
  const handleActivePower = (data) => {
    let array = [];
    if (data.length !== 0) {
      let length = data[0].ActivePower.length;
      for (let i = 0; i < length; i++) {
        let sum = null;
        let time = "";
        data.map((item) => {
          if (item.ActivePower[i].v !== null) {
            sum = sum + item.ActivePower[i].v;
          }
          time = item.ActivePower[i].t;
        });
        array.push({
          v: sum,
          t: time,
        });
      }
    }
    return array;
  };
  const handleData = (item1, item2) => {
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let activepower = handleActivePower(item1);
    activepower.map((item) => {
      if (item.v !== null) {
        data1.push(roundfunction(item.v, 2));
      } else {
        data1.push(item.v);
      }
      data3.push(item.t);
    });
    item2.GHI.map((item) => {
      if (item.v !== null) {
        data2.push(roundfunction(item.v, 2));
      } else {
        data2.push(item.v);
      }
    });
    return {
      activePower: data1,
      GHI: data2,
      label: data3,
    };
  };
  const { siteid, date } = req.query;
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
  let fourthResponse = { GHI: [] };
  if (firstResponse.length) {
    for (let i = 0; i < firstResponse.length; i++) {
      let a = await getDataDaily(
        firstResponse[i].id,
        "ActivePower",
        date,
        "10m"
      );
      thirdResponse.push(a);
    }
  }
  if (secondResponse.length) {
    fourthResponse = await getDataDaily(
      secondResponse[0].id,
      "GHI",
      date,
      "10m"
    );
  }
  let objdata = handleData(thirdResponse, fourthResponse);
  return res.send(objdata);
};
const getDataMonthly = async (id, attrs, date) => {
  const [data] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get/records`, {
        params: {
          id: id,
          attrs: attrs,
          interval: "day",
          filter: "first,last",
          date: date,
        },
      })
      .then((response) => response.data.data),
  ]);
  let objdata = {};
  let yearstr = date.split(",")[0];
  let monthstr = date.split(",")[1];
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
  return objdata;
};
exports.getDataSiteviewLineColumnChart1 = async (req, res) => {
  const handleProduction = (data) => {
    let array = [];
    if (data.length !== 0) {
      let length = data[0].EnergyMeterProduction.length;
      for (let i = 0; i < length; i++) {
        let sum = null;
        let time = "";
        data.map((item) => {
          if (item.EnergyMeterProduction[i].v !== null) {
            sum = sum + item.EnergyMeterProduction[i].v;
          }
          time = item.EnergyMeterProduction[i].t;
        });
        array.push({
          v: sum,
          t: time,
        });
      }
    }
    return array;
  };
  const handleData = (item1, item2) => {
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let production = handleProduction(item1);
    production.map((item, index) => {
      if (item.v === null) {
        data1.push(null);
      } else {
        data1.push(roundfunction(item.v / (1000 * capacity), 2));
      }
      data3.push(item.t);
    });
    item2.Irradiation.map((item, index) => {
      if (item.v !== null) {
        data2.push(roundfunction(item.v, 2));
      } else {
        data2.push(item.v);
      }
    });
    return {
      yield: data1,
      irradiation: data2,
      label: data3,
    };
  };
  const { siteid, date } = req.query;
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
    for (let i = 0; i < firstResponse.length; i++) {
      let a = await getDataMonthly(
        firstResponse[i].id,
        "EnergyMeterProduction",
        date
      );
      thirdResponse.push(a);
    }
  }
  if (secondResponse.length) {
    fourthResponse = await getDataMonthly(
      secondResponse[0].id,
      "Irradiation",
      date
    );
  }
  let objdata = handleData(thirdResponse, fourthResponse);
  return res.send(objdata);
};
exports.getDataSiteviewLineChart1 = async (req, res) => {
  const handleProduction = (data) => {
    let array = [];
    if (data.length !== 0) {
      let length = data[0].EnergyMeterProduction.length;
      for (let i = 0; i < length; i++) {
        let sum = null;
        let time = "";
        data.map((item) => {
          if (item.EnergyMeterProduction[i].v !== null) {
            sum = sum + item.EnergyMeterProduction[i].v;
          }
          time = item.EnergyMeterProduction[i].t;
        });
        array.push({
          v: sum,
          t: time,
        });
      }
    }
    return array;
  };
  const handleData = (item1, item2) => {
    let data1 = [];
    let data3 = [];
    let production = handleProduction(item1);
    for (let i = 0; i < production.length; i++) {
      if (production[i].v !== null && item2.Irradiation[i].v !== null) {
        data1.push(
          roundfunction(
            (production[i].v * 100) / (capacity * item2.Irradiation[i].v),
            2
          )
        );
      } else {
        data1.push(null);
      }
      data3.push(production[i].t);
    }
    return {
      PR: data1,
      label: data3,
    };
  };
  const { siteid, date } = req.query;
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
    for (let i = 0; i < firstResponse.length; i++) {
      let a = await getDataMonthly(
        firstResponse[i].id,
        "EnergyMeterProduction",
        date
      );
      thirdResponse.push(a);
    }
  }
  if (secondResponse.length) {
    fourthResponse = await getDataMonthly(
      secondResponse[0].id,
      "Irradiation",
      date
    );
  }
  let objdata = handleData(thirdResponse, fourthResponse);
  return res.send(objdata);
};
const getDataYearly = async (id, attrs, date) => {
  const [data] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get/records`, {
        params: {
          id: id,
          attrs: attrs,
          interval: "month",
          filter: "first,last",
          date: date,
        },
      })
      .then((response) => response.data.data),
  ]);
  let objdata = {};
  let yearstr = date;
  attrs.split(",").map((item, index) => {
    if (data[`${item}`] !== null) {
      let result = [];
      for (let i = 1; i <= 12; i++) {
        let monthstr = String(i).padStart(2, "0");
        let timestr = yearstr + "-" + monthstr;
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
  return objdata;
};
exports.getDataSiteviewLineColumnChart2 = async (req, res) => {
  const handleProduction = (data) => {
    let array = [];
    if (data.length !== 0) {
      let length = data[0].EnergyMeterProduction.length;
      for (let i = 0; i < length; i++) {
        let sum = null;
        let time = "";
        data.map((item) => {
          if (item.EnergyMeterProduction[i].v !== null) {
            sum = sum + item.EnergyMeterProduction[i].v;
          }
          time = item.EnergyMeterProduction[i].t;
        });
        array.push({
          v: sum,
          t: time,
        });
      }
    }
    return array;
  };
  const { siteid, date } = req.query;
  let label = [
    "2021-01",
    "2021-02",
    "2021-03",
    "2021-04",
    "2021-05",
    "2021-06",
    "2021-07",
    "2021-08",
    "2021-09",
    "2021-10",
    "2021-11",
    "2021-12",
  ];
  const [firstResponse] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?id=${siteid}`)
      .then((response) => response.data.data.productionBudget),
  ]);
  let data_2 = [];
  firstResponse.map((item) => {
    if (item.year === parseInt(date)) {
      item.value.map((item1) => {
        data_2.push(parseInt(item1));
      });
    }
  });
  const [secondResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=EnergyMeter`
      )
      .then((response) => response.data.data),
  ]);
  let data_1 = [];
  let thirdResponse = [];
  if (secondResponse.length) {
    for (let i = 0; i < secondResponse.length; i++) {
      let a = await getDataYearly(
        secondResponse[i].id,
        "EnergyMeterProduction",
        date
      );
      thirdResponse.push(a);
    }
    let production = handleProduction(thirdResponse);
    production.map((item) => {
      if (item.v !== null) {
        data_1.push(roundfunction(item.v, 2));
      } else {
        data_1.push(item.v);
      }
    });
  }
  let data_3 = [];
  label.map((item, index) => {
    if (data_1[index] !== null) {
      data_3.push(Math.round((data_1[index] * 100) / data_2[index]));
    } else {
      data_3.push(null);
    }
  });
  let objdata = {
    actualProduction: data_1,
    budgetProduction: data_2,
    completionRate: data_3,
    label: label,
  };
  return res.send(objdata);
};
exports.getDataSiteviewLineChart2 = async (req, res) => {
  const handleProduction = (data) => {
    let array = [];
    if (data.length !== 0) {
      let length = data[0].EnergyMeterProduction.length;
      for (let i = 0; i < length; i++) {
        let sum = null;
        let time = "";
        data.map((item) => {
          if (item.EnergyMeterProduction[i].v !== null) {
            sum = sum + item.EnergyMeterProduction[i].v;
          }
          time = item.EnergyMeterProduction[i].t;
        });
        array.push({
          v: sum,
          t: time,
        });
      }
    }
    return array;
  };
  const { siteid, date } = req.query;
  let label = [
    "2021-01",
    "2021-02",
    "2021-03",
    "2021-04",
    "2021-05",
    "2021-06",
    "2021-07",
    "2021-08",
    "2021-09",
    "2021-10",
    "2021-11",
    "2021-12",
  ];
  const [capacity] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?id=${siteid}`)
      .then((response) => response.data.data.Capacity),
  ]);
  const [firstResponse] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?id=${siteid}`)
      .then((response) => response.data.data.irradiationBudget),
  ]);
  let data_2 = [];
  firstResponse.map((item) => {
    if (item.year === parseInt(date)) {
      item.value.map((item1) => {
        data_2.push(parseInt(item1));
      });
    }
  });
  const [secondResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=WeatherStation`
      )
      .then((response) => response.data.data),
  ]);
  let data_1 = [];
  let data_3 = [];
  if (secondResponse.length) {
    const thirdResponse = await getDataYearly(
      secondResponse[0].id,
      "Irradiation",
      date
    );
    thirdResponse.Irradiation.map((item) => {
      if (item.v !== null) {
        data_1.push(roundfunction(item.v, 2));
      } else {
        data_1.push(item.v);
      }
    });
  }
  const [fourthResponse] = await Promise.all([
    axios
      .get(
        `http://localhost:3002/entity/get?ancestor=${siteid}&kind=EnergyMeter`
      )
      .then((response) => response.data.data),
  ]);
  let fifthResponse = [];
  if (fourthResponse.length) {
    for (let i = 0; i < fourthResponse.length; i++) {
      let a = await getDataYearly(
        fourthResponse[i].id,
        "EnergyMeterProduction",
        date
      );
      fifthResponse.push(a);
    }
    let production = handleProduction(fifthResponse);
    production.map((item) => {
      if (item.v !== null) {
        data_3.push(roundfunction(item.v / (1000 * capacity), 2));
      } else {
        data_3.push(null);
      }
    });
  }
  let objdata = {
    actualIrradiation: data_1,
    theoreticalIrradiation: data_2,
    yield: data_3,
    label: label,
  };
  return res.send(objdata);
};
exports.getDataSiteList = async (req, res) => {
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
  const handleIrradiation = (data) => {
    let sum = null;
    data.map((item) => {
      if (item.Irradiation !== null && item.Irradiation.length !== 0) {
        sum = sum + item.Irradiation[0].last.v - item.Irradiation[0].first.v;
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
  const handleIrradiance = (data) => {
    let sum = null;
    data.map((item) => {
      if (item.GHI !== null && item.GHI.length !== 0) {
        sum = sum + item.GHI[0].last.v;
      }
    });
    return sum;
  };
  const { siteids, date } = req.query;
  const entitiesget = await Promise.all(
    siteids.map((item, index) =>
      axios
        .get(`http://localhost:3002/entity/get?id=${item}`)
        .then((response) => response.data.data)
    )
  );
  let url1 = [];
  entitiesget.map((item, index) => {
    url1.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=EnergyMeter`
        )
        .then((response) => response.data.data)
    );
  });
  const firstResponse = await Promise.all(url1);
  let url2 = [];
  entitiesget.map((item, index) => {
    url2.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=WeatherStation`
        )
        .then((response) => response.data.data)
    );
  });
  const secondResponse = await Promise.all(url2);
  let productiondata = [];
  let activepowerdata = [];
  let irradiationdata = [];
  let ghidata = [];
  if (firstResponse.length) {
    for (let i = 0; i < firstResponse.length; i++) {
      if (firstResponse[i].length) {
        let a = [];
        firstResponse[i].map((item1) => {
          a.push(
            axios
              .get(`http://localhost:3002/entity/get/records`, {
                params: {
                  id: item1.id,
                  attrs: "EnergyMeterProduction,ActivePower",
                  interval: "day",
                  filter: "first,last",
                  date: date,
                },
              })
              .then((response) => response.data.data)
          );
        });
        const responseitem = await Promise.all(a);
        productiondata.push(handleProduction(responseitem));
        activepowerdata.push(handleActivePower(responseitem));
      } else {
        productiondata.push(handleProduction([]));
        activepowerdata.push(handleActivePower([]));
      }
    }
  }
  if (secondResponse.length) {
    for (let i = 0; i < secondResponse.length; i++) {
      if (secondResponse[i].length) {
        let a = [];
        secondResponse[i].map((item1) => {
          a.push(
            axios
              .get(`http://localhost:3002/entity/get/records`, {
                params: {
                  id: item1.id,
                  attrs: "Irradiation,GHI",
                  interval: "day",
                  filter: "first,last",
                  date: date,
                },
              })
              .then((response) => response.data.data)
          );
        });
        const responseitem = await Promise.all(a);
        irradiationdata.push(handleIrradiation(responseitem));
        ghidata.push(handleIrradiance(responseitem));
      } else {
        irradiationdata.push(handleIrradiation([]));
        ghidata.push(handleIrradiance([]));
      }
    }
  }
  let objdata = [];
  entitiesget.map((item, index) => {
    objdata.push({
      name: item.name,
      id: item.id,
      capacity: item.Capacity,
      operation_state: "Normal",
      connection_state: "--",
      production_today: roundfunction(productiondata[index], 2),
      active_power: roundfunction(activepowerdata[index], 2),
      power_ratio: roundfunction(
        (activepowerdata[index] * 100) / (1000 * item.Capacity),
        2
      ),
      irradiation: roundfunction(irradiationdata[index], 2),
      irradiance: roundfunction(ghidata[index], 2),
    });
  });
  return res.send(objdata);
};
exports.getDataLeaderboardProduction = async (req, res) => {
  const handleProduction = (data) => {
    let sum = null;
    data.map((item) => {
      item.EnergyMeterProduction.map((item1) => {
        sum = sum + item1.v;
      });
    });
    return sum;
  };
  const handleProductionMonth = (data) => {
    let a = [];
    for (let i = 0; i < 12; i++) {
      let sum = null;
      data.map((item) => {
        sum = sum + item.EnergyMeterProduction[i].v;
      });
      a.push(sum);
    }

    return a;
  };
  const { siteids, date } = req.query;
  let entities = await Promise.all(
    siteids.map((item, index) =>
      axios
        .get(`http://localhost:3002/entity/get?id=${item}`)
        .then((response) => response.data.data)
    )
  );
  let url1 = [];
  entities.map((item, index) => {
    url1.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=EnergyMeter`
        )
        .then((response) => response.data.data)
    );
  });
  let productionbudget = [];
  entities.map((item) => {
    let sum = null;

    item.productionBudget.map((item) => {
      if (item.year == date) {
        item.value.map((item1) => {
          sum = sum + parseFloat(item1);
        });
      }
    });
    productionbudget.push(sum);
  });
  let totalproductionbudgetmonth = [];
  for (let i = 0; i < 12; i++) {
    let sum = null;
    entities.map((item) => {
      item.productionBudget.map((item) => {
        if (item.year == date) {
          sum = sum + parseFloat(item.value[i]);
        }
      });
    });
    totalproductionbudgetmonth.push(sum);
  }
  const firstResponse = await Promise.all(url1);
  let productiondata = [];
  let productiondataMonth = [];
  if (firstResponse.length) {
    for (let i = 0; i < firstResponse.length; i++) {
      if (firstResponse[i].length) {
        let responseitem = [];
        for (let j = 0; j < firstResponse[i].length; j++) {
          let a = await getDataYearly(
            firstResponse[i][j].id,
            "EnergyMeterProduction",
            date
          );
          responseitem.push(a);
        }
        productiondata.push(handleProduction(responseitem));
        productiondataMonth.push(handleProductionMonth(responseitem));
      } else {
        productiondata.push(null);
      }
    }
  }
  //
  let completionrate = [];
  productionbudget.map((item, index) => {
    completionrate.push(roundfunction((productiondata[index] * 100) / item, 2));
  });
  let totalproductiondata = null;
  productiondata.map((item) => {
    totalproductiondata = totalproductiondata + item;
  });
  let totalproductionbudget = null;
  productionbudget.map((item) => {
    totalproductionbudget = totalproductionbudget + item;
  });
  //
  let totalCompleteRate = roundfunction(
    (totalproductiondata * 100) / totalproductionbudget,
    2
  );
  let totalproductiondatamonth = [];
  for (let i = 0; i < 12; i++) {
    let sum = null;
    productiondataMonth.map((item) => {
      sum = sum + item[i];
    });
    totalproductiondatamonth.push(sum);
  }
  //
  let totalcompleteratemonth = [];
  for (let i = 0; i < 12; i++) {
    totalcompleteratemonth.push(
      roundfunction(
        (totalproductiondatamonth[i] * 100) / totalproductionbudgetmonth[i],
        2
      )
    );
  }
  let objdata = {
    completionrate: completionrate,
    totalcompletionrate: totalCompleteRate,
    totalcompleteratemonth: totalcompleteratemonth,
  };
  return res.send(objdata);
};
exports.getDataLeaderboardPerformanceRanking = async (req, res) => {
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
  const handleIrradiation = (data) => {
    let sum = null;
    data.map((item) => {
      if (item.Irradiation !== null && item.Irradiation.length !== 0) {
        sum = sum + item.Irradiation[0].last.v - item.Irradiation[0].first.v;
      }
    });
    return sum;
  };
  const { siteids, time, date, measurement } = req.query;
  const entitiesget = await Promise.all(
    siteids.map((item, index) =>
      axios
        .get(`http://localhost:3002/entity/get?id=${item}`)
        .then((response) => response.data.data)
    )
  );
  let url1 = [];
  entitiesget.map((item, index) => {
    url1.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=EnergyMeter`
        )
        .then((response) => response.data.data)
    );
  });
  const firstResponse = await Promise.all(url1);
  let url2 = [];
  entitiesget.map((item, index) => {
    url2.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=WeatherStation`
        )
        .then((response) => response.data.data)
    );
  });
  let productiondata = [];
  let irradiationdata = [];
  const secondResponse = await Promise.all(url2);
  if (firstResponse.length) {
    for (let i = 0; i < firstResponse.length; i++) {
      if (firstResponse[i].length) {
        let a = [];
        firstResponse[i].map((item1) => {
          a.push(
            axios
              .get(`http://localhost:3002/entity/get/records`, {
                params: {
                  id: item1.id,
                  attrs: "EnergyMeterProduction",
                  interval: time,
                  filter: "first,last",
                  date: date,
                },
              })
              .then((response) => response.data.data)
          );
        });
        const responseitem = await Promise.all(a);
        productiondata.push(handleProduction(responseitem));
      } else {
        productiondata.push(handleProduction([]));
      }
    }
  }
  if (secondResponse.length) {
    for (let i = 0; i < secondResponse.length; i++) {
      if (secondResponse[i].length) {
        let a = [];
        secondResponse[i].map((item1) => {
          a.push(
            axios
              .get(`http://localhost:3002/entity/get/records`, {
                params: {
                  id: item1.id,
                  attrs: "Irradiation",
                  interval: time,
                  filter: "first,last",
                  date: date,
                },
              })
              .then((response) => response.data.data)
          );
        });
        const responseitem = await Promise.all(a);
        irradiationdata.push(handleIrradiation(responseitem));
      } else {
        irradiationdata.push(handleIrradiation([]));
      }
    }
  }
  let data1 = [];
  let data2 = [];
  entitiesget.map((item, index) => {
    data2.push(item.name);
    if (measurement === "Yield") {
      if (productiondata[index] === null) {
        data1.push(null);
      } else {
        data1.push(
          roundfunction(productiondata[index] / (1000 * item.Capacity), 2)
        );
      }
    }
    if (measurement === "PR") {
      if (productiondata[index] === null || irradiationdata[index] === null) {
        data1.push(null);
      } else {
        data1.push(
          roundfunction(
            (productiondata[index] * 100) /
              (item.Capacity * irradiationdata[index]),
            2
          )
        );
      }
    }
  });
  let objdata = {
    data1: data1,
    data2: data2,
  };
  return res.send(objdata);
};
exports.getDataFleetviewOverview = async (req, res) => {
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
    return {
      production: roundfunction(production / 1000, 2),
      yield: roundfunction(production / (1000 * capacity), 2),
      irradiation: roundfunction(irradiation, 2),
      power_ratio: roundfunction((activepower * 100) / (1000 * capacity), 2),
    };
  };
  const { siteid, time, date } = req.query;
  const [capacity] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?`, {
        params: {
          id: siteid,
        },
      })
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
  let url = [];
  if (firstResponse.length) {
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
  let objdata = handleData(thirdResponse, fourthResponse);
  return res.send(objdata);
};
exports.getDataFleetviewMap = async (req, res) => {
  const handleProduction = (data) => {
    let sum = null;
    data.map((item) => {
      if (
        item.EnergyMeterProduction !== null &&
        item.EnergyMeterProduction.length !== 0
      ) {
        sum = sum + item.EnergyMeterProduction[0].last.v;
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
  const handleGHI = (data) => {
    let result = null;
    data.map((item) => {
      if (item.GHI !== null && item.GHI.length !== 0) {
        result = item.GHI[0].last.v;
      }
    });
    return result;
  };
  const { siteids, time, date } = req.query;
  const entitiesget = await Promise.all(
    siteids.map((item, index) =>
      axios
        .get(`http://localhost:3002/entity/get?id=${item}`)
        .then((response) => response.data.data)
    )
  );
  let url1 = [];
  entitiesget.map((item, index) => {
    url1.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=EnergyMeter`
        )
        .then((response) => response.data.data)
    );
  });
  const firstResponse = await Promise.all(url1);
  let url2 = [];
  entitiesget.map((item, index) => {
    url2.push(
      axios
        .get(
          `http://localhost:3002/entity/get?ancestor=${item.id}&kind=WeatherStation`
        )
        .then((response) => response.data.data)
    );
  });
  const secondResponse = await Promise.all(url2);
  let productiondata = [];
  let activepowerdata = [];
  let GHIdata = [];
  if (firstResponse.length) {
    for (let i = 0; i < firstResponse.length; i++) {
      if (firstResponse[i].length) {
        let a = [];
        firstResponse[i].map((item1) => {
          a.push(
            axios
              .get(`http://localhost:3002/entity/get/records`, {
                params: {
                  id: item1.id,
                  attrs: "EnergyMeterProduction,ActivePower",
                  interval: time,
                  filter: "first,last",
                  date: date,
                },
              })
              .then((response) => response.data.data)
          );
        });
        const responseitem = await Promise.all(a);
        productiondata.push(roundfunction(handleProduction(responseitem), 2));
        activepowerdata.push(roundfunction(handleActivePower(responseitem), 2));
      } else {
        productiondata.push(handleProduction([]));
        activepowerdata.push(handleActivePower([]));
      }
    }
  }
  if (secondResponse.length) {
    for (let i = 0; i < secondResponse.length; i++) {
      if (secondResponse[i].length) {
        let a = [];
        secondResponse[i].map((item1) => {
          a.push(
            axios
              .get(`http://localhost:3002/entity/get/records`, {
                params: {
                  id: item1.id,
                  attrs: "GHI",
                  interval: time,
                  filter: "first,last",
                  date: date,
                },
              })
              .then((response) => response.data.data)
          );
        });
        const responseitem = await Promise.all(a);
        GHIdata.push(roundfunction(handleGHI(responseitem), 2));
      } else {
        GHIdata.push(handleGHI([]));
      }
    }
  }
  let objdata = [];
  entitiesget.map((item, index) => {
    objdata.push({
      sitename: item.name,
      production: productiondata[index],
      activepower: activepowerdata[index],
      ghi: GHIdata[index],
    });
  });
  return res.send(objdata);
};
exports.getDataTopologyAnalysisInfor = async (req, res) => {
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
  const handleGHI = (data) => {
    if (data.GHI !== null && data.GHI.length !== 0) {
      return data.GHI[0].last.v;
    } else {
      return null;
    }
  };
  const handleData = (data1, data2) => {
    let production = handleProduction(data1);
    let activepower = handleActivePower(data1);
    let ghi = handleGHI(data2);
    return {
      ghi: roundfunction(ghi, 2),
      activepower: roundfunction(activepower, 2),
      yield: roundfunction(production / (1000 * capacity), 2),
    };
  };
  const { siteid, time, date } = req.query;
  const [capacity] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?`, {
        params: {
          id: siteid,
        },
      })
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
  let fourthResponse = { GHI: [] };
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
            attrs: "GHI",
            interval: time,
            filter: "first,last",
            date: date,
          },
        })
        .then((response) => response.data.data),
    ]);
  }
  let objdata = handleData(thirdResponse, fourthResponse);
  return res.send(objdata);
};
exports.getDataTopologyAnalysisStringState = async (req, res) => {
  const handleStringCurrent = (data) => {
    let array = [];
    for (let i = 1; i <= 20; i++) {
      let key = "InverterStringCurrent" + i.toString();
      if (data[`${key}`] !== null) {
        if (data[`${key}`].length !== 0) {
          array.push(roundfunction(data[`${key}`][0].last.v, 2));
        } else {
          array.push(null);
        }
      } else {
        array.push(false);
      }
    }
    return array;
  };
  const { siteid, time, date } = req.query;
  const [firstResponse] = await Promise.all([
    axios
      .get(`http://localhost:3002/entity/get?ancestor=${siteid}&kind=Inverter`)
      .then((response) => response.data.data),
  ]);
  url = [];
  firstResponse.map((item, index) => {
    url.push(
      axios
        .get(`http://localhost:3002/entity/get/records`, {
          params: {
            id: item.id,
            attrs:
              "InverterProduction,InverterActivePower,InverterInputPower,InverterEfficiency,InverterIrradiation,InverterInternalTemperature,InverterStringCurrent,InverterStringCurrent1,InverterStringCurrent2,InverterStringCurrent3,InverterStringCurrent4,InverterStringCurrent5,InverterStringCurrent6,InverterStringCurrent7,InverterStringCurrent8,InverterStringCurrent9,InverterStringCurrent10,InverterStringCurrent11,InverterStringCurrent12,InverterStringCurrent13,InverterStringCurrent14,InverterStringCurrent15,InverterStringCurrent16,InverterStringCurrent17,InverterStringCurrent18,InverterStringCurrent19,InverterStringCurrent20,InverterOperationState",
            interval: time,
            filter: "first,last",
            date: date,
          },
        })
        .then((response) => response.data.data)
    );
  });
  const secondResponse = await Promise.all(url);
  let stringcurrent = [];
  firstResponse.map((item, index) => {
    let a = handleStringCurrent(secondResponse[index]);
    stringcurrent.push(a);
  });
  let a = [];
  firstResponse.map((item, index) => {
    a.push({
      name: item.name,
      yield:
        secondResponse[index].InverterProduction !== null &&
        secondResponse[index].InverterProduction.length !== 0
          ? roundfunction(
              (secondResponse[index].InverterProduction[0].last.v -
                secondResponse[index].InverterProduction[0].first.v) /
                item.Capacity,
              2
            )
          : "--",
      efficiency:
        secondResponse[index].InverterEfficiency !== null &&
        secondResponse[index].InverterEfficiency.length !== 0
          ? roundfunction(secondResponse[index].InverterEfficiency[0].last.v, 2)
          : "--",
      internal_temp:
        secondResponse[index].InverterInternalTemperature !== null &&
        secondResponse[index].InverterInternalTemperature.length !== 0
          ? roundfunction(
              secondResponse[index].InverterInternalTemperature[0].last.v,
              2
            )
          : "--",
      string_current: stringcurrent[index],
    });
  });
  res.send(a);
};
