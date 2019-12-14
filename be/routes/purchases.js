var express = require('express');
var router = express.Router();
var { request, get } = require('../utils/utils');

const url = process.env.URL;
const company = 'DUDA';

var purchases = () => {
    return request('get', url + '/purchases/orders?', null);
}

var purchasesPaginated = ({page, pageSize}) => {
    return get(url + '/purchases/orders', {page, pageSize});
}

var placeOnWarehouse = (data) => {
    return request('post', url + '/goodsreceipt/processOrders/' + company, data);
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

router.get('/page=:page&pageSize=:pageSize', function(req, res, next) {
    
    purchasesPaginated({
        page: req.params.page,
        pageSize: req.params.pageSize
    })
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

router.post('/entry/page=:page&pageSize=:pageSize', function(req, res, next) {
    placeOnWarehouse(req.body)
    .then((r) => {
        purchasesPaginated({
            page: req.params.page,
            pageSize: req.params.pageSize
        })
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
