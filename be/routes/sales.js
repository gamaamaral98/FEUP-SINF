var express = require("express");
var router = express.Router();
var { request, get } = require("../utils/utils");

const url = process.env.URL;
const host = process.env.HOST;
const company = "DUDA";

const salesPaginated = ({ page, pageSize }) => {
  return get(url + "/sales/orders", { page, pageSize });
};

const getItemWarehouse = item => {
  return item.materialsItemWarehouses.find(
    e => e.description !== "Entry" && e.description !== "Exit"
  );
};

const parseSale = async sale => {
  let ret = {
    naturalKey: sale.naturalKey,
    id: sale.id,
    documentLines: []
  };

  if (!sale.isActive || sale.isDeleted) return ret;

  await Promise.all(
    sale.documentLines.map(async documentLine => {
      if (documentLine.deliveredQuantity >= documentLine.quantity) return;

      let { data } = await get(`${host}/item/${documentLine.salesItem}`);

      let warehouse = getItemWarehouse(data);

      let line = {
        salesItem: documentLine.salesItem,
        description: documentLine.description,
        quantity: documentLine.quantity - documentLine.deliveredQuantity,
        warehouse: warehouse.description,
        stockBalance: warehouse.stockBalance,
        enoughStock: warehouse.stockBalance >= documentLine.quantity,
        index: documentLine.index + 1
      };

      ret.documentLines.push(line);
    })
  );
  return ret;
};

const parseResponse = async data => {
  let ret = {
    data: [],
    recordCount: 0
  };

  for (key in data.data) {
    let sale = await parseSale(data.data[key]);
    if (sale.documentLines.length === 0) continue;
    ret.data.push(sale);
    ret.recordCount++;
  }

  return ret;
};

const parseShip = async ship => {
  console.log(ship);
  let ret = {
    sourceDoc: "",
    item: "",
    quantity: 0
  };

  await Promise.all(
    ship.documentLines.map(async documentLine => {
      ret.sourceDoc = documentLine.sourceDoc;
      ret.item = documentLine.item;
      ret.quantity = documentLine.quantity;
    })
  );
  return ret;
};

const parseShipping = async data => {
  let ret = {
    data: []
  };

  for (key in data) {
    let ship = await parseShip(data[key]);
    ret.data.push(ship);
  }

  return ret;
};

const postProcessOrder = data => {
  return request("post", url + "/shipping/processOrders/" + company, data);
};

const getShippingDeliveries = () => {
  return get(url + "/shipping/deliveries");
};

router.get("/page=:page&pageSize=:pageSize", function(req, res, next) {
  salesPaginated({
    page: req.params.page,
    pageSize: req.params.pageSize
  })
    .then(async r => {
      try {
        let ret = await parseResponse(r.data);
        res.json(ret);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(e => {
      res.json(e);
    });
});

router.post("/processOrders", function(req, res, next) {
  postProcessOrder(req.body)
    .then(r => {
      res.json(r.data);
    })
    .catch(e => {
      res.json(e);
    });
});

router.get("/shipping", function(req, res, next) {
  getShippingDeliveries()
    .then(async r => {
      try {
        let ret = await parseShipping(r.data);
        res.json(ret);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(e => {
      res.json(e);
    });
});

const getProcessOrders = () => {
  return get(url + "/shipping/processOrders/1/50?company=DUDA");
};

const parseOrder = async order => {
  console.log(order);
  let ret = {
    sourceDoc: "",
    item: ""
  };

  await Promise.all(
    order.map(async processOrder => {
      ret.sourceDoc = processOrder.sourceDocKey;
      ret.item = processOrder.item;
    })
  );
  return ret;
};

const parseOrders = async data => {
  let ret = {
    data: []
  };

  for (key in data) {
    let obj = {
      sourceDoc: data[key].sourceDocKey,
      item: data[key].item
    };
    ret.data.push(obj);
  }

  return ret;
};

router.get("/orders", function(req, res, next) {
  getProcessOrders()
    .then(async r => {
      try {
        let ret = await parseOrders(r.data);
        res.json(ret);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(e => {
      res.json(e);
    });
});

module.exports = router;
