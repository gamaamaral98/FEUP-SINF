var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;
const company = 'DUDA';

var purchases = () => {
    return request('get', url + '/purchases/orders?', null);
}

router.get('/', function(req, res, next) {
    
    purchases()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

var placeOnWarehouse = (data) => {
    return request('post', url + '/goodsreceipt/processOrders/' + company, data);
}

router.post('/entry', function(req, res, next) {
    placeOnWarehouse(req.body)
    .then((r) => {
        purchases()
        .then((r) => {
            res.json(r.data);
        })
        .catch((e) => {
            res.json(e);
        });
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
