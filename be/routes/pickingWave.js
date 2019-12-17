var express = require("express");
var router = express.Router();
var { PickingWave, Product } = require("../db");

router.post("/", function(req, res, next) {
  PickingWave.create().then(pw => {
    req.body.map(e => {
      Product.create({
        key: e.product,
        description: e.description,
        quantity: e.quantity,
        sale: e.sale,
        warehouse: e.warehouse,
        index: e.index,
      }).then(p => pw.addProduct(p));
    });
  });
});

const parsePickingWave = async pw => {
  let data = {
    id: pw.id,
    state: pw.state,
    products: []
  };

  let ps = await pw.getProducts();
  ps.map(p =>
    data.products.push({
      key: p.key,
      description: p.description,
      quantity: p.quantity,
      pickedQuantity: p.pickedQuantity,
      sale: p.sale,
      warehouse: p.warehouse,
      index: p.index
    })
  );
  return data;
};

router.get("/", async function(req, res, next) {
  let ret = [];

  let pws = await PickingWave.findAll();
  await Promise.all(
    pws.map(async pw => {
      let data = await parsePickingWave(pw);
      ret.push(data);
    })
  );
  res.json(ret);
});

router.get("/:id", async function(req, res, next) {
  let pw = await PickingWave.findOne({ where: { id: req.params.id } });
  if (!pw) {
    next();
    return;
  }
  let data = await parsePickingWave(pw);
  res.json(data);
});

module.exports = router;
