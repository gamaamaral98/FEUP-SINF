var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;

var warehouses = () => {
    return request('get', url + '/materialscore/warehouses', null);
}

var items = () => {
    return request('get', url + '/materialscore/materialsitems', null);
}

var transferItems = (data) => {
    return request('post', url + '/materialsmanagement/stockTransferOrders', data)
}

router.get('/', function(req, res, next) {
    
    warehouses()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

router.get('/items', function(req, res, next) {
    
    items()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

router.post('/transfer', function(req, res, next) {
    
    transferItems(req.body)
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
