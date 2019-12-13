var express = require('express');
var router = express.Router();
var { request, get } = require('../utils/utils');

const url = process.env.URL;

var sales = () => {
    return request('get', url + '/sales/orders', null);
}

var salesPaginated = ({page, pageSize}) => {
    return get(url + '/sales/orders', {page, pageSize});
}

router.get('/', function(req, res, next) {
    
    sales()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

router.get('/page=:page&pageSize=:pageSize', function(req, res, next) {
    salesPaginated({
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

module.exports = router;
