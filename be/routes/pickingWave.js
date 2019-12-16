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
        index: e.index
      }).then(p => pw.addProduct(p));
    });
  });
});

router.get("/", async function(req, res, next) {
  let ret = [];

  let pws = await PickingWave.findAll();
  await Promise.all(
    pws.map(async pw => {
      let data = {
        id: pw.id,
        products: []
      };
      let ps = await pw.getProducts();
      ps.map(p =>
        data.products.push({
          key: p.key,
          description: p.description,
          quantity: p.quantity,
          sale: p.sale,
          warehouse: p.warehouse,
          index: p.index
        })
      );

      ret.push(data);
    })
  );
  res.json(ret);
});

module.exports = router;
