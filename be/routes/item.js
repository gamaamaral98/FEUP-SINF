var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;

var item = (key) => {
    return request('get', `${url}/materialscore/materialsitems/${key}`, null);
}

parseResponse = data => {
    let ret = {
        itemKey: data.itemKey,
        description: data.description,
        materialsItemWarehouses: [],
    }

    for(let warehouse in data.materialsItemWarehouses) {
        warehouse = data.materialsItemWarehouses[warehouse];
        let w = {
            warehouse: warehouse.warehouse,
            description: warehouse.warehouseDescription,
            stockBalance: warehouse.stockBalance,
        }
        ret.materialsItemWarehouses.push(w);
    }

    return ret;
}

router.get('/:key', function(req, res, next) { 
    item(req.params.key)
    .then((r) => {
        res.status(200).json(parseResponse(r.data));
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
