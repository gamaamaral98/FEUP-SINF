var express = require("express");
var router = express.Router();
var { request } = require("../utils/utils");

const url = process.env.URL;

var warehouses = () => {
  return request("get", url + "/materialscore/warehouses", null);
};

var items = () => {
  return request("get", url + "/materialscore/materialsitems", null);
};

var transferItems = data => {
  return request(
    "post",
    url + "/materialsmanagement/stockTransferOrders",
    data
  );
};

const parseWarehouses = async data => {
  let ret = {
    data: []
  };

  for (let i = 0; i < data.length; i++) {
    if (data[i].warehouseKey !== "A0") ret.data.push(data[i].description);
  }
  return ret;
};

const parseWarehousesItems = async data => {
  let ret = {
    data: []
  };

  for (let i = 0; i < data.length; i++) {
    let description = data[i].description;
    let itemID = data[i].itemKey;
    let targetWarehouse = data[i].materialsItemWarehouses[1].warehouse;

    for (let k = 0; k < data[i].materialsItemWarehouses.length; k++) {
      let stockBalance = data[i].materialsItemWarehouses[k].stockBalance;
      if (stockBalance !== 0) {
        let warehouseDescription =
          data[i].materialsItemWarehouses[k].warehouseDescription;
        ret.data.push([
          itemID,
          description,
          targetWarehouse,
          stockBalance,
          warehouseDescription
        ]);
      }
    }
  }

  return ret;
};

router.get("/", function(req, res, next) {
  warehouses()
    .then(async r => {
      let ret = await parseWarehouses(r.data);
      res.json(ret);
    })
    .catch(e => {
      res.json(e);
    });
});

router.get("/items", function(req, res, next) {
  items()
    .then(async r => {
      let ret = await parseWarehousesItems(r.data);
      res.json(ret);
    })
    .catch(e => {
      res.json(e);
    });
});

router.post("/transfer", function(req, res, next) {
  transferItems(req.body)
    .then(r => {
      res.json(r.data);
    })
    .catch(e => {
      res.json(e);
    });
});

module.exports = router;
