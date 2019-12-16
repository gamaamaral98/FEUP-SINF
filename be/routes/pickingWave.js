var express = require('express');
var router = express.Router();
var { PickingWave, Product } = require('../db');

router.post('/', function(req, res, next) {
    PickingWave.create()
    .then(pw => {
        req.body.map(e => {
            Product.create({
                key: e.product,
                quantity: e.quantity,
                sale: e.sale,
                warehouse: e.warehouse,
                index: e.index
            }).then(p => pw.addProduct(p))
        })
    })
});

router.get('/', function(req, res, next) {
    PickingWave.findAll().then(r => console.log(r));
});

module.exports = router;
